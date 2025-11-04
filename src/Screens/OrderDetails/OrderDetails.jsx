import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../Context/storeContext';
import './OrderDetails.css';

const OrderDetails = () => {
    const { orderId } = useParams();
    const { url, token } = useContext(StoreContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchOrderDetails = async () => {
        try {
            const res = await axios.get(`${url}/api/v1/order/${orderId}`, {
                headers: { token },
            });
            if (res.data.success) {
                setOrder(res.data.order);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token && orderId) fetchOrderDetails();
    }, [token, orderId]);

    if (loading) return <p>Loading order details...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="order-details-container">
             <Link to="/orders" className="back-link">
                ← Back to Orders
            </Link>
            <h2>Order Details</h2>
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Amount:</b> ₹ {order.amount}</p>
            <p><b>Status:</b> {order.status}</p>
            <p><b>Payment:</b> {order.payment ? 'Paid ✅' : 'Pending ❌'}</p>

            <h3>Items:</h3>
            <ul>
                {order.items.map((item, idx) => (
                    <li key={idx}>
                        {item.name} × {item.quantity}
                    </li>
                ))}
            </ul>

            <h3>Address:</h3>
            {order.address ? (
                <p>
                    {order.address.firstName} {order.address.lastName}, {order.address.street},{' '}
                    {order.address.city}, {order.address.state}, {order.address.zipcode},{' '}
                    {order.address.country}. <br />
                    <b>Phone:</b> {order.address.phone}
                </p>
            ) : (
                <p>No address found</p>
            )}
        </div>
    );
};

export default OrderDetails;