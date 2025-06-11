import { Router } from "express";
import { loginAdmin } from "../controllers/admin.controller.js";

const router = Router();

router.route("/login").post(loginAdmin);


export default router;