const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");

// CRUD routes for store
router.post("/", storeController.createStore);
router.get("/", storeController.getStores);
router.get("/active", storeController.getActiveStores);
router.get("/analytics", storeController.getProfitAnalytics);
router.get("/code/:code", storeController.getStoreByCode);
router.get("/:id", storeController.getStoreById);
router.put("/:id", storeController.updateStore);
router.delete("/:id", storeController.deleteStore);

module.exports = router;
