const Entity = require('../models/Entity');

const createEntity = async (data) => {
    // Normalize the entity name to lowercase for consistent comparison
    const normalizedName = data.name.toLowerCase();

    // Check if the entity name already exists in a case-insensitive manner
    const existingEntity = await Entity.findOne({ 
        name: { $regex: new RegExp(`^${normalizedName}$`, 'i') }, 
        is_deleted: false 
    });
    if (existingEntity) {
        throw new Error('Entity name already exists.');
    }

    // Create a new entity with the normalized name
    return await Entity.create(data);
};

const getEntities = async (query = {}) => {
    return await Entity.find({ 
        is_deleted: false,
        active: true,
        ...query
    })
    .populate('created_by', 'name')
    .populate('updated_by', 'name');
};

const getEntityById = async (id) => {
    const entity = await Entity.findById(id)
        .populate('created_by', 'name')
        .populate('updated_by', 'name');
    
    if (!entity?.active) {
        throw new Error('Entity is inactive');
    }
    return entity;
};

const updateEntity = async (id, data) => {
    const entity = await Entity.findById(id);
    
    if (!entity?.active) {
        throw new Error('Entity is inactive');
    }

    return await Entity.findByIdAndUpdate(
        id, 
        data, 
        { new: true }
    );
};
 
const deleteEntity = async (id, data) => {
    return await Entity.findByIdAndUpdate(id, data);
};

const toggleEntityStatus = async (id, active) => {
    return await Entity.findByIdAndUpdate(
        id,
        { active },
        { new: true }
    );
};

module.exports = {
    createEntity,
    getEntities,
    getEntityById,
    updateEntity,
    deleteEntity,
    toggleEntityStatus
};
