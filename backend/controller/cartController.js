import userModel from "../models/userModel.js";

const addToCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId)
      return res.json({ success: false, message: "Missing userId or itemId" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item added to cart" });
  } catch (error) {
    console.log("Add to cart error:", error);
    res.json({ success: false, message: "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { userId, itemId } = req.body;
    if (!userId || !itemId)
      return res.json({ success: false, message: "Missing userId or itemId" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Item removed from cart" });
  } catch (error) {
    console.log("Remove from cart error:", error);
    res.json({ success: false, message: "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    if (!userData) return res.json({ success: false, message: "User not found" });

    const cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.log("Get cart error:", error);
    res.json({ success: false, message: "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
