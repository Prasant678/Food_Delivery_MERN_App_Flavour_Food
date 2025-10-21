import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/storeContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalAmount, token, food_list, url, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.map((item) => {
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id];
        orderItems.push(itemInfo);
      }
    });

    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalAmount() + 2,
      userId: localStorage.getItem("userId") // Make sure you have userId in localStorage
    };

    try {
      const response = await axios.post(url + "/api/v1/order/place", orderData, {
        headers: { token },
      });

      if (response.data.success) {
        const { order, key, newOrderId } = response.data;

        const options = {
          key: key,
          amount: order.amount,
          currency: "INR",
          name: "Flavour Food",
          description: "Food Order Payment",
          order_id: order.id,
          handler: async function (razorpayResponse) {
            try {
              console.log("Razorpay response:", razorpayResponse);

              const verifyRes = await axios.post(
                url + "/api/v1/order/verify",
                {
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                  orderId: newOrderId,
                },
                {
                  headers: { token },
                  timeout: 10000 // 10 seconds timeout
                }
              );

              console.log("Verification response:", verifyRes.data);

              if (verifyRes.data.success) {
                navigate('/order-success', {
                  state: {
                    paymentId: razorpayResponse.razorpay_payment_id,
                    orderId: newOrderId,
                    amount: order.amount / 100
                  },
                  replace: true
                });
              } else {
                console.error("Verification failed:", verifyRes.data.message);
                navigate('/order-failed', {
                  state: {
                    orderId: newOrderId,
                    error: verifyRes.data.message || "Payment verification failed"
                  },
                  replace: true
                });
              }
            } catch (error) {
              console.error("Verification error:", error);
              navigate('/order-failed', {
                state: {
                  orderId: newOrderId,
                  error: error.response?.data?.message ||
                    error.message ||
                    "Error during payment verification"
                },
                replace: true
              });
            }
          },
          prefill: {
            name: data.firstName + " " + data.lastName,
            email: data.email,
            contact: data.phone,
          },
          notes: {
            address: `${data.street}, ${data.city}, ${data.state} - ${data.zipcode}`,
          },
          theme: {
            color: "#3399cc",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          navigate('/order-failed', {
            state: {
              orderId: newOrderId,
              error: response.error.description || "Payment failed"
            }
          });
        });
        rzp.open();
      } else {
        alert("Failed to create order");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      alert("Something went wrong while placing the order");
    }
  }

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='your email-Id' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>
        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="number" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="number" placeholder='phone-no' />
      </div>
      <div className="place-order-right">
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
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
