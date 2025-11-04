import React, { useEffect, useState } from 'react';
import './List.css';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = () => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const categories = [
    "All",
    "Salad",
    "Street Delights",
    "Pizza",
    "Chinese",
    "Pure Veg",
    "Non Veg",
    "North Indian",
    "Biryani & Rice",
    "South Indian",
    "Desserts",
    "Beverages",
  ];

  const fetchList = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/v1/food/list");
      if (response.data.success) {
        const reversedData = response.data.data.reverse();
        setList(reversedData);
        setFilteredList(reversedData);
      } else {
        toast.error("Error fetching foods");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post("http://localhost:5000/api/v1/food/remove", { id: foodId });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  };

  const handleCategoryChange = (e) => {
    const selected = e.target.value;
    setSelectedCategory(selected);
    if (selected === "All") {
      setFilteredList(list);
    } else {
      const filtered = list.filter(item => item.category === selected);
      setFilteredList(filtered);
    }
  };

  const handleEditClick = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleUpdate = async () => {
  try {
    const response = await axios.put(`http://localhost:5000/api/v1/food/update/${editItem._id}`, {
      name: editItem.name,
      description: editItem.description,
      price: editItem.price,
      category: editItem.category,
    });

    if (response.data.success) {
      toast.success("Product updated successfully!");
      setShowModal(false);
      fetchList();
    } else {
      toast.error("Failed to update product");
    }
  } catch (error) {
    console.error(error);
    toast.error("Server error");
  }
};


  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className='list add flex-col'>
      <p>{selectedCategory === "All" ? "All Food List" : `${selectedCategory} Food List`}</p>

      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <div className="category-header">
            <b>Category</b>
            <select value={selectedCategory} onChange={handleCategoryChange} className="category-dropdown">
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <b>Price</b>
          <b>Update</b>
          <b>Action</b>
        </div>

        {filteredList.length === 0 ? (
          <p className="no-products">No products found</p>
        ) : (
          filteredList.map((item, index) => (
            <div key={index} className="list-table-format">
              <img src={item.image?.url} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>₹ {item.price}</p>
              <p className='edit-icon' onClick={() => handleEditClick(item)}>
                ✏️
              </p>
              <p onClick={() => removeFood(item._id)} className="cursor">✕</p>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <label>Name:</label>
            <input
              type="text"
              value={editItem.name}
              onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            />
            <label>Description:</label>
            <textarea
              rows="4"
              value={editItem.description}
              onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            />
            <label>Price:</label>
            <input
              type="number"
              value={editItem.price}
              onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            />
            <label>Category:</label>
            <select
              value={editItem.category}
              onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
            >
              {categories.slice(1).map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button className="cancel" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default List;
