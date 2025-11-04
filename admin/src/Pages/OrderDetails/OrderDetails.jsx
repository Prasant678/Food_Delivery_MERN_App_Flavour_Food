import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./OrderDetails.css";

const OrderDetails = () => {
    const { orderId } = useParams();
    const url = "http://localhost:5000";
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`${url}/api/v1/order/admin/${orderId}?admin=true`);
            if (res.data.success) {
                setOrder(res.data.order);
            } else {
                console.error("Failed to fetch order details");
            }
        } catch (error) {
            console.error("Error fetching admin order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [orderId]);

    if (loading) return <p className="loading">Loading order details...</p>;
    if (!order) return <p className="not-found">Order not found!</p>;

    return (
        <div className="admin-order-details-container">
            <Link to="/orders" className="back-link">
                ← Back to Orders
            </Link>

            <h2 className="page-title">Order Details</h2>

            <div className="order-details-card">
                <div className="order-info">
                    <div className="info-section">
                        <p><b>Order ID:</b> {order._id}</p>
                        <p><b>Amount:</b> ₹{order.amount}</p>
                        <p><b>Payment:</b> {order.payment ? "Paid ✅" : "Pending ❌"}</p>
                        <p><b>Status:</b> {order.status}</p>
                    </div>

                    <div className="info-section-right">
                        <p><b>User ID:</b> {order.userId}</p>
                        <p><b>Created:</b> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><b>Last Updated:</b> {new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="address-section">
                    <h3>Shipping Address</h3>
                    <p>{order.address.street}, {order.address.city}</p>
                    <p>{order.address.state}, {order.address.zip}</p>
                    <p><b>Phone:</b> {order.address.phone}</p>
                </div>

                <div className="items-section">
                    <h3>Items</h3>
                    {order.items && order.items.length > 0 ? (
                        <ul className="items-list">
                            {order.items.map((item, i) => (
                                <li key={i} className="item">
                                    <div className="item-info">
                                        <div className="info">
                                            <p><b>{item.name}</b></p>
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                        <p>Price: ₹{item.price}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No items found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
