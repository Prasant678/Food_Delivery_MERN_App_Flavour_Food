import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Orders = () => {
  const url = "http://localhost:5000";
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const navigate = useNavigate();

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get(`${url}/api/v1/order/admin/all?admin=true`);
      if (res.data.success) {
        const all = res.data.orders;
        setOrders(all);
        setFilteredOrders(all);
      }
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await axios.put(
        `${url}/api/v1/order/admin/update/${orderId}?admin=true`,
        { status: newStatus }
      );
      if (res.data.success) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
        setFilteredOrders((prev) =>
          prev.map((o) =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
        toast.success("Order status updated!");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const statusFiltered =
    filterStatus === "All"
      ? filteredOrders
      : filteredOrders.filter((order) => order.status === filterStatus);

  const handleDateFilter = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select both From and To dates!");
      return;
    }

    const startOfDay = new Date(fromDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(toDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const res = await axios.get(`${url}/api/v1/order/admin/filter`, {
        params: {
          admin: true,
          startDate: startOfDay.toISOString(),
          endDate: endOfDay.toISOString(),
        },
      });

      if (res.data.success) {
        setFilteredOrders(res.data.orders.reverse());
        if (res.data.orders.length === 0) {
          toast.info("No orders found for selected date range.");
        } else {
          toast.success("Orders filtered successfully!");
        }
      }
    } catch (error) {
      console.error("Error filtering admin orders:", error);
      toast.error("Error filtering admin orders.");
    }
  };

  const resetDateFilter = () => {
    setFilteredOrders(orders);
    setFromDate("");
    setToDate("");
    toast.info("Date filter reset.");
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">All Orders</h2>

      <div className="date-filter-section">
        <label>
          From:{" "}
          <DatePicker
            selected={fromDate}
            onChange={(date) => setFromDate(date)}
            placeholderText="Select From Date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="custom-date-picker"
            showDisabledMonthNavigation
          />
        </label>

        <label>
          To:{" "}
          <DatePicker
            selected={toDate}
            onChange={(date) => setToDate(date)}
            placeholderText="Select To Date"
            dateFormat="dd/MM/yyyy"
            maxDate={new Date()}
            className="custom-date-picker"
            showDisabledMonthNavigation
          />
        </label>

        <button className="filter-btn" onClick={handleDateFilter}>
          Filter
        </button>
        <button className="reset-btn" onClick={resetDateFilter}>
          Reset
        </button>
      </div>

      <div className="filter-container">
        <label htmlFor="filter"><b>Filter by Status:</b></label>
        <select
          id="filter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Food Processing">Food Processing</option>
          <option value="Out for Delivery">Out for Delivery</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled by Admin">Cancelled by Admin</option>
          <option value="Cancelled by User">Cancelled by User</option>
        </select>
      </div>

      {statusFiltered.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="admin-orders-grid">
          {statusFiltered.map((order) => (
            <div key={order._id} className="admin-order-card">
              <div className="admin-order-header">
                <div className="admin-left">
                  <p style={{ marginBottom: "0.8rem" }}>
                    <b>Order ID:</b> {order._id}
                  </p>
                  <p>
                    <b>User ID:</b> {order.userId}
                  </p>
                </div>
                <div className="admin-right">
                  <p style={{ marginBottom: "0.8rem" }}>
                    <b>Amount:</b> ₹{order.amount}
                  </p>
                  <p>
                    <b>Payment:</b> {order.payment ? "Paid ✅" : "Pending ❌"}
                  </p>
                </div>
              </div>

              <div className="admin-order-actions">
                <button
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="view-details-btn"
                >
                  View Details
                </button>

                <div className="order-timestamps">
                  <p>
                    <b>Placed On:</b>{" "}
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <b>Last Updated:</b>{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>

                <div className="drop">
                  <label>
                    <b>Status:</b>
                  </label>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateStatus(order._id, e.target.value)
                    }
                    className="status-dropdown"
                    disabled={order.status === "Cancelled by User"}
                  >
                    <option value="Food Processing">Food Processing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled by Admin">
                      Cancelled by Admin
                    </option>
                    <option value="Cancelled by User">Cancelled by User</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
