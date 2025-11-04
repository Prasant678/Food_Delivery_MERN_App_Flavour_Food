import React, { useContext, useMemo, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/storeContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const { getTotalAmount, token, food_list, url, cartItems, getDeliveryCharge, setCartItems } = useContext(StoreContext);
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
    setData(prev => ({ ...prev, [name]: value }));
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    let orderItems = [];
    food_list.forEach((item) => {
      if (cartItems[item._id] > 0) {
        const itemInfo = { ...item, quantity: cartItems[item._id] };
        orderItems.push(itemInfo);
      }
    });

    const totalAmount = getTotalAmount() === 0 ? 0 : getTotalAmount() + getDeliveryCharge();

    try {
      const razorRes = await axios.post(
        `${url}/api/v1/order/razorpay-create`,
        { amount: totalAmount },
        { headers: { token } }
      );

      if (!razorRes.data.success) {
        toast.error("Unable to create payment. Try again.");
        return;
      }

      const razorOrder = razorRes.data.order;
      const key = razorRes.data.key;

      const options = {
        key: key,
        amount: razorOrder.amount,
        currency: "INR",
        name: "Flavour Food",
        description: "Food Order Payment",
        order_id: razorOrder.id,
        handler: async function (razorpayResponse) {
          try {
            const createRes = await axios.post(
              `${url}/api/v1/order/create-after-payment`,
              {
                razorpay_order_id: razorpayResponse.razorpay_order_id,
                razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                razorpay_signature: razorpayResponse.razorpay_signature,
                items: orderItems,
                amount: totalAmount,
                address: {
                  firstName: data.firstName,
                  lastName: data.lastName,
                  email: data.email,
                  street: data.street,
                  city: data.city,
                  state: data.state,
                  zipcode: data.zipcode,
                  country: data.country,
                  phone: data.phone
                },
              },
              { headers: { token }, timeout: 15000 }
            );

            if (createRes.data.success) {
              setCartItems({});
              navigate('/order-success', {
                state: {
                  paymentId: razorpayResponse.razorpay_payment_id,
                  orderId: createRes.data.order._id,
                  amount: totalAmount
                },
                replace: true
              });
            } else {
              navigate('/order-failed', {
                state: {
                  orderId: null,
                  error: createRes.data.message || "Payment verification failed"
                },
                replace: true
              });
            }
          } catch (err) {
            console.error("create-after-payment error:", err);
            navigate('/order-failed', {
              state: {
                orderId: null,
                error: err.response?.data?.message || err.message || "Error creating order after payment"
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
        console.error("razorpay payment.failed:", response);
        navigate('/order-failed', {
          state: {
            orderId: null,
            error: response.error?.description || "Payment failed"
          }
        });
      });

      rzp.open();

    } catch (error) {
      console.error("Error in placeOrder flow:", error);
      toast.error("Something went wrong while placing the order. Try again.");
    }
  }

  const subTotal = useMemo(() => getTotalAmount(), [cartItems]);
  const deliveryCharge = useMemo(() => getDeliveryCharge(), [cartItems]);
  const grandTotal = useMemo(() => subTotal + deliveryCharge, [subTotal, deliveryCharge]);

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
              <p>₹ {subTotal.toFixed(2)}</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Charge</p>
              <p>{subTotal >= 1200 ? "Free" : `₹ ${deliveryCharge.toFixed(2)}`}</p>
            </div>
            <div className="cart-total-details">
              <p>Grand Total</p>
              <p>₹ {subTotal === 0 ? 0 : grandTotal.toFixed(2)}</p>
            </div>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder