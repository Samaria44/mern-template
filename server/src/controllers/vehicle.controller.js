
const vehicleService = require('../services/vehicle');

const createVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.createVehicle({...req.body, created_by: req.userId});
        res.status(201).json(vehicle);
    } catch (error) {
        // console.log(" message: ",error.message)
        res.status(400).json({ message: error.message });
    }
};

const getVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFreeVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getFreeVehicles();
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedVehicle = await vehicleService.updateVehicle(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        // console.log(updatedVehicle);

        res.status(201).json(updatedVehicle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteVehicle = async (req, res) => {
    const { id } = req.params;
    try {
        // const device = await deviceService.getVehicleById(id);
        await vehicleService.deleteVehicle(id,  {  is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVehicle,
    getVehicles,
    getFreeVehicles,
    updateVehicle,
    deleteVehicle
};