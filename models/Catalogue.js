const mongoose = require("mongoose");
const catalogueSchema = new mongoose.Schema(
  {
    name: String,
    addresses: [],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("catalogue", catalogueSchema);
