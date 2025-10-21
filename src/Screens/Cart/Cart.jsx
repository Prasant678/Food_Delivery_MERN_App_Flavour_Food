import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/storeContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalAmount } = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-title">
          <span>Items</span>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div>
                <div className="cart-title cart-item">
                  <img src={item.image && item.image.url} alt="" />
                  <p>{item.name}</p>
                  <p>₹ {item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>₹ {item.price * cartItems[item._id]}</p>
                  <div>
                    <img onClick={()=>removeFromCart(item._id)} className='trash' src={assets.trash_icon} alt="" />
                  </div> 
                </div>
  
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Total</h2>
          <div>
            <div className="cart-total-details">
              <p>SubTotal</p>
              <p>₹ {getTotalAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Charge</p>
              <p>₹ {getTotalAmount() === 0 ? 0 : 2}</p>
            </div>
            <div className="cart-total-details">
              <p>Grand Total</p>
              <p>₹ {getTotalAmount() === 0 ? 0 : getTotalAmount() + 2}</p>
            </div>
          </div>
          <button onClick={()=>navigate('/placeorder')}>PROCEED TO CHECKOUT</button>
        </div>
        <div className="cart-promo">
          <div>
            <p>If you have any promo code, Enter it here</p>
            <div className="cart-input">
              <input type="text" placeholder='Enter Promo Code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
