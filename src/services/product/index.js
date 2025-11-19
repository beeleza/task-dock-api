const ProductRepository = require("../../repositories/product");

/**
 * ProductService - Handles business logic for category operatons
 */
class ProductService {
  constructor() {
    this.productRepository = new ProductRepository();
  }

  /**
   * Create a new product with basic validation.
   *
   * @async
   * @param {Object} productData - Data for creating a new product.
   * @returns {Promise<Object>} The created product.
   */
  async createProduct(productData) {
    try {
      if (
        !productData.name ||
        !productData.price ||
        !productData.categoryId ||
        !productData.userId
      ) {
        throw new Error("Please fill in all required fields");
      }
      return await this.productRepository.create(productData);
    } catch (error) {
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }

  /**
   * Get product by ID, throw error if not found
   *
   * @async
   * @param {number} id
   * @returns {Promise<object>}
   */
  async getProductById(id) {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Lists products with pagination and optional filters.
   *
   * @async
   * @param {number} [page=1] - Page number.
   * @param {number} [limit=10] - Items per page.
   * @param {Object} [filters={}] - Filters for querying products.
   * @returns {Promise<Object>} Paginated product list.
   */
  async listProducts(page = 1, limit = 10, filters = {}) {
    const where = {};

    if (filters.name) {
      where.name = filters.name;
    }

    return await this.productRepository.paginate({
      page,
      limit,
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  /**
   * Update product by ID
   *
   * @param {number} id
   * @param {Object} updateData
   */
  async updateProduct(id, updateData) {
    const updateProduct = await this.productRepository.update(id, updateData);

    if (!updateProduct) {
      throw new Error(`Category with ID ${id} not found`);
    }

    return updateProduct;
  }

  /**
   * Delete product by ID
   *
   * @param {*} id
   * @returns {Promise<{message: string;}
   */
  async deleteProduct(id) {
    const deleted = await this.productRepository.delete(id);

    if (!deleted) {
      throw new Error(`Product with ID ${id} not found`);
    }

    return { message: "Product deleted successfully" };
  }
}

module.exports = ProductService;
