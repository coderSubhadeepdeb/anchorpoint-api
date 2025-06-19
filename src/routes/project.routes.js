import { Router } from "express";
import { createProject, deleteProject, getAllProjectsNewestFirst, getProjectById, getProjectsByCategory } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(
    upload.fields([
    {
      name: "images",
      maxCount: 15 // Maximum 15 images
    }
    ]),
    createProject
);

router.route("/").get(getAllProjectsNewestFirst);
router.route("/:id").get(getProjectById);
router.route("/category/:category").get(getProjectsByCategory);

router.route("/:id").delete(deleteProject);

export default router;