const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema(
  {
    items: [
      {
        name: String,
        quantity: Number,
      },
    ],
    orderBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deliveryBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      default: "CREATED",
    },
    locations: [
      {
        name: String,
        address: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);
