import { Project } from "../models/project.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";


const createProject = async (req, res) => {

    let imageUrls = [];
     try {
        const { title, description } = req.body;
        
        // Check if files were uploaded
        if (!req.files || req.files.images.length === 0) {
            return res.status(400).json({ 
                message: "At least one image is required" 
            });
        }

        // Upload images to Cloudinary
        const imageUploadPromises = req.files.images.map(async (file) => {
            const result = await uploadOnCloudinary(file.path);
            return result.secure_url;
        });

        imageUrls = await Promise.all(imageUploadPromises);

        // Filter out any failed uploads
        const validImageUrls = imageUrls.filter(url => url !== null);
    
        if (validImageUrls.length === 0) {
            return res.status(500).json({ message: "Failed to upload images" });
        }

        // Create project in database
        const project = await Project.create({
            title,
            description,
            images: validImageUrls
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {
        // Cleanup: Delete any images that were uploaded to Cloudinary but project creation failed
        if (imageUrls && imageUrls.length > 0) {
            await Promise.all(imageUrls.map(url => {
                if (url) {
                const publicId = url.split('/').pop().split('.')[0];
                return deleteFromCloudinary(`anchorpointprojects/${publicId}`);
                }
            }));
        }

        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create project"
        });
    }
};

export { createProject };