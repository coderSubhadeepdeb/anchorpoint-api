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
        console.error("Access and Refresh Token Generation Error:", err);
        
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


const logoutAdmin = async(req, res) =>{
    try{
        await Admin.findByIdAndUpdate(
            req.admin._id,
            {
                $unset: {
                    refreshToken: 1 // this removes the field from document
                }
            },
            {
                new: true
            }
        );

        const options = {
            httpOnly: true,
            secure: true
        }

        return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json({
            success: true,
            message: "Admin Logged Out Successfully"
        });
    }catch(err){
        console.error("Server Error:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to Log Out Admin"
        })
    }
}

const refreshAccessToken = async(req, res) =>{
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({
                success: false,
                message: "Unauthorized request - No refresh token provided"
            });
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
        const admin = await Admin.findById(decodedToken?._id)
    
        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid Refresh Token - Admin not found"
            });
        }
    
        if (incomingRefreshToken !== admin?.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or has been used"
            });
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(admin._id)
    
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json({
            success: true,
            message: "Access token refreshed Successfully",
            accessToken,
            refreshToken
        });
    } catch (err) {
        console.error("Refresh Token Error:", err);
        return res.status(401).json({
            success: false,
            message: err?.message || "Invalid refresh token"
        });
    }
}

export { loginAdmin, logoutAdmin, refreshAccessToken };