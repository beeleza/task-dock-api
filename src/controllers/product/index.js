const ProductService = require("../../services/product");

class ProductController {
  constructor() {
    this.productService = new ProductService();
  }

  /**
   * Create new product
   */
  async create(req, res) {
    try {
      const userId = req.user.id;

      const productData = {
        ...req.body,
        userId: userId,
      };

      const product = await this.productService.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get product by ID
   */
  async getById(req, res) {
    try {
      const product = await this.productService.getProductById(req.params.id);
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * List products with pagination
   */
  async list(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;

      const result = await this.productService.listProducts(
        parseInt(page),
        parseInt(limit)
      );

      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Update product by ID
   */
  async update(req, res) {
    try {
      const product = await this.productService.updateProduct(
        req.params.id,
        req.body
      );
      res.status(200).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Delete product by ID
   */
  async delete(req, res) {
    try {
      const result = await this.productService.deleteProduct(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = ProductController;
