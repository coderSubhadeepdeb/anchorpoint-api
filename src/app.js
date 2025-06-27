import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const app = express()

const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : []; // Fallback if missing

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, Postman)
        if (!origin) return callback(null, true);
    
        // Check against allowed origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Block unauthorized domains
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Required for cookies/auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Explicit methods (optional but recommended)
    allowedHeaders: ['Content-Type', 'Authorization'], // Required if using auth headers
    // optionsSuccessStatus: 204 // (Optional, default is fine)
}));

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

import adminRouter from "./routes/admin.routes.js";
import projectRouter from "./routes/project.routes.js";
import contactRouter from "./routes/contact.routes.js";


app.use("/api/v1/admins", adminRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/contact", contactRouter);

export { app }