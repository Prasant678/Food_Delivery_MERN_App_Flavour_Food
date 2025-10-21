import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Verify.css';

const Verify = () => {
  const location = useLocation();
  const { state } = location;
  const isSuccess = state?.success;

  return (
    <div className="order-success-container">
      {isSuccess ? (
        <div className="order-success-card">
          <h1>🎉 Payment Successful!</h1>
          <p>Thank you for your order. Your food is being prepared 🍽️</p>
          <p>Payment ID: {state?.paymentId}</p>
          <Link to="/" className="home-link">
            Back to Home
          </Link>
        </div>
      ) : (
        <div className="order-failed-card">
          <h1>❌ Payment Failed</h1>
          <p>{state?.error || 'There was an issue processing your payment.'}</p>
          <Link to="/placeorder" className="try-again-link">
            Try Again
          </Link>
          <Link to="/" className="home-link">
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
};

export default Verify;