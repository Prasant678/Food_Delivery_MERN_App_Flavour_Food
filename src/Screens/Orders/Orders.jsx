import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { StoreContext } from '../../Context/storeContext';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Orders.css';
import { toast } from 'react-toastify';

const Orders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/order/user/all`, {
        headers: { token },
      });
      if (res.data.success) {
        const allOrders = res.data.orders;
        setOrders(allOrders);
        setFilteredOrders(allOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      const res = await axios.put(`${url}/api/v1/order/cancel/${orderId}`, {}, {
        headers: { token },
      });
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
        setFilteredOrders((prev) =>
          prev.map((order) =>
            order._id === orderId ? { ...order, status: 'Cancelled' } : order
          )
        );
        toast.success('Order cancelled successfully!');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order.');
    }
  };

  const handleFilter = async () => {
    if (!fromDate || !toDate) {
      toast.error('Please select both From and To dates!');
      return;
    }

    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const res = await axios.get(`${url}/api/v1/order/user/filter`, {
        headers: { token },
        params: {
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        },
      });

      if (res.data.success) {
        setFilteredOrders(res.data.orders);
        if (res.data.orders.length === 0) {
          toast.info("No orders found for selected date range.");
        } else {
          toast.success("Orders filtered successfully!");
        }
      }
    } catch (error) {
      console.error("Error filtering user orders:", error);
      toast.error("Error filtering user orders");
    }
  };

  const resetFilter = () => {
    setFilteredOrders(orders);
    setFromDate('');
    setToDate('');
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      <div className="date-filter-section">
        <label>
          From:{' '}
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            placeholderText="Select a Date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="custom-date-picker"
            showDisabledMonthNavigation
          />
        </label>

        <label>
          To:{' '}
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            placeholderText="Select a Date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="custom-date-picker"
            showDisabledMonthNavigation
          />
        </label>

        <button className="filter-btn" onClick={handleFilter}>Filter</button>
        <button className="reset-btn" onClick={resetFilter}>Reset</button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-header-left">
                  <p><b>Order ID:</b> {order._id}</p>
                  <p><b>Amount:</b> ₹ {order.amount}</p>
                </div>
                <div className="order-header-right">
                  <p><b>Status:</b> {order.status}</p>
                  <p><b>Payment:</b> {order.payment ? 'Paid ✅' : 'Pending ❌'}</p>
                </div>
              </div>

              <div className="order-actions">
                <button
                  onClick={() => navigate(`/order/${order._id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>

                <div className="order-timestamps">
                  <p><b>Placed On:</b> {new Date(order.createdAt).toLocaleString()}</p>
                  <p><b>Last Updated:</b> {new Date(order.updatedAt).toLocaleString()}</p>
                </div>

                {order.status === 'Food Processing' ? (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    className="cancel-btn"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <button disabled className="cancel-btn">
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;