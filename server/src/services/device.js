const Device = require('../models/Device');
const User = require('../models/User');
const DeviceLog = require('../models/DeviceLog');

// const createDevice = async (deviceData) => {
//   // const existingDevice = await Device.findOne({ ip: deviceData.ip });

//   // if (existingDevice) {
//   //   throw new Error('Device with this IP already exists');
//   // }

//   return await Device.create(deviceData);
// };

const createDevice = async (deviceData) => {
  const device = await Device.create(deviceData);
  // console.log(device);
  // Find the device by its ID and populate the 'project' field
  const populatedDevice = await Device.findById(device._id)
    .populate("project")
    .exec();
  // console.log("populatedDevice", populatedDevice);


  // Return the relevant fields
  return {
    _id: populatedDevice._id,
    location_id: populatedDevice.location_id,
    name: populatedDevice.name,
    state: populatedDevice.state,
    longitude: populatedDevice.longitude,
    latitude: populatedDevice.latitude,
    project: populatedDevice.project ? populatedDevice.project._id : null,
    project_name: populatedDevice.project ? populatedDevice.project.name : null
  };
};


const getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems = async () => {
  return await Device.aggregate(
    [
      {
        $lookup: {
          from: "equipment",
          localField: "_id",
          foreignField: "device",
          as: "equipments"
        }
      },
      {
        $match: {
          state: "active",
          is_deleted: false
        }
      },
      {
        $unwind: {
          path: "$equipments",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "subequipments",
          localField: "equipments._id",
          foreignField: "equipment",
          as: "equipments.subEquipments"
        }
      },
      {
        $lookup: {
          from: "equipmentproblems",
          localField: "equipments._id",
          foreignField: "equipment",
          as: "equipments.equipmentProblems"
        }
      },
      {
        $group: {
          _id: {
            deviceId: "$_id",
            equipmentId: "$equipments._id"
          },
          name: { $first: "$name" },
          state: { $first: "$state" },
          __v: { $first: "$__v" },
          equipment: {
            $first: {
              _id: "$equipments._id",
              title: "$equipments.title",
              state: "$equipments.state",
              is_deleted: "$equipments.is_deleted",
              subEquipments: {
                $filter: {
                  input: "$equipments.subEquipments",
                  as: "subEquipments",
                  cond: {
                    $and: [
                      { $eq: ["$$subEquipments.is_deleted", false] },
                      { $eq: ["$$subEquipments.state", "active"] }
                    ]
                  }
                }
              },
              equipmentProblems: {
                $filter: {
                  input: "$equipments.equipmentProblems",
                  as: "equipmentProblems",
                  cond: {
                    $and: [
                      { $eq: ["$$equipmentProblems.is_deleted", false] },
                      { $eq: ["$$equipmentProblems.state", "active"] }
                    ]
                  }
                }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$_id.deviceId",
          name: { $first: "$name" },
          state: { $first: "$state" },
          __v: { $first: "$__v" },
          equipments: {
            $push: {
              _id: "$equipment._id",
              title: "$equipment.title",
              state: "$equipment.state",
              is_deleted: "$equipment.is_deleted",
              subEquipments: "$equipment.subEquipments",
              equipmentProblems: "$equipment.equipmentProblems"
            }
          }
        }
      }
    ]
  );
};

const getDevicesWithEquipments = async () => {
  return await Device.aggregate([
    {
      $lookup: {
        from: "equipment",         // Name of the equipment collection
        localField: "_id",         // Field from the device collection
        foreignField: "device",    // Field from the equipment collection
        as: "equipments"           // Name of the array to add the joined data
      }
    },
    {
      $match: {
        state: "active",
        is_deleted: false
      }
    },
    {
      $unwind: {
        path: "$equipments",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: {
        "equipments.is_deleted": false,
        "equipments.state": 'active'
      }
    },
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        state: { $first: "$state" },
        __v: { $first: "$__v" },
        equipments: { $push: "$equipments" }
      }
    }
  ]);
};

const getDevices = async (userId, role) => {
  // console.log(userId, role[0].name)
  const devices = await Device.find({ is_deleted: false }).populate("project");
  const user = await User.findById(userId);
  const projects = user.assigned_projects;

  if (role[0].name == 'super admin' || role[0].name == 'admin') {
    return devices.map(device => ({
      _id: device._id,
      location_id: device.location_id,
      name: device.name,
      state: device.state,
      longitude: device.longitude,
      latitude: device.latitude,
      project: device.project ? device.project._id : null,
      project_name: device.project ? device.project.name : null,
      created_at: device.created_at ? device.created_at : null
    }));
  }
  const filteredDevices = devices
    .filter(device => device.project && projects.includes(device.project._id))
    .map(device => ({
      _id: device._id,
      location_id: device.location_id,
      name: device.name,
      state: device.state,
      longitude: device.longitude,
      latitude: device.latitude,
      project: device.project ? device.project._id : null,
      project_name: device.project ? device.project.name : null,
      created_at: device.created_at ? device.created_at : null
    }));
  return filteredDevices;

};

const getActiveDevices = async () => {
  return await Device.find({ state: "active" });
};

const getActiveDevicesOfProject = async (projectId) => {
  return await Device.find({ state: "active", project: projectId, is_deleted: false });
};

const getDeviceIPs = async () => {
  return await Device.aggregate([
    {
      $group: {
        _id: "$ip"
      }
    },
    {
      $project: {
        _id: 0,
        ip: "$_id"
      }
    }
  ]);;
};

const updateDevice = async (id, deviceData) => {
  // const existingDevice = await Device.findOne({ ip: deviceData.ip });

  // if (existingDevice && existingDevice._id != id) {
  //   throw new Error('Device with this IP already Exist');
  // }
  const device = await Device.findByIdAndUpdate(id, deviceData, { new: true }).populate("project");
  return {
    _id: device._id,
    location_id: device.location_id,
    name: device.name,
    state: device.state,
    longitude: device.longitude,
    latitude: device.latitude,
    project: device.project ? device.project._id : null,
    project_name: device.project ? device.project.name : null
  };
};

const deleteDevice = async (id, data) => {
  // return await Device.findByIdAndDelete(id);
  return await Device.findByIdAndUpdate(id, data);
};

const getDeviceById = async (id) => {
  return await Device.findById(id);
};

const getDeviceWithLatestLog = async () => {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  return await Device.aggregate([
    {
      $lookup: {
        from: 'devicelogs', // Collection name of the DeviceLog
        localField: '_id',
        foreignField: 'deviceId',
        as: 'logs'
      }
    },
    {
      $unwind: {
        path: '$logs',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $sort: {
        'logs.created_at': -1 // Sort logs by creation date in descending order
      }
    },
    {
      $group: {
        _id: '$_id',
        name: { $first: '$name' },
        ip: { $first: '$ip' },
        port: { $first: '$port' },
        isConnected: {
          $first: {
            $cond: {
              if: { $gt: ['$logs.created_at', fiveMinutesAgo] },
              then: '$isConnected',
              else: false
            }
          }
        },
        eventsRegistered: { $first: '$eventsRegistered' },
        Latitude: { $first: '$Latitude' },
        Longitude: { $first: '$Longitude' },
        mac: { $first: '$mac' },
        created_at: { $first: '$created_at' },
        created_by: { $first: '$created_by' },
        updated_at: { $first: '$updated_at' },
        updated_by: { $first: '$updated_by' },
        is_updated: { $first: '$is_updated' },
        deleted_at: { $first: '$deleted_at' },
        deleted_by: { $first: '$deleted_by' },
        is_deleted: { $first: '$is_deleted' },
        latestLog: { $first: '$logs' } // Get the latest log
      }
    },
    {
      $addFields: {
        isConnected: {
          $cond: {
            if: {
              $or: [
                { $eq: ['$latestLog', null] },
                { $lte: ['$latestLog.created_at', fiveMinutesAgo] }
              ]
            },
            then: false,
            else: '$isConnected'
          }
        }
      }
    },
    {
      $sort: {
        name: 1 // Sort by device name in ascending order
      }
    }
  ]);
};

module.exports = {
  createDevice,
  getDevicesWithEquipmentsSubEquipmentsAndEquipmentProblems,
  getDevicesWithEquipments,
  getDevices,
  getActiveDevices,
  updateDevice,
  deleteDevice,
  getDeviceById,
  getDeviceWithLatestLog,
  getDeviceIPs,
  getActiveDevicesOfProject
};