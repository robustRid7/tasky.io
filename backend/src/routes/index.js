const express = require("express");
const userRoutes = require("./user.routes");
const taskRoutes = require("./task.routes");

const router = express.Router();
// Define all route groups
router.use("/users", userRoutes);
router.use("/tasks", taskRoutes);

module.exports = router;
