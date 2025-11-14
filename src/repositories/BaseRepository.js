const { Sequelize, Model } = require("sequelize");

/**
 * BaseRepository Class - Implements Repository Pattern for CRUD operations
 *
 * Purpose: Centralize all common database operations,
 * promoting reuse, consistency, and easier maintenance.
 *
 * Principle: DRY (Don't Repeat Yourself) - Avoids code duplication
 * across different entity repositories.
 */
class BaseRepository {
  /**
   * BaseRepository Constructor
   * @param {Sequelize.Model} model - Sequelize model for database operations
   *
   * Why inject the model?
   * - Allows reusing the same logic for different entities
   * - Facilitates unit testing (we can mock the model)
   * - Separates concerns (repository handles logic, model handles structure)
   */
  constructor(model) {
    if (!model) {
      throw new Error("Model must be provided for BaseRepository");
    }
    this.Model = model;
  }

  /**
   * Creates a new record in the database
   * @param {Object} data - Data to be created
   * @returns {Promise<Object>} The created record
   *
   * Usage example:
   * await userRepository.create({ name: 'John', email: 'john@email.com' });
   *
   * Why use try/catch here?
   * - Centralizes error handling for creation operations
   * - Provides consistent error messages across all repositories
   * - Allows service layer to handle business logic without database concerns
   */
  async create(data) {
    try {
      return await this.Model.create(data);
    } catch (error) {
      throw new Error(`Error creating record: ${error.message}`);
    }
  }

  /**
   * Finds a single record by its primary key (usually ID)
   * @param {number|string} id - The primary key value
   * @returns {Promise<Object|null>} Found record or null if not found
   *
   * Note: findByPk is Sequelize's method for "find by primary key"
   * It's more efficient than using where clauses for primary keys
   */
  async findById(id) {
    try {
      return await this.Model.findByPk(id);
    } catch (error) {
      throw new Error(`Error finding record by ID: ${error.message}`);
    }
  }

  /**
   * Retrieves all records from the table with optional filtering and sorting
   * @param {Object} options - Sequelize query options (where, order, include, etc.)
   * @returns {Promise<Array>} Array of records
   *
   * Common options:
   * - where: { status: 'active' }
   * - order: [['createdAt', 'DESC']]
   * - include: [associationModels] for eager loading
   * - attributes: ['id', 'name'] for selecting specific columns
   */
  async findAll(options = {}) {
    try {
      return await this.Model.findAll(options);
    } catch (error) {
      throw new Error(`Error finding all records: ${error.message}`);
    }
  }

  /**
   * Finds a single record that matches the where conditions
   * @param {Object} where - Conditions to filter by
   * @param {Object} options - Additional options (order, include, etc.)
   * @returns {Promise<Object|null>} First matching record or null
   *
   * Use case: Finding a user by email for login
   * await findOne({ email: 'user@example.com' })
   */
  async findOne(where = {}, options = {}) {
    try {
      return await this.Model.findOne({
        where,
        ...options,
      });
    } catch (error) {
      throw new Error(`Error finding one record: ${error.message}`);
    }
  }

  /**
   * Finds all records that match the where conditions
   * @param {Object} where - Conditions to filter by
   * @param {Object} options - Additional options (order, limit, etc.)
   * @returns {Promise<Array>} Array of matching records
   *
   * Difference from findAll:
   * - find() always requires a where clause
   * - findAll() can work without conditions to get all records
   */
  async find(where = {}, options = {}) {
    try {
      return await this.Model.findAll({
        where,
        ...options,
      });
    } catch (error) {
      throw new Error(`Error finding records: ${error.message}`);
    }
  }

  /**
   * Updates a record by its primary key
   * @param {number|string} id - The primary key value
   * @param {Object} data - Data to update
   * @returns {Promise<Object|null>} Updated record or null if not found
   *
   * Why find + update instead of update directly?
   * - Ensures record exists before attempting update
   * - Returns the updated record for immediate use
   * - Better error handling and validation
   */
  async update(id, data) {
    try {
      const record = await this.findById(id);
      if (!record) {
        return null;
      }
      return await record.update(data);
    } catch (error) {
      throw new Error(`Error updating record: ${error.message}`);
    }
  }

  /**
   * Deletes a record by its primary key
   * @param {number|string} id - The primary key value
   * @returns {Promise<boolean>} True if deleted, false if not found
   *
   * Note: This performs a hard delete (record is removed from database)
   * For soft delete, consider using paranoid mode in Sequelize
   */
  async delete(id) {
    try {
      const record = await this.findById(id);
      if (!record) {
        return false;
      }
      await record.destroy();
      return true;
    } catch (error) {
      throw new Error(`Error deleting record: ${error.message}`);
    }
  }

  /**
   * Counts records that match the where conditions
   * @param {Object} where - Conditions to filter by
   * @returns {Promise<number>} Number of matching records
   *
   * Use cases:
   * - Count active users: count({ status: 'active' })
   * - Check if email exists: count({ email: 'test@email.com' }) > 0
   * - Dashboard statistics
   */
  async count(where = {}) {
    try {
      return await this.Model.count({ where });
    } catch (error) {
      throw new Error(`Error counting records: ${error.message}`);
    }
  }

  /**
   * Retrieves paginated results with metadata
   * @param {Object} params - Pagination parameters
   * @param {number} params.page - Current page number (default: 1)
   * @param {number} params.limit - Number of records per page (default: 10)
   * @param {Object} params.where - Conditions to filter by
   * @param {Array} params.order - Sorting order
   * @returns {Promise<Object>} Object with data and pagination metadata
   *
   * Return structure:
   * {
   *   data: [records...],
   *   pagination: {
   *     currentPage: 1,
   *     totalPages: 5,
   *     totalItems: 50,
   *     itemsPerPage: 10,
   *     hasNext: true,
   *     hasPrev: false
   *   }
   * }
   *
   * Why pagination is important:
   * - Better performance for large datasets
   * - Improved user experience
   * - Efficient memory usage
   */
  async paginate({ page = 1, limit = 10, where = {}, order = [] }) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await this.Model.findAndCountAll({
        where,
        limit,
        offset,
        order,
      });

      return {
        data: rows,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(count / limit),
          totalItems: count,
          itemsPerPage: limit,
          hasNext: page < Math.ceil(count / limit),
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      throw new Error(`Error in pagination: ${error.message}`);
    }
  }
}

module.exports = BaseRepository;
