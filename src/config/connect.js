const mongoose = require("mongoose");

async function connectDB() {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB conectado com sucesso");
  } catch (error) {
    console.error("Erro ao conectar no MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = connectDB;
