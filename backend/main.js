const express = require("express");
const connectToMongoDB = require("./config/connect_to_db");
const authRouter = require("./auth/auth.router.js");
const cors = require("cors");
const isAuth = require("./middleware/isAuth.middleware.js");
const userRouter = require("./routes/user/user.router.js");
const restaurantRouter = require("./routes/restaurant/restaurant.route.js");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
connectToMongoDB();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/auth", authRouter);
app.use("/users", isAuth, userRouter);
app.use("/restaurants", isAuth, restaurantRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
