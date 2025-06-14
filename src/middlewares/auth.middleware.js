import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";

export const verifyToken = async(req, res, next) =>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized request"
            });
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken");

        if(!admin){
            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            })
        }

        req.admin = admin;
        next();
    }catch(err){
        return res.status(401).json({
            success: false,
            message: err?.message || "Invalid access token"
        })
    }
}