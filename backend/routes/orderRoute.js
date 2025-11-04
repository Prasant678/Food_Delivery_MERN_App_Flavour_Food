import express from 'express';
import {
  razorpayCreateOrder,
  createOrderAfterPayment,
  getOrderDetails,
  getUserOrders,
  cancelUserOrder,
  getAllOrders,
  getAdminOrderDetails,
  updateOrderStatus,
  filterUserOrders,
  filterAdminOrders
} from '../controller/orderController.js';
import authMiddleware from '../middleware/auth.js';

const orderRouter = express.Router();

orderRouter.post("/razorpay-create", authMiddleware, razorpayCreateOrder);

orderRouter.post("/create-after-payment", authMiddleware, createOrderAfterPayment);

orderRouter.get("/user/all", authMiddleware, getUserOrders);
orderRouter.get("/:orderId", authMiddleware, getOrderDetails);
orderRouter.put("/cancel/:orderId", authMiddleware, cancelUserOrder);

orderRouter.get("/user/filter", authMiddleware, filterUserOrders);
orderRouter.get("/admin/filter", filterAdminOrders);

orderRouter.get("/admin/all", getAllOrders);
orderRouter.get("/admin/:orderId", getAdminOrderDetails);
orderRouter.put("/admin/update/:orderId", updateOrderStatus);

export default orderRouter;