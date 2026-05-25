const { isValidObjectId } = require("mongoose");
const userSchema = require("../../models/user.model.js");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
  try {
    let { page, limit } = req.query;
    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let skip = (page - 1) * limit;
    const paginatedUsers = await userSchema
      .find()
      .skip(skip)
      .limit(limit)
      .select("-password")
      .lean();

    return res.status(200).json({
      message: "All users retreived successfully",
      data: paginatedUsers,
    });
  } catch (error) {
    console.error("Error while getting users", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    const user = await userSchema.findById(id).select("-password").lean();

    if (!user) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    return res
      .status(200)
      .json({ message: "User found successfully", data: user });
  } catch (error) {
    console.error("Error while getting user by id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const { first_name, last_name, email, region } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    if (!first_name && !last_name && !email && !region) {
      return res.status(400).json({
        message:
          "Please provide at least one of the following: first name, last name, email, region.",
      });
    }

    const foundUser = await userSchema.findById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    if (email && email !== foundUser.email) {
      const checkExistingEmail = await userSchema.findOne({ email: email });
      if (checkExistingEmail) {
        return res.status(400).json({ message: "Please try another email" });
      }
    }

    const updatedUser = await userSchema
      .findByIdAndUpdate(
        id,
        {
          first_name:
            first_name !== undefined ? first_name : foundUser.first_name,
          last_name: last_name !== undefined ? last_name : foundUser.last_name,
          email: email !== undefined ? email : foundUser.email,
          region: region !== undefined ? region : foundUser.region,
        },
        { returnDocument: "after", runValidators: true },
      )
      .select("-password");

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Error while updating user by id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMyAccount = async (req, res) => {
  try {
    const id = req.userId;

    const { first_name, last_name, email, region } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    if (!first_name && !last_name && !email && !region) {
      return res.status(400).json({
        message:
          "Please provide at least one of the following: first name, last name, email, region.",
      });
    }

    const foundUser = await userSchema.findById(id);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    if (email && email !== foundUser.email) {
      const checkExistingEmail = await userSchema.findOne({ email: email });
      if (checkExistingEmail) {
        return res.status(400).json({ message: "Please try another email" });
      }
    }

    const updatedUser = await userSchema
      .findByIdAndUpdate(
        id,
        {
          first_name:
            first_name !== undefined ? first_name : foundUser.first_name,
          last_name: last_name !== undefined ? last_name : foundUser.last_name,
          email: email !== undefined ? email : foundUser.email,
          region: region !== undefined ? region : foundUser.region,
        },
        { returnDocument: "after", runValidators: true },
      )
      .select("-password");

    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Error while updating user by id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateMyPasswordById = async (req, res) => {
  try {
    const id = req.userId;

    const { current_password, new_password } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    if (!current_password || !new_password) {
      return res
        .status(400)
        .json({ message: "Please provide both: current and new passwords!" });
    }

    const myUser = await userSchema.findById(id);
    if (!myUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }

    const isEqualCurrentPassword = await bcrypt.compare(
      current_password,
      myUser.password,
    );
    if (!isEqualCurrentPassword) {
      return res.status(400).json({ message: "Passwords does not match!" });
    }

    const hashed_password = await bcrypt.hash(new_password, 10);

    const updatedUser = await userSchema
      .findByIdAndUpdate(
        id,
        { password: hashed_password },
        { returnDocument: "after" },
      )
      .select("-password");

    return res.status(200).json({
      message: "User password updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error while updating user password by id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    const deletedUser = await userSchema
      .findByIdAndDelete(id)
      .select("-password");

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    console.error("Error while deleting user by id", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteMyAccount = async (req, res) => {
  try {
    const id = req.userId;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    const deletedUser = await userSchema
      .findByIdAndDelete(id)
      .select("-password");
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found", data: null });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", data: deletedUser });
  } catch (error) {
    console.error("Error while deleting my account", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  updateMyAccount,
  updateMyPasswordById,
  deleteUserById,
  deleteMyAccount,
};
