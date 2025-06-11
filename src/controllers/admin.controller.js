import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Admin } from "../models/admin.model.js";


const generateAccessAndRefereshTokens = async(adminId) =>{
    try {
        const admin = await Admin.findById(adminId);
        const accessToken = admin.generateAccessToken()
        const refreshToken = admin.generateRefreshToken()

        admin.refreshToken = refreshToken;
        await admin.save({ validateBeforeSave: false })

        return {accessToken, refreshToken};


    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while generating access and refresh token of admin"
        })
    }
}

const loginAdmin = async(req, res)=>{
    const {username, email, password} = req.body;
    if(!username && !email){
        return res.status(400).json({
            success: false,
            message: "PLease provide either username or email"
        });
    }

    try{
        const admin = await Admin.findOne({ $or:[{username}, {email}]});
        if(!admin){
            return res.status(404).json({
                success: false,
                message: "Admin not found!"
            });
        }

        const isPasswordValid = await admin.isPasswordCorrect(password)

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid admin password!"
            });
        }

        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id);
        
        const loggedInAdmin = await Admin.findById(admin._id).select("-password -refreshToken");

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json({
            success: true,
            message: "Admin logged in successfully",
            admin: loggedInAdmin,
            accessToken,
            refreshToken
        });

    }catch(err){
        console.error("Server error:", err);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error While Logging In the Admin!"
        });
    }
}

export { loginAdmin };