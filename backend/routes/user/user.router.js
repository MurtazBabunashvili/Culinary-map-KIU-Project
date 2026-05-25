const { Router } = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  updateMyPasswordById,
  deleteMyAccount,
  deleteUserById,
  updateMyAccount,
} = require("./user.service.js");
const isAdmin = require("../../middleware/isAdmin.middleware.js");

const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);

userRouter.put("/my-password", updateMyPasswordById);
userRouter.put("/my", updateMyAccount);
userRouter.put("/:id", isAdmin, updateUserById);

userRouter.delete("/my-account", deleteMyAccount);
userRouter.delete("/:id", isAdmin, deleteUserById);

module.exports = userRouter;
