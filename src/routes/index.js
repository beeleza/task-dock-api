const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const categoryRoutes = require("./category");
const productRoutes = require("./product");
const AuthMiddleware = require("../middlewares/auth");

const authMiddleware = new AuthMiddleware();

router.use("/auth", authRoutes);
router.use("/category", authMiddleware.authenticateToken, categoryRoutes);
router.use("/product", authMiddleware.authenticateToken, productRoutes);

module.exports = router;
