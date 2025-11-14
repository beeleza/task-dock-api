const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const categoryRoutes = require("./categoryRoutes");

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);

module.exports = router;
