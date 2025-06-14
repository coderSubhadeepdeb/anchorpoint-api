import { Router } from "express";
import { loginAdmin, logoutAdmin, refreshAccessToken } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyToken, logoutAdmin);
router.route("/refresh-access-token").post(refreshAccessToken);

export default router;