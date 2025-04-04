const express = require("express");
const { signup, isUserIdAvailable, login, sendResetPasswordLink, verifyResetLink, userProfile,
     updateUserProfile, getImageController,
     } = require("../controller/user");
const upload = require("../middleware/upload.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

// User Signup Route
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/send-reset-link", sendResetPasswordLink);
router.post("/login", login);
router.get("/check", isUserIdAvailable);
router.get("/validate-user", verifyResetLink);
router.get("/profile", authMiddleware, userProfile)
router.put("/update-profile", authMiddleware, upload.single("file"), updateUserProfile);
router.get("/image", getImageController);

module.exports = router;
