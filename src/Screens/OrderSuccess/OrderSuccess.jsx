import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../Context/storeContext'
import './OrderSuccess.css'

const OrderSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { url, token } = useContext(StoreContext)
  const [orderDetails, setOrderDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!location.state?.orderId) {
      navigate('/')
      return
    }

    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`${url}/api/v1/order/${location.state.orderId}`, {
          headers: { token }
        })
        
        if (response.data.success) {
          setOrderDetails(response.data.order)
        } else {
          console.error('Failed to fetch order details')
        }
      } catch (error) {
        console.error('Error fetching order details:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [location.state?.orderId, navigate, token, url])

  if (loading) {
    return <div className="order-success-container">Loading...</div>
  }

  if (!orderDetails) {
    return (
      <div className="order-success-container">
        <h2>Order Not Found</h2>
        <p>We couldn't find your order details.</p>
        <button className="bt" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    )
  }

  return (
    <div className="order-success-container">
      <div className="success-icon">✓</div>
      <h2>Payment Successful</h2>
      <p className='order-p'>Thank you for your order!</p>
      
      <div className="order-details">
        <h3>Order Summary</h3>
        <p><strong>Order ID:</strong> {orderDetails._id}</p>
        <p><strong>Payment ID:</strong> {orderDetails.razorpay_payment_id}</p>
        <p><strong>Amount Paid:</strong> ₹{orderDetails.amount}</p>
        <p><strong>Status:</strong> {orderDetails.status}</p>
        <p><strong>Date:</strong> {new Date(orderDetails.date).toLocaleString()}</p>
      </div>

      <div className="delivery-details">
        <h3>Delivery Address</h3>
        <p>{orderDetails.address.firstName} {orderDetails.address.lastName}</p>
        <p>{orderDetails.address.street}</p>
        <p>{orderDetails.address.city}, {orderDetails.address.state} - {orderDetails.address.zipcode}</p>
        <p>{orderDetails.address.country}</p>
        <p>Phone: {orderDetails.address.phone}</p>
      </div>

      <div className="order-items">
        <h3>Items Ordered</h3>
        <ul>
          {orderDetails.items.map((item, index) => (
            <li key={index}>
              {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </li>
          ))}
        </ul>
      </div>

      <button className="bt-s" onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  )
}

export default OrderSuccess