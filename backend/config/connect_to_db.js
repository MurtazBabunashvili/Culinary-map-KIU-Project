const mongo = require("mongoose");

async function connectToMongoDB() {
  try {
    await mongo.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed", error.message);
  }
}

module.exports = connectToMongoDB;
