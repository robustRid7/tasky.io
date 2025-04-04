const express = require("express");
const userRoutes = require("./user.routes");

const router = express.Router();
// Define all route groups
router.use("/users", userRoutes);

module.exports = router;
