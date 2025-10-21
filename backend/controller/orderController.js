import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js"
import { instance } from "../server.js";
import crypto from 'crypto';

const placeOrder = async (req, res) => {
    try {
        const { userId, items, amount, address } = req.body;

        const newOrder = new orderModel({
            userId,
            items,
            amount,
            address,
            status: "Food Processing",
            payment: false // Explicitly setting to false
        });
        await newOrder.save();
        await userModel.findByIdAndUpdate(userId, { cartData: {} });

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const order = await instance.orders.create(options);

        res.status(200).json({
            success: true,
            order,
            newOrderId: newOrder._id,
            key: process.env.RAZORPAY_API_KEY,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
}

const verify = async (req, res) => {
    console.log("Verification request received:", req.body); // Add this for debugging
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
            console.log("Missing parameters in request");
            return res.status(400).json({ 
                success: false, 
                message: "Missing required parameters" 
            });
        }

        const secret = process.env.RAZORPAY_API_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', secret)
            .update(body)
            .digest('hex');

        console.log("Generated signature:", expectedSignature);
        console.log("Received signature:", razorpay_signature);

        if (expectedSignature === razorpay_signature) {
            console.log("Signature valid, updating order:", orderId);
            const updatedOrder = await orderModel.findByIdAndUpdate(
                orderId,
                { 
                    payment: true,
                    razorpay_payment_id,
                    razorpay_order_id,
                    razorpay_signature,
                    status: "Order Placed"
                },
                { new: true }
            );

            if (!updatedOrder) {
                console.log("Order not found with ID:", orderId);
                return res.status(404).json({ 
                    success: false, 
                    message: "Order not found" 
                });
            }

            console.log("Order successfully updated:", updatedOrder);
            return res.json({ 
                success: true, 
                message: "Payment verified and order updated",
                order: updatedOrder
            });
        } else {
            console.log("Signature mismatch");
            return res.status(400).json({ 
                success: false, 
                message: "Invalid signature" 
            });
        }
    } catch (error) {
        console.error("Verification error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Server error during verification",
            error: error.message 
        });
    }
};

const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, order });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error fetching order details" });
    }
}

export { placeOrder, verify, getOrderDetails }