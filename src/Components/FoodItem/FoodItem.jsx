import React, { useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/storeContext';

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
  return (
    <div className='food-item'>
      <div className="food-item-img">
        <img className='food-item-image' src={image.url} alt="" />
        {!cartItems?.[id]
          ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
          : <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="" />
            <p>{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="" />
          </div>
        }
      </div>
      <div className="food-item-info">
        <p className='food-item-title'>{name}</p>
        <p className='food-item-desc'>{description.length > 50 ? description.slice(0, 100) + '...' : description}</p>
        <div className="food-item-name-rating">
          <p className='food-item-price'>₹ {price}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
      </div>
    </div>
  )
}

export default FoodItem
