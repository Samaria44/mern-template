const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  weight: { type: Number, required: true },
  carats: { type: Number, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true },
  active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Store", storeSchema);
