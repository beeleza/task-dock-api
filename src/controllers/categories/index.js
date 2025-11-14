const CategoryService = require("../../services/CategoryService");

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  async create(req, res) {
    try {
      const category = await this.categoryService.createCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const category = await this.categoryService.getCategoryById(
        req.params.id
      );
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.categoryService.listCategories(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const category = await this.categoryService.updateCategory(
        req.params.id,
        req.body
      );
      res.status(200).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const result = await this.categoryService.deleteCategory(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CategoryController;
