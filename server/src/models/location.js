const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  // state: { type: String, default: "active" },
    active: {
        type: Boolean,
        default: true
    },
  is_deleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Location", LocationSchema);
