import { Router } from "express";
import { createProject } from "../controllers/project.controller.js";
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

export default router;