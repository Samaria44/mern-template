const express = require("express");
const router = express.Router();
const locationController = require("../controllers/location.controller");

// CRUD routes
router.post("/", locationController.createLocation);
router.get("/", locationController.getLocations);
router.get("/active", locationController.getActiveLocations);
router.put("/:id", locationController.updateLocation);
router.delete("/:id", locationController.deleteLocation);

module.exports = router;
