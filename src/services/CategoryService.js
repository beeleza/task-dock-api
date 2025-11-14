const CategoryRepository = require("../repositories/CategoryRepository");

class CategoryService {
  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(categoryData) {
    try {
      if (!categoryData.name || !categoryData.colorHex) {
        throw new Error("Please fill in all required fields.");
      }
      return await this.categoryRepository.create(categoryData);
    } catch (error) {
      throw new Error(`Falha ao criar categoria: ${error.message}`);
    }
  }

  async getCategoryById(id) {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new Error(`Category with ID ${id} not found`);
    }

    return category;
  }

  async listCategories(page = 1, limit = 10, filters = {}) {
    const where = {};

    if (filters.name) {
      where.name = filters.name;
    }

    return await this.categoryRepository.paginate({
      page,
      limit,
      where,
      order: [["createdAt", "DESC"]],
    });
  }

  async updateCategory(id, updateData) {
    const updatedCategory = await this.categoryRepository.update(
      id,
      updateData
    );

    if (!updatedCategory) {
      throw new Error(`Category with ID ${id} not found`);
    }

    return updatedCategory;
  }

  async deleteCategory(id) {
    const deleted = await this.categoryRepository.delete(id);

    if (!deleted) {
      throw new Error(`Category with ID ${id} not found`);
    }

    return { message: "Category deleted successfully" };
  }
}

module.exports = CategoryService;
