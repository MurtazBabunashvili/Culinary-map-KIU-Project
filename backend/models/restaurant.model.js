const { default: mongoose } = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    tags: {
      type: [String],
    },
    location: {
      type: String,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("restaurant", restaurantSchema);
