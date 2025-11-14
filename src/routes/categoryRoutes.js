const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/categories");

const categoryController = new CategoryController();

router.post("/", (req, res) => categoryController.create(req, res));
router.get("/", (req, res) => categoryController.list(req, res));
router.get("/:id", (req, res) => categoryController.getById(req, res));
router.put("/:id", (req, res) => categoryController.update(req, res));
router.delete("/:id", (req, res) => categoryController.delete(req, res));

module.exports = router;
