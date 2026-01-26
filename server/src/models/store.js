const mongoose = require("mongoose");

const storeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // weight: { type: Number, required: true },
  // carats: { type: Number, required: true },
  // price: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  stock: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  active: { type: Boolean, default: true },
  is_deleted: { type: Boolean, default: false },
});

// Validation to ensure sellPrice is greater than buyPrice
storeSchema.pre('save', function(next) {
  if (this.sellPrice <= this.buyPrice) {
    const error = new Error('sellPrice must be greater than buyPrice');
    next(error);
  } else {
    next();
  }
});

module.exports = mongoose.model("Store", storeSchema);
