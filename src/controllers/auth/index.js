const jwt = require("jsonwebtoken");
const UserRepository = require("../../repositories/user/");
const { User } = require("../../db/models");

const userRepo = new UserRepository(User);

module.exports = {
  /**
   * Register a new user
   */
  register: async (req, res) => {
    try {
      const user = await userRepo.createUser(req.body);

      return res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  /**
   * Login user and return JWT token
   */
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userRepo.validateUserLogin(email, password);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.json({
        message: "Login successful",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  /**
   * Logout user
   */
  async logout(req, res) {
    try {
      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.json({ message: "Logout successful" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
