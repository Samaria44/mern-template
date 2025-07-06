const entityService = require('../services/entity');
const { authJwt } = require('../middleware');

const createEntity = async (req, res) => {
    try {
        const entity = await entityService.createEntity({ ...req.body, created_by: req.userId });
        res.status(201).json(entity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getEntities = async (req, res) => {
    try {
        const entities = await entityService.getEntities();
        res.json(entities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEntity = async (req, res) => {
    try {
        const { id } = req.params;
        const entity = await entityService.getEntityById(id);
        res.json(entity);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateEntity = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEntity = await entityService.updateEntity(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        res.status(201).json(updatedEntity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEntity = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await entityService.deleteEntity(id, { is_deleted: true });
        res.json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const toggleEntityStatus = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedEntity = await entityService.toggleEntityStatus(id);
        res.json(updatedEntity);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createEntity,
    getEntities,
    getEntity,
    updateEntity,
    deleteEntity,
    toggleEntityStatus
};
