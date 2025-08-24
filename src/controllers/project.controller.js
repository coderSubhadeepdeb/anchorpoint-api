import { Project } from "../models/project.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import fs from 'fs/promises';
import mongoose from "mongoose";


const createProject = async (req, res) => {

    let imageObjects = [];
     try {
        const { title, description, category, videoLink, imageTitles, imageDescriptions  } = req.body;

        if (!title || !description || !category) {
            if (req.files?.images) {
                const files = Array.isArray(req.files.images) 
                    ? req.files.images 
                    : [req.files.images];
                
                await Promise.all(files.map(file => {
                    return fs.unlink(file.path).catch(err => {
                        console.error(`Failed to delete ${file.path}:`, err);
                    });
                }));
            }
            return res.status(400).json({
                success: false,
                message: "Title, description, and category are required"
            });
        }
        
        // Check if files were uploaded
        if (!req.files || req.files.images.length === 0) {
            return res.status(400).json({ 
                message: "At least one image is required" 
            });
        }

        const parsedImageTitles = imageTitles ? JSON.parse(imageTitles) : [];
        const parsedImageDescriptions = imageDescriptions ? JSON.parse(imageDescriptions) : [];

        // Upload images to Cloudinary
        const imageUploadPromises = req.files.images.map(async (file, index) => {
            const result = await uploadOnCloudinary(file.path);
            return {
                src: result.secure_url,
                title: parsedImageTitles[index] || "",
                description: parsedImageDescriptions[index] || ""
            };
        });

        imageObjects = await Promise.all(imageUploadPromises);

        // Filter out any failed uploads
        const validImageObjects = imageObjects.filter(img => img.src !== null);
    
        if (validImageObjects.length === 0) {
            return res.status(500).json({ message: "Failed to upload images" });
        }

        // Create project in database
        const project = await Project.create({
            title,
            description,
            category,
            videoLink: videoLink || "",
            images: validImageObjects
        });

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: project
        });

    } catch (error) {
        // Cleanup: Delete any images that were uploaded to Cloudinary but project creation failed
        if (imageObjects && imageObjects.length > 0) {
            await Promise.all(imageObjects.map(image => {
                if (image && image.src) {
                const publicId = image.src.split('/').pop().split('.')[0];
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


const getAllProjectsNewestFirst = async (req, res) => {
  try {
    // Fetch projects sorted by creation date (newest first)
    const projects = await Project.find({})
      .sort({ createdAt: -1 });  // No .exec() needed here

    return res.status(200).json({
      success: true,
      message: projects.length > 0 
        ? "Projects fetched successfully" 
        : "No projects found",
      count: projects.length,
      data: projects
    });

  } catch (error) {
    console.error('Error fetching projects:', error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
      error: error.message  // Always show error details
    });
  }
};


const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID format"
            });
        }

        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project fetched successfully",
            data: project
        });

    } catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch project",
            error: error.message
        });
    }
};

const getProjectsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const projects = await Project.find({ category }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: projects.length > 0
            ? `Projects in category '${category}' fetched successfully`
            : `No projects found in category '${category}'`,
            count: projects.length,
            data: projects
        });

    } catch (error) {
        console.error('Error fetching projects by category:', error);
        return res.status(500).json({
        success: false,
        message: "Failed to fetch projects by category",
        error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID format (optional but recommended)
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid project ID format"
            });
        }

        const project = await Project.findById(id);
    
        if (!project) {
            return res.status(404).json({
                success: false,
                message: "Project not found"
            });
        }
        
        if (project.images && project.images.length > 0) {
            await Promise.all(
                project.images.map(async (image) => {
                    if (!image.src) return;
                    try {
                        // Extract public ID from Cloudinary URL
                        const urlParts = image.src.split('/');
                        const publicId = urlParts[urlParts.length - 1].split('.')[0];
                        await deleteFromCloudinary(`anchorpointprojects/${publicId}`);
                    } catch (error) {
                        console.error(`Failed to delete image ${image.src}:`, error);
                    }
                })
            );
        }


        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return res.status(500).json({
                success: false,
                message: "Database deletion failed after image cleanup",
                projectId: id 
            });
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            data: {
                id: deletedProject._id,
                title: deletedProject.title
            }
        });

    } catch (error) {
        console.error('Delete error:', error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete project", 
        });
    }
};

export { createProject, getAllProjectsNewestFirst, deleteProject, getProjectById, getProjectsByCategory };