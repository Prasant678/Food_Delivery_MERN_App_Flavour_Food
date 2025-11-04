import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import { instance } from "../server.js";
import crypto from 'crypto';

const razorpayCreateOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
    };

    const razorpayOrder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      key: process.env.RAZORPAY_API_KEY
    });
  } catch (error) {
    console.error("razorpayCreateOrder error:", error);
    res.status(500).json({ success: false, message: "Failed to create Razorpay order" });
  }
};

const createOrderAfterPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      amount,
      address
    } = req.body;

    const userId = req.body.userId || req.body.userIdFromToken;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !items || !amount || !address) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_API_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: true,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    });

    const saved = await newOrder.save();

    try {
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }

    res.status(200).json({ success: true, message: "Order created", order: saved });
  } catch (error) {
    console.error("createOrderAfterPayment error:", error);
    res.status(500).json({ success: false, message: "Server error creating order" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.userId;
    const order = await orderModel.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching order details" });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const userId = req.body.userId;
    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};

const cancelUserOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.body.userId;

    const order = await orderModel.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.status !== "Food Processing") {
      return res.status(400).json({ success: false, message: "Cannot cancel this order" });
    }

    order.status = "Cancelled by User";
    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error cancelling order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true"; // temp check
    if (!isAdmin) return res.status(403).json({ success: false, message: "Not authorized" });

    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching all orders" });
  }
};

const getAdminOrderDetails = async (req, res) => {
  try {
    const isAdmin = req.query.admin === "true";
    if (!isAdmin) return res.status(403).json({ success: false, message: "Not authorized" });

    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching admin order details" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const isAdmin = req.query.admin === "true";
    if (!isAdmin) return res.status(403).json({ success: false, message: "Not authorized" });

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error updating order status" });
  }
};

const filterUserOrders = async (req, res) => {
  try {
    const userId = req.body.userId;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: "Please provide startDate and endDate" });
    }

    const orders = await orderModel.find({
      userId,
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("filterUserOrders error:", error);
    res.status(500).json({ success: false, message: "Error filtering user orders" });
  }
};

const filterAdminOrders = async (req, res) => {
  try {
    const { startDate, endDate, admin } = req.query;

    if (!admin || admin !== "true") {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide startDate and endDate" });
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const orders = await orderModel
      .find({
        createdAt: {
          $gte: start,
          $lte: end,
        },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
      message:
        orders.length > 0
          ? "Orders filtered successfully"
          : "No orders found in selected range",
    });
  } catch (error) {
    console.error("filterAdminOrders error:", error);
    res
      .status(500)
      .json({ success: false, message: "Error filtering admin orders" });
  }
};


export {
  razorpayCreateOrder,
  createOrderAfterPayment,
  getOrderDetails,
  getUserOrders,
  cancelUserOrder,
  getAllOrders,
  getAdminOrderDetails,
  updateOrderStatus,
  filterUserOrders,
  filterAdminOrders,
};