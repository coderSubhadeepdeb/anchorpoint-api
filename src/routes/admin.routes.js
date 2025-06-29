import { Router } from "express";
import { loginAdmin, logoutAdmin, refreshAccessToken } from "../controllers/admin.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/login").post(loginAdmin);
router.route("/logout").post(verifyToken, logoutAdmin);
router.route("/verify-token").get(verifyToken, (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Token is valid",
        admin: req.admin
     });
});
router.route("/refresh-access-token").post(refreshAccessToken);

export default router;