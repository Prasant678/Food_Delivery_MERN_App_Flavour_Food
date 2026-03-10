import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [food_list, setFood_list] = useState([]);
  const url = "https://food-delivery-mern-app-flavour-food.onrender.com";

  const addToCart = async (itemId) => {
    if (!token) {
      toast.warn("Please login first!");
      return;
    }
    setCartItems((prev = {}) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }));

    try {
      await axios.post(`${url}/api/v1/cart/add`, { itemId }, { headers: { token } });
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev = {}) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 0),
    }));

    try {
      await axios.post(`${url}/api/v1/cart/remove`, { itemId }, { headers: { token } });
    } catch (err) {
      console.error("Remove from cart failed:", err);
    }
  };

  const getTotalAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      if (cartItems[id] > 0) {
        const item = food_list.find((p) => p._id === id);
        if (item) total += item.price * cartItems[id];
      }
    }
    return total;
  };

  const getDeliveryCharge = () => {
    const total = getTotalAmount();
    if (total === 0) return 0;
    if (total >= 1200) return 0;
    if (total >= 800) return total * 0.04;
    if (total >= 500) return total * 0.05;
    return total * 0.06;
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/v1/food/list`);
      setFood_list(response.data.data.reverse());
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(`${url}/api/v1/cart/get`, {}, { headers: { token } });
      setCartItems(response.data.cartData || {});
    } catch (err) {
      console.error("Failed to load cart data:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalAmount,
    getDeliveryCharge,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;