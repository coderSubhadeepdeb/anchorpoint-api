import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import contactRoutes from "./routes/contact.routes.js";
import logger from "./middlewares/logger.js";
const app = express()
import gallery from './routes/gallery.js';// Gallery routes for Cloudinary Nishanta
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use(logger);
app.use("/", contactRoutes);// Contact routes for naodemailer
app.use('/api/gallery', gallery);// CLoudinary gallery routes Nishanta

import adminRouter from "./routes/admin.routes.js";

app.use("/api/v1/admins", adminRouter);

export { app }