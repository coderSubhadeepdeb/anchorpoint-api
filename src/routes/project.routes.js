import { Router } from "express";
import { createProject, getAllProjectsNewestFirst } from "../controllers/project.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/add").post(
    upload.fields([
    {
      name: "images",
      maxCount: 10 // Maximum 10 images
    }
    ]),
    createProject
);

router.route("/").get(getAllProjectsNewestFirst);

export default router;