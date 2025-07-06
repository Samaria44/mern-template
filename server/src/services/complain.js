const Permissions = require('../models/Permission');
const Complain = require('../models/Complain');
const User = require('../models/User');
const Team = require('../models/Team');
const { generateCompactUniqueCode } = require('../utils/HelperFunctions');

const createComplain = async (data) => {
    console.log("data", data);
    const newComplain = await Complain.create({ ...data, complainNumber: generateCompactUniqueCode() });
    const populatedComplain = await Complain.findById(newComplain._id)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('created_by')
        //.populate('assignTo')
        .exec();

    return {
        _id: populatedComplain._id,
        complainNumber: populatedComplain.complainNumber,
        status: populatedComplain.status,
        project: populatedComplain.project._id,
        project_name: populatedComplain.project.name,
        device: populatedComplain.device._id,
        device_name: populatedComplain.device.name,
        equipment: populatedComplain.equipment,
        // equipment: populatedComplain.equipment._id,
        // equipment_name: populatedComplain.equipment.title,
        subEquipment: populatedComplain?.subEquipment?._id,
        subEquipment_name: populatedComplain?.subEquipment?.title,
        equipmentProblem: populatedComplain?.equipmentProblem?._id,
        problem: populatedComplain?.equipmentProblem?.problem,
        // assignTo: populatedComplain.assignTo._id,
        // assignTo_name: populatedComplain.assignTo.name,
        type: populatedComplain.type,
        visible: populatedComplain.visible,
        severity: populatedComplain.severity,
        created_by: populatedComplain.created_by._id,
        created_by_name: populatedComplain.created_by.name,
        description: populatedComplain.description
    };
};

const getComplain = async (id) => {
    const complain = await Complain.findOne({ _id: id })
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .populate('created_by')
        .exec();

    return {
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project._id,
        project_name: complain.project.name,
        device: complain.device._id,
        device_name: complain.device.name,
        equipment: complain.equipment,
        // equipment: complain.equipment._id,
        // equipment_name: complain.equipment.title,
        subEquipment: complain?.subEquipment?._id,
        subEquipment_name: complain?.subEquipment?.title,
        equipmentProblem: complain?.equipmentProblem?._id,
        problem: complain?.equipmentProblem?.problem,
        assignTo: complain.assignTo?._id,
        assignTo_name: complain.assignTo?.name,
        closedAt: complain.closedAt ? complain.closedAt : null,
        logs: complain.logs,
        type: complain.type,
        visible: complain.visible,
        severity: complain.severity,
        description: complain.description,
        created_by: complain.created_by._id,
        duration: calculateDuration(complain.created_at, complain.closedAt),
        created_by_name: complain.created_by.name,
        inserted_at: complain.inserted_at
    };
};

const getResolvedComplain = async (id) => {
    const count = await Complain.countDocuments({ created_by: id, status: "resolved", is_deleted: false });
    return count;
};

const getComplains = async (id, role, filters = {}) => {
    const user = await User.findById(id); // Fetch user by ID
    const myRole = role[0].name;
    const isAdmin = myRole === 'admin' || myRole === 'super admin';
    const isSupperAdmin = myRole === 'super admin';
    const projects = user.assigned_projects; // Get user's assigned projects

    // console.log("filters", filters);

    // if (Object.keys(filters).length === 0) {
    //     const now = new Date();
    //     const oneMonthAgo = new Date();
    //     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    //     // Set `dateFrom` to the start of one month ago
    //     filters.dateFrom = new Date(
    //         oneMonthAgo.getFullYear(),
    //         oneMonthAgo.getMonth(),
    //         oneMonthAgo.getDate(),
    //         0, 0, 0, 0
    //     ).toISOString();

    //     // Set `dateTo` to the end of today
    //     filters.dateTo = new Date(
    //         now.getFullYear(),
    //         now.getMonth(),
    //         now.getDate(),
    //         23, 59, 59, 999
    //     ).toISOString();
    // }

    // Initial query setup
    let query = { is_deleted: false };

    // Apply role-based filters
    if (!isAdmin) {
        const permission = await Permissions.findOne({ userId: user._id, is_deleted: false });

        if (permission?.complain?.read_self && permission?.complain?.read === false) {
            query.created_by = user._id; // Fetch only user's own complaints
        }

        // Add project filtering for non-admin users
        if (!isSupperAdmin) {
            query.project = { $in: projects }; // Match project IDs in user's assigned projects
        }
    }

    // Apply filters passed as arguments
    if (filters.status && filters.status != null) {
        query.status = filters.status; // Filter by status (e.g., "pending", "resolved")
    }

    if (filters.project && filters.project != null) {
        query.project = filters.project; // Filter by specific project ID
    }

    if (filters.device && filters.device != null) {
        query.device = filters.device; // Filter by specific device ID
    }

    if (filters.equipment && filters.equipment != null) {
        query.equipment = { $in: filters.equipment }; // Filter by multiple equipment IDs
    }

    if (filters.subEquipment && filters.subEquipment != null) {
        query.subEquipment = filters.subEquipment; // Filter by sub-equipment ID
    }

    if (filters.equipmentProblem && filters.equipmentProblem != null) {
        query.equipmentProblem = filters.equipmentProblem; // Filter by equipment problem ID
    }

    if (filters.assignTo && filters.assignTo != null) {
        query.assignTo = filters.assignTo; // Filter by assigned team ID
    }

    if (filters.type && filters.type != null) {
        query.type = filters.type; // Filter by complaint type (e.g., "hardware", "software")
    }

    if (filters.severity && filters.severity != null) {
        query.severity = filters.severity; // Filter by severity level (e.g., "high", "medium")
    }

    if (filters.visible !== undefined && filters.visible != null) {
        query.visible = filters.visible; // Filter by visibility (true or false)
    }

    if (filters.dateFrom && filters.dateTo) {
        query.created_at = {
            $gte: new Date(filters.dateFrom),
            $lte: new Date(filters.dateTo)
        };
    } else if (filters.dateFrom) {
        query.created_at = { $gte: new Date(filters.dateFrom) };
    } else if (filters.dateTo) {
        query.created_at = { $lte: new Date(filters.dateTo) };
    }

    // console.log(query);
    // Fetch complains based on the query
    const complains = await Complain.find(query)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .populate('created_by')
        .exec();

    // Map the results to the desired format
    return complains.map(complain => ({
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project ? complain.project._id : null,
        project_name: complain.project ? complain.project.name : null,
        device: complain.device ? complain.device._id : null,
        device_name: complain.device ? complain.device.name : null,
        equipment: complain.equipment ? complain.equipment : null,
        subEquipment: complain.subEquipment ? complain.subEquipment._id : null,
        subEquipment_name: complain.subEquipment ? complain.subEquipment.title : null,
        equipmentProblem: complain.equipmentProblem ? complain.equipmentProblem._id : null,
        problem: complain.equipmentProblem ? complain.equipmentProblem.problem : null,
        assignTo: complain.assignTo ? complain.assignTo._id : null,
        assignTo_name: complain.assignTo ? complain.assignTo.name : null,
        closedAt: complain.closedAt ? complain.closedAt : null,
        type: complain.type,
        logs: complain.logs,
        severity: complain.severity,
        description: complain.description,
        visible: complain.visible,
        duration: calculateDuration(complain.created_at, complain.closedAt),
        created_by: complain.created_by ? complain.created_by._id : null,
        created_by_name: complain.created_by ? complain.created_by.name : null,
        created_at: complain.created_at
    }));
};

const getFilteredComplains = async (id, role) => {
    const user = await User.findById(id); // Fetch user by ID
    const myRole = role[0].name;
    const isAdmin = myRole === 'admin' || myRole === 'super admin';
    const isSupperAdmin = myRole === 'super admin';
    const projects = user.assigned_projects; // Get user's assigned projects

    console.log("role", myRole);

    let query = { is_deleted: false };

    // If the user is not an admin, apply project and permission filters
    if (!isAdmin) {
        const permission = await Permissions.findOne({ userId: user._id, is_deleted: false });

        if (permission?.complain?.read_self && permission?.complain?.read === false) {
            query.created_by = user._id; // Fetch only user's own complaints
        }

        // Add project filtering for non-admin users
        if (!isSupperAdmin) {
            query.project = { $in: projects }; // Match project IDs in user's assigned projects
        }
    }

    // Fetch complains based on the query
    const complains = await Complain.find(query)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .populate('created_by')
        .exec();

    // Map the results to the desired format
    return complains.map(complain => ({
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project ? complain.project._id : null,
        project_name: complain.project ? complain.project.name : null,
        device: complain.device ? complain.device._id : null,
        device_name: complain.device ? complain.device.name : null,
        equipment: complain.equipment ? complain.equipment : null,
        subEquipment: complain.subEquipment ? complain.subEquipment._id : null,
        subEquipment_name: complain.subEquipment ? complain.subEquipment.title : null,
        equipmentProblem: complain.equipmentProblem ? complain.equipmentProblem._id : null,
        problem: complain.equipmentProblem ? complain.equipmentProblem.problem : null,
        assignTo: complain.assignTo ? complain.assignTo._id : null,
        assignTo_name: complain.assignTo ? complain.assignTo.name : null,
        closedAt: complain.closedAt ? complain.closedAt : null,
        logs: complain.logs,
        type: complain.type,
        visible: complain.visible,
        severity: complain.severity,
        description: complain.description,
        duration: calculateDuration(complain.created_at, complain.closedAt),
        created_by: complain.created_by ? complain.created_by._id : null,
        created_by_name: complain.created_by ? complain.created_by.name : null,
        created_at: complain.created_at
    }));
};

const getAssignedComplain = async (id) => {

    const team = await Team.findById(id).populate("roles");
    if (!team) {
        throw new Error('Team not found');
    }

    // let query = { is_deleted: false, assignTo: team._id };
    let query = {
        is_deleted: false,
        assignTo: team._id,
        status: { $nin: ['pending', 'closed'] }
    };

    // Fetch complaints with populated fields
    const complains = await Complain.find(query)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .populate('created_by')
        .sort({ created_at: -1 })
        .exec();

    // Uncomment and return formatted complaints if needed
    return complains.map(complain => ({
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project ? complain.project._id : null,
        project_name: complain.project ? complain.project.name : null,
        device: complain.device ? complain.device._id : null,
        device_name: complain.device ? complain.device.name : null,
        latitude: complain.device ? complain.device.latitude : null,
        longitude: complain.device ? complain.device.longitude : null,
        equipment: complain.equipment ? complain.equipment : null,
        subEquipment: complain.subEquipment ? complain.subEquipment._id : null,
        subEquipment_name: complain.subEquipment ? complain.subEquipment.title : null,
        equipmentProblem: complain.equipmentProblem ? complain.equipmentProblem._id : null,
        problem: complain.equipmentProblem ? complain.equipmentProblem.problem : null,
        assignTo: complain.assignTo ? complain.assignTo._id : null,
        assignTo_name: complain.assignTo ? complain.assignTo.name : null,
        assignAt: complain.assignAt ? complain.assignAt : null,
        closedAt: complain.closedAt ? complain.closedAt : null,
        logs: complain.logs,
        visible: complain.visible,
        type: complain.type,
        severity: complain.severity,
        description: complain.description,
        duration: calculateDuration(complain.created_at, complain.closedAt),
        created_by: complain.created_by ? complain.created_by._id : null,
        created_by_name: complain.created_by ? complain.created_by.name : null,
        created_at: complain.created_at
    }));
};

const getComplainCounts = async (id, role) => {
    const complain = await Complain.aggregate([
        {
            $match: {
                is_deleted: false
            }
        },
        {
            $facet: {
                statusCounts: [
                    {
                        $group: {
                            _id: "$status",
                            count: { $sum: 1 }
                        }
                    }
                ],
                projectStatusCounts: [
                    {
                        $group: {
                            _id: {
                                project: "$project",
                                status: "$status"
                            },
                            count: { $sum: 1 }
                        }
                    },
                    {
                        $lookup: {
                            from: "projects",
                            localField: "_id.project",
                            foreignField: "_id",
                            as: "project"
                        }
                    },
                    {
                        $unwind: "$project"
                    },
                    {
                        $match: {
                            "project.is_deleted": false
                        }
                    },
                    {
                        $group: {
                            _id: "$_id.project",
                            name: { $first: "$project.name" },
                            statusCounts: {
                                $push: {
                                    status: "$_id.status",
                                    count: "$count"
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]);

    const statusCounts = complain[0].statusCounts;
    const projectStatusCounts = complain[0].projectStatusCounts;

    const statusMap = statusCounts.reduce((acc, status) => {
        acc[status._id] = status.count;
        return acc;
    }, {});

    if (role[0].name == 'user') {
        const user = await User.findById(id).select('assigned_projects');
        const projects = projectStatusCounts.map(project => {
            const statusCountMap = project.statusCounts.reduce((acc, status) => {
                acc[status.status] = status.count;
                return acc;
            }, {});
            console.log(user.assigned_projects);
            if (user.assigned_projects.includes(project._id)) {
                return {
                    name: project.name,
                    pending: statusCountMap.pending || 0,
                    inprogress: statusCountMap.inprogress || 0,
                    resolved: statusCountMap.resolved || 0,
                    closed: statusCountMap.closed || 0
                };
            }
        });
        console.log(projects.filter(item => item !== undefined));
        return {
            pending: statusMap.pending || 0,
            inprogress: statusMap.inprogress || 0,
            resolved: statusMap.resolved || 0,
            closed: statusMap.closed || 0,
            projects: projects.filter(item => item !== undefined)
        };
    } else {
        const projects = projectStatusCounts.map(project => {
            const statusCountMap = project.statusCounts.reduce((acc, status) => {
                acc[status.status] = status.count;
                return acc;
            }, {});
            return {
                name: project.name,
                pending: statusCountMap.pending || 0,
                inprogress: statusCountMap.inprogress || 0,
                resolved: statusCountMap.resolved || 0,
                closed: statusCountMap.closed || 0
            };
        });

        return {
            pending: statusMap.pending || 0,
            inprogress: statusMap.inprogress || 0,
            resolved: statusMap.resolved || 0,
            closed: statusMap.closed || 0,
            projects: projects
        };
    }
};

const updateComplain = async (id, data) => {
    // Update the complaint
    // console.log("data", data)
    const updatedComplain = await Complain.findByIdAndUpdate(id, data, { new: true })
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .exec();

    if (!updatedComplain) {
        throw new Error('Complaint not found');
    }

    console.log("updatedComplain", updatedComplain)
    return {
        _id: updatedComplain._id,
        complainNumber: updatedComplain.complainNumber,
        status: updatedComplain.status,
        project: updatedComplain.project._id,
        project_name: updatedComplain.project.name,
        device: updatedComplain.device._id,
        device_name: updatedComplain.device.name,
        equipment: updatedComplain.equipment,
        // equipment: updatedComplain.equipment._id,
        // equipment_name: updatedComplain.equipment.title,
        subEquipment: updatedComplain.subEquipment ? updatedComplain.subEquipment._id : null,
        subEquipment_name: updatedComplain.subEquipment ? updatedComplain.subEquipment.title : null,
        equipmentProblem: updatedComplain.equipmentProblem ? updatedComplain.equipmentProblem._id : null,
        problem: updatedComplain.equipmentProblem ? updatedComplain.equipmentProblem.problem : null,
        assignTo: updatedComplain.assignTo ? updatedComplain.assignTo._id : null,
        assignTo_name: updatedComplain.assignTo ? updatedComplain.assignTo.name : null,
        closedAt: updatedComplain.closedAt ? updatedComplain.closedAt : "",
        duration: calculateDuration(updatedComplain.created_at, updatedComplain.closedAt),
        type: updatedComplain.type,
        visible: updatedComplain.visible,
        severity: updatedComplain.severity,
        description: updatedComplain.description
    };
};

const updateComplainStatus = async (id, data) => {

    console.log("data in chang status", data);
    const complain = await Complain.findById(id)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .populate('assignTo')
        .exec();
    if (!complain) {
        return res.status(404).json({ message: 'Complain not found' });
    }

    const newLog = {
        status: data.status,
        action: data.action,
        remarks: data.remarks,
        resolvers: data.resolvers ? data.resolvers.split(',') : [],
        updated_at: Date.now(),
        inserted_at: Date.now(),
        filePaths: data.logFilePaths || [],
    };

    complain.logs.push(newLog);
    complain.status = data.status;

    if (data.assignTo && data.assignTo != "") {
        complain.assignTo = data.assignTo;
        complain.assignAt = new Date();
    }
    if (data.status == 'pending') {
        complain.assignTo = null;
        complain.assignAt = null;
    }
    if (data.status == 'closed') {
        complain.closedAt = new Date();
    }

    await complain.save();


    return {
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project._id,
        project_name: complain.project.name,
        device: complain.device._id,
        device_name: complain.device.name,
        equipment: complain.equipment ? complain.equipment : null,
        subEquipment: complain.subEquipment ? complain.subEquipment._id : "",
        subEquipment_name: complain.subEquipment ? complain.subEquipment.title : "",
        equipmentProblem: complain.equipmentProblem ? complain.equipmentProblem._id : "",
        problem: complain.equipmentProblem ? complain.equipmentProblem.problem : "",
        assignTo: complain.assignTo ? complain.assignTo._id : "",
        assignTo_name: complain.assignTo ? complain.assignTo.name : "",
        assignAt: complain.assignAt ? complain.assignAt : "",
        closedAt: complain.closedAt ? complain.closedAt : "",
        duration: calculateDuration(complain.created_at, complain.closedAt),
        logs: complain.logs,
        visible: complain.visible,
        type: complain.type,
        severity: complain.severity,
        description: complain.description
    };
};

const deleteComplain = async (id, data) => {
    // const deletedComplain = await Complain.findByIdAndDelete(id);
    const deletedComplain = await Complain.findByIdAndUpdate(id, data);
    if (!deletedComplain) {
        throw new Error('Complaint not found');
    }
    return {
        _id: deletedComplain._id,
        status: deletedComplain.status,
        project: deletedComplain.project,
        device: deletedComplain.device,
        equipment: deletedComplain.equipment,
        subEquipment: deletedComplain.subEquipment,
        equipmentProblem: deletedComplain.equipmentProblem,
        assignTo: deletedComplain.assignTo,
        type: deletedComplain.type,
        visible: deletedComplain.visible,
        severity: deletedComplain.severity,
        description: deletedComplain.description
    };
};

const getComplainById = async (id) => {
    console.log("USERiD", id)
    const complain = await Complain.findById(id)
        .populate('project')
        .populate('device')
        .populate('equipment')
        .populate('subEquipment')
        .populate('equipmentProblem')
        .exec();

    if (!complain) {
        throw new Error('Complaint not found');
    }

    return {
        _id: complain._id,
        complainNumber: complain.complainNumber,
        status: complain.status,
        project: complain.project._id,
        project_name: complain.project.name,
        device: complain.device._id,
        device_name: complain.device.name,
        equipment: complain.equipment,
        // equipment: complain.equipment._id,
        // equipment_name: complain.equipment.title,
        subEquipment: complain.subEquipment._id,
        subEquipment_name: complain.subEquipment.title,
        equipmentProblem: complain.equipmentProblem._id,
        problem: complain.equipmentProblem.problem,
        assignTo: complain.assignTo,
        type: complain.type,
        visible: complain.visible,
        severity: complain.severity,
        description: complain.description
    };
};

module.exports = {
    createComplain,
    getComplainCounts,
    getComplain,
    getComplains,
    getResolvedComplain,
    updateComplainStatus,
    updateComplain,
    deleteComplain,
    getComplainById,
    getAssignedComplain,
    getFilteredComplains
};


function calculateDuration(assignAt, closedAt) {
    // Check if either date is null or undefined
    if (!assignAt || !closedAt) {
        return null;
    }

    try {
        // Parse ISO date strings
        const startDate = new Date(assignAt);
        const endDate = new Date(closedAt);

        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return null;
        }

        // Calculate duration in seconds
        let totalSeconds = Math.floor((endDate - startDate) / 1000);

        // Calculate each unit
        const days = Math.floor(totalSeconds / (24 * 60 * 60));
        totalSeconds %= (24 * 60 * 60);

        const hours = Math.floor(totalSeconds / (60 * 60));
        totalSeconds %= (60 * 60);

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Build the duration string
        const parts = [];

        if (days > 0) {
            parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
        }
        if (hours > 0) {
            parts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} ${minutes === 1 ? 'min' : 'mins'}`);
        }
        if (seconds > 0 || parts.length === 0) {
            parts.push(`${seconds} ${seconds === 1 ? 'sec' : 'secs'}`);
        }

        return parts.join(' ');
    } catch (error) {
        return null;
    }
}