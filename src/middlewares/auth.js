const jwt = require("jsonwebtoken");

class AuthMiddleware {
  constructor() {
    this.authenticateToken = this.authenticateToken.bind(this);
  }

  /**
   * Middleware para verificar e validar o token JWT
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @param {Function} next - Next function
   */
  async authenticateToken(req, res, next) {
    try {
      const token = req.cookies.token;

      if (!token) {
        return res.status(401).json({
          error: "Access denied. No token provided.",
        });
      }

      const decoded = await this.verifyToken(token);

      // Adicionar os dados do usuário ao request
      req.user = decoded;

      next();
    } catch (error) {
      this.handleAuthError(error, res);
    }
  }

  /**
   * Verifica e decodifica o token JWT
   * @param {string} token - JWT token
   * @returns {Promise<Object>} Decoded token payload
   */
  async verifyToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(decoded);
        }
      });
    });
  }

  /**
   * Manipula erros de autenticação
   * @param {Error} error - Error object
   * @param {Object} res - Response object
   */
  handleAuthError(error, res) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Token expired",
        code: "TOKEN_EXPIRED",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid token",
        code: "INVALID_TOKEN",
      });
    }

    return res.status(500).json({
      error: "Authentication failed",
      code: "AUTH_FAILED",
    });
  }
}

module.exports = AuthMiddleware;
