import React, { useContext, useState, useRef, useEffect } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/storeContext';
import FoodItem from '../FoodItem/FoodItem';
import { assets } from '../../assets/assets';

const FoodDisplay = ({ category }) => {
  const { food_list } = useContext(StoreContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = category === 'All' ? 16 : 12;
  const foodDisplayRef = useRef(null);

  const filteredFood = food_list.filter((item) => {
    const matchCategory = category === 'All' || category === item.category;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredFood.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFood.slice(indexOfFirstItem, indexOfLastItem);

  useEffect(() => {
    setCurrentPage(1);
  }, [category, searchQuery]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    if (foodDisplayRef.current) {
      foodDisplayRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleClearSearch = () => setSearchQuery('');

  return (
    <div className="food-display" id="food-display" ref={foodDisplayRef}>
      <div className="food-display-header">
        <h2>Top dishes near you</h2>

        <div className="food-search">
          <img src={assets.search_icon} alt="search" className="search-icon" />
          <input
            type="text"
            placeholder="Search food..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <img
              src={assets.close_icon}
              alt="clear"
              className="clear-icon"
              onClick={handleClearSearch}
            />
          )}
        </div>
      </div>

      <div className="food-display-list">
        {currentItems.length > 0 ? (
          currentItems.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p style={{ color: '#ccc', textAlign: 'center' }}>No items found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &#171;
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`page-number ${currentPage === index + 1 ? 'active' : ''}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="page-btn"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &#187;
          </button>
        </div>
      )}
    </div>
  );
};

export default FoodDisplay;