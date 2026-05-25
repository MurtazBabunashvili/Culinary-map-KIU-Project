const jwt = require("jsonwebtoken");
require("dotenv").config();

function getToken(headers) {
  if (!headers["authorization"]) {
    return null;
  }

  const [type, token] = headers["authorization"].split(" ");
  return type === "Bearer" ? token : null;
}

async function isAuth(req, res, next) {
  const token = getToken(req.headers);
  if (!token) {
    return res
      .status(401)
      .json({ message: "You can not access this page. Please sign in." });
  }
  try {
    const payLoad = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payLoad.userId;
    req.role = payLoad.role;
    next();
  } catch (error) {
    console.error("Please isAuth error", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = isAuth;
