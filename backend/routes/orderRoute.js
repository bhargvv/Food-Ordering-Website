import express from "express";
import authMiddleware from "../middleware/auth.js";
import { listOrders, placeOrder, updateStatus, userOrders,verifyOrder } from "../controllers/orderController.js";

const orderRouter = express.Router();
orderRouter.post("/placeorder",authMiddleware, placeOrder);
orderRouter.post("/verifyorder", authMiddleware, verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/listorders", authMiddleware, listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;