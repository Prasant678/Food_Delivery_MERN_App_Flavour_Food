import express from "express";
import cors from 'cors'
import { ConnectDB } from "./config/db.js";
import mongoose from "mongoose";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cloudinary from 'cloudinary';
import 'dotenv/config'
import fileUpload from "express-fileupload";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import Razorpay from 'razorpay'

const app = express();
const port = 5000;

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET
})

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

app.use(express.json());
app.use(cors({
    origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_ADMIN],
    credentials: true
}));

app.use(fileUpload({
    useTempFiles: true
}))

ConnectDB();

app.use("/api/v1/food", foodRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);

app.get("/", (req, res) => {
    res.send("API Working");
})

// Health check endpoint (Keep-Alive for Render & MongoDB Atlas)
const handleHealthCheck = async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbStatusMap = {
            0: "Disconnected",
            1: "Connected",
            2: "Connecting",
            3: "Disconnecting"
        };

        let dbPingMs = null;
        // Ping MongoDB cluster if connected
        if (dbState === 1 && mongoose.connection.db) {
            const start = Date.now();
            await mongoose.connection.db.admin().ping();
            dbPingMs = Date.now() - start;
        }

        res.status(200).json({
            success: true,
            message: "Server and Database are active",
            timestamp: new Date().toISOString(),
            uptimeSeconds: Math.floor(process.uptime()),
            database: {
                status: dbStatusMap[dbState] || "Unknown",
                readyState: dbState,
                pingMs: dbPingMs
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Health check encountered an issue",
            error: error.message
        });
    }
};

app.get("/health", handleHealthCheck);
app.get("/api/v1/health", handleHealthCheck);

app.listen(port, () => {
    console.log(`server started on http://localhost:${port}`)
})
