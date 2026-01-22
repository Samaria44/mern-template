const Store = require("../models/store");

// Create a new store item
const createStore = async (req, res) => {
  try {
    const storeItem = await Store.create(req.body);
    res.status(201).json(storeItem);
  } catch (error) {
    console.error("Create Store Error:", error);
    res.status(500).json({ message: "Failed to create store item", error });
  }
};

// Get store item by code
const getStoreByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const item = await Store.findOne({ code, is_deleted: false });

    if (!item) {
      return res.status(404).json({ message: "Store item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Get Store By Code Error:", error);
    res.status(500).json({ message: "Failed to get store item by code", error });
  }
};

// Get all store items that are not deleted
const getStores = async (req, res) => {
  try {
    const items = await Store.find({ is_deleted: false });
    res.json(items);
  } catch (error) {
    console.error("Get Stores Error:", error);
    res.status(500).json({ message: "Failed to get store items", error });
  }
};

// Get active store items
const getActiveStores = async (req, res) => {
  try {
    const items = await Store.find({ active: true, is_deleted: false });
    res.json(items);
  } catch (error) {
    console.error("Get Active Stores Error:", error);
    res.status(500).json({ message: "Failed to get active store items", error });
  }
};

// Update a store item by ID
const updateStore = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData._id) delete updateData._id;

    const updatedItem = await Store.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ message: "Store item not found" });
    }

    res.json(updatedItem);
  } catch (error) {
    console.error("Update Store Error:", error);
    res.status(500).json({ message: "Failed to update store item", error });
  }
};

// Soft delete a store item
const deleteStore = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedItem = await Store.findByIdAndUpdate(
      id,
      { is_deleted: true },
      { new: true }
    );

    if (!deletedItem) {
      return res.status(404).json({ message: "Store item not found" });
    }

    res.json(deletedItem);
  } catch (error) {
    console.error("Delete Store Error:", error);
    res.status(500).json({ message: "Failed to delete store item", error });
  }
};

// Get store item by id (for detail page)
const getStoreById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Store.findOne({ _id: id, is_deleted: false });

    if (!item) {
      return res.status(404).json({ message: "Store item not found" });
    }

    res.json(item);
  } catch (error) {
    console.error("Get Store By Id Error:", error);
    res.status(500).json({ message: "Failed to get store item by id", error });
  }
};

// Get profit analytics data
const getProfitAnalytics = async (req, res) => {
  try {
    const { timeRange = 'daily' } = req.query;
    const items = await Store.find({ is_deleted: false });
    
    // Calculate profit metrics for each item
    const analyticsData = items.map(item => ({
      id: item._id,
      name: item.name,
      code: item.code,
      buyPrice: item.buyPrice,
      sellPrice: item.sellPrice,
      profitPerUnit: item.sellPrice - item.buyPrice,
      profitMargin: ((item.sellPrice - item.buyPrice) / item.sellPrice * 100).toFixed(2),
      weight: item.weight,
      carats: item.carats,
      active: item.active
    }));

    // Calculate summary statistics
    const totalItems = analyticsData.length;
    const activeItems = analyticsData.filter(item => item.active).length;
    const totalProfitPotential = analyticsData.reduce((sum, item) => sum + (item.profitPerUnit * item.weight), 0);
    const averageProfitMargin = analyticsData.reduce((sum, item) => sum + parseFloat(item.profitMargin), 0) / totalItems;

    res.json({
      summary: {
        totalItems,
        activeItems,
        totalProfitPotential,
        averageProfitMargin: averageProfitMargin.toFixed(2)
      },
      items: analyticsData,
      timeRange
    });
  } catch (error) {
    console.error("Get Profit Analytics Error:", error);
    res.status(500).json({ message: "Failed to get profit analytics", error });
  }
};

module.exports = {
  createStore,
  getStores,
  getActiveStores,
  updateStore,
  deleteStore,
  getStoreById,
  getStoreByCode,
  getProfitAnalytics,
};

