
const versionService = require('../services/version');
const createVersion = async (req, res) => {
    try {
        const version = await versionService.createVersion({ ...req.body, created_by: req.userId });

        res.status(201).json({
            ...version._doc
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getVersions = async (req, res) => {
    try {
        const versions = await versionService.getVersions();
        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getActiveVersion = async (req, res) => {
    try {
        const versions = await versionService.getActiveVersion();
        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getVersionById = async (req, res) => {
    try {
        const versions = await versionService.getVersionById(req.userId);
        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getFreeVersions = async (req, res) => {
    try {
        const versions = await versionService.getFreeVersions();
        res.json(versions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateVersion = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedVersion = await versionService.updateVersion(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        res.status(201).json(updatedVersion);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteVersion = async (req, res) => {
    const { id } = req.params;
    try {
        await versionService.deleteVersion(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Version deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVersion,
    getActiveVersion,
    getFreeVersions,
    getVersions,
    updateVersion,
    deleteVersion,
    getVersionById
};