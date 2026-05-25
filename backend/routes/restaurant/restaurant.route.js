const { Router } = require("express");
const {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  updateRestaurantById,
  deleteRestaurantById,
} = require("./restaurant.service.js");
const { isAdmin } = require("../../middleware/isAdmin.middleware.js");

const restaurantRouter = Router();

restaurantRouter.get("/", getAllRestaurants);
restaurantRouter.get("/:id", getRestaurantById);

restaurantRouter.post("/", isAdmin, createRestaurant);
restaurantRouter.put("/:id", isAdmin, updateRestaurantById);

restaurantRouter.delete("/:id", isAdmin, deleteRestaurantById);

module.exports = restaurantRouter;
