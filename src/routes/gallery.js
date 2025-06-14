import express from "express";
import multer from "multer";
import Gallery from "../model/Gallery.js";
import { cloudinary, storage } from "../config/cloudinary.js";

const router = express.Router();
const upload = multer({ storage: storage });
//Route to handle image upload from a form:
// 1. Uploads image to Cloudinary (with size limits)
// 2. Saves image URL and ID to MongoDB 
router.post("/upload", upload.single("image"), async (req, res) => {

    try {
        const newImage = new Gallery({
            imageUrls: [req.file.path],//Cloudinary URL 
            cloudinaryId: req.file.filename,// CLoudinaryn Public id
        });

        await newImage.save();
        res.status(201).json({
            message: "Image uploaded successfully",
            image: newImage,
        });
    } catch (error) {
        res.status(500).json({ message: "Error uploading image", error });
    }
});
// Route to get all images and display in our gallery
router.get("/images", async (req, res) => {
    try {
        const images = await Gallery.find();
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Error fetching images", error });
    }
});
// Route to delete an image
router.delete("/images/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        await cloudinary.uploader.destroy(image.cloudinaryId);
        await Gallery.findByIdAndDelete(id);
        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting image", error });
    }
});
// Route to update an image
router.put("/images/:id", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    try {
        const image = await Gallery.findById(id);
        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }
        // Delete the old image from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinaryId);
        // Upload the new image
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "gallery",
            transformation: [{ width: 500, height: 500, crop: "limit" }],
        });
        // Update the image document
        image.imageUrls = result.secure_url;
        image.cloudinaryId = result.public_id;
        await image.save();
        res.status(200).json({ message: "Image updated successfully", image });
    } catch (error) {
        res.status(500).json({ message: "Error updating image", error });
    }
});
export default router;
// This code defines an Express.js router for handling image uploads, retrieval, deletion, and updates using Cloudinary for storage.