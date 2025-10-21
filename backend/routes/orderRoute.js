import express from 'express'
import { placeOrder, verify, getOrderDetails } from '../controller/orderController.js'
import authMiddleware from '../middleware/auth.js'

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify-payment", authMiddleware, verify);
orderRouter.get("/:orderId", authMiddleware, getOrderDetails);

export default orderRouter;