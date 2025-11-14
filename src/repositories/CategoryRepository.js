const BaseRepository = require("./BaseRepository");
const { Category } = require("../db/models");

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }
}

module.exports = CategoryRepository;
