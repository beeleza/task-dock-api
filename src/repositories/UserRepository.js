const BaseRepository = require("./BaseRepository");
const bcryptjs = require("bcryptjs");

class UserRepository extends BaseRepository {
  constructor(UserModel) {
    super(UserModel);
  }

  async createUser(data) {
    const { name, email, password, imageUrl } = data;

    try {
      const existing = await this.findOne({ email });
      if (existing) {
        throw new Error("Email already registered");
      }

      const hashed = await bcryptjs.hash(password, 10);

      return await this.create({ name, email, password: hashed, imageUrl });
    } catch (error) {}
  }

  async validateUserLogin(email, password) {
    const user = await this.findOne({ email });
    if (!user) return null;

    const match = await bcrypt.compare(password, user.password);
    if (!match) return null;

    return user;
  }
}

module.exports = UserRepository;
