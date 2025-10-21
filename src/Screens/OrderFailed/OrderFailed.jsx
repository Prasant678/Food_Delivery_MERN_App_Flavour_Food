import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrderFailed.css'

const OrderFailed = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="order-failed-container">
      <div className="failed-icon">✕</div>
      <h2>Payment Failed</h2>
      <p>We couldn't process your payment.</p>
      
      {location.state?.error && (
        <p className="error-message">Reason: {location.state.error}</p>
      )}

      {location.state?.orderId && (
        <p>Your order ID: {location.state.orderId}</p>
      )}

      <div className="actions">
        <button className="bt" onClick={() => navigate('/cart')}>Retry Payment</button>
        <button className="bt" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  )
}

export default OrderFailed