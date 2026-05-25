const { Router } = require("express");
const userSchema = require("../models/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const authRouter = Router();

authRouter.post("/sign-up", async (req, res) => {
  const { first_name, last_name, email, region, password } = req.body;

  if (!first_name || !last_name || !email || !region || !password) {
    return res.status(400).json({
      message:
        "First/last name, email, region and password are required fields",
    });
  }

  const existingUser = await userSchema.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await userSchema.create({
    first_name,
    last_name,
    email,
    region,
    password: hashedPassword,
  });
  res.status(200).json({ message: "User created successfully" });
});

authRouter.post("/sign-in", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please write email and password" });
  }

  const existingUser = await userSchema.findOne({ email: email });
  if (!existingUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isEqualPassword = await bcrypt.compare(password, existingUser.password);
  if (!isEqualPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const payLoad = {
    userId: existingUser._id,
    role: existingUser.role,
  };

  const token = jwt.sign(payLoad, process.env.JWT_SECRET, { expiresIn: "7d" });

  res
    .status(200)
    .json({ message: "Token generated successfully", data: token });
});
module.exports = authRouter;
