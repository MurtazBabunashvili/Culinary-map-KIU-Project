const express = require("express");
const connectToMongoDB = require("./config/connect_to_db");
const authRouter = require("./auth/auth.router.js");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

const app = express();

app.use(express.json());
connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
