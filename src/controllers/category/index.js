const CategoryService = require("../../services/category");

/**
 * CategoryController - Handles HTTP requests for category operations
 *
 * This controller layer manages the request/response cycle
 * and delegates business logic to the service layer.
 */
class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  /**
   * Create a new category
   */
  async create(req, res) {
    try {
      const userId = req.user.id;

      const categoryData = {
        ...req.body,
        userId: userId,
      };

      const category = await this.categoryService.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get category by ID
   */
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

  /**
   * List categories with pagination
   */
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

  /**
   * Update category by ID
   */
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

  /**
   * Delete category by ID
   */
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
