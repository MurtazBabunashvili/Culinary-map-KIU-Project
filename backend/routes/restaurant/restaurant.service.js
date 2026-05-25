const { isValidObjectId } = require("mongoose");
const restaurantSchema = require("../../models/restaurant.model.js");
const { pagination } = require("../utils/utils.js");

const createRestaurant = async (req, res) => {
  const { name, description, price, tags, location } = req.body;

  if (!name || !description || !price || !location) {
    return res.status(400).json({
      message:
        "Please provide all of the following: name, description, price, location",
    });
  }
  const createdRestaurant = await restaurantSchema.create({
    name,
    description,
    price,
    tags,
    location,
  });

  res.status(200).json({ message: "Restaurant created successfully" });
};

const getAllRestaurants = async (req, res) => {
  let { page, limit } = req.query;

  page = Number(page) || 1;
  limit = Number(limit) || 10;

  const skip = (page - 1) * limit;

  const restaurants = await restaurantSchema.find().skip(skip).limit(limit);

  res.status(200).json({
    message: "All restaurants fetched successfully",
    data: restaurants,
  });
};

const getRestaurantById = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid mongo id", data: null });
  }

  const restaurant = await restaurantSchema.findById(id);
  if (!restaurant) {
    return res
      .status(404)
      .json({ message: "Restaurant not found", data: null });
  }
  res
    .status(200)
    .json({ message: "Restaurant found successfully", data: restaurant });
};

const updateRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, tags, location } = req.body;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    const foundRestaurant = await restaurantSchema.findById(id);
    if (!foundRestaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant not found", data: null });
    }
    const updatedRestaurant = await restaurantSchema.findByIdAndUpdate(
      id,
      {
        name: name !== undefined ? name : foundRestaurant.name,
        description:
          description !== undefined ? description : foundRestaurant.description,
        price: price !== undefined ? price : foundRestaurant.price,
        tags: tags !== undefined ? tags : foundRestaurant.tags,
        location: location !== undefined ? location : foundRestaurant.location,
      },
      { returnDocument: "after", runValidators: true },
    );

    res.status(200).json({
      message: "Restaurant contents updated successfully",
      data: updatedRestaurant,
    });
  } catch (error) {
    console.error("Error while updating restaurant", error);
    res.status(500).json({ message: "Internal server  error" });
  }
};

const deleteRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid mongo id", data: null });
    }

    const deletedRestaurant = await restaurantSchema.findByIdAndDelete(id);
    if (!deletedRestaurant) {
      return res
        .status(404)
        .json({ message: "Restaurant by given id not found" });
    }

    res.status(200).json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error while deleting restaurant", error);
    res.status(500).json({ message: "Internal server  error" });
  }
};

module.exports = {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
};
