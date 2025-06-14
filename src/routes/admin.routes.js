import { Router } from "express";
import { loginAdmin, logoutAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyToken, logoutAdmin);

export default router;