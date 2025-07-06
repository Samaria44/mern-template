const { getUserIdFromJwt, getUserRoleFromJwt } = require('../middleware/authMiddleware');
const complainService = require('../services/complain');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/uploads/complain-logs/');
    },
    // filename: function (req, file, cb) {
    //     cb(null, Date.now() + '-' + file.originalname.replaceAll("-", "_").replaceAll(" ", "-"));
    // }
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


const createComplain = async (req, res) => {
    try {
        console.log(req.userId);
        const complain = await complainService.createComplain({ ...req.body, created_by: req.userId });

        res.status(201).json(complain);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getComplain = async (req, res) => {
    try {
        const { id } = req.params;
        const complains = await complainService.getComplain(id);
        res.json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getResolvedComplain = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        const { id } = req.params;
        // let id = getUserIdFromJwt(token);
        // console.log(id);
        const complains = await complainService.getResolvedComplain(id);
        res.json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getComplains = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);
        let filter = req.body
        console.log("filter, ",filter)
        const complains = filter ? await complainService.getComplains(id, role, filter) : await complainService.getComplains(id, role);

        const processedComplains = complains.map(complain => {
            // console.log("complain",complain)
            if (complain.logs && Array.isArray(complain.logs)) {
                // console.log("complain.logs",complain.logs)
                complain.logs = complain.logs.map(log => {
                    if (log.filePaths && Array.isArray(log.filePaths)) {
                        // Concatenate each file path with your custom string
                        log.filePaths = log.filePaths.map(filePath => filePath != null ?
                            `${req.protocol}://${req.get('host')}/api/v1/${filePath.replaceAll("\\", "/")}` : null
                        );
                    }
                    return log;
                });
            }
            // return processedComplains;
            return complain;
        });

        res.json(processedComplains);
        // res.json(complains);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
const getFilteredComplains = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);
        const complains = await complainService.getFilteredComplains(id, role);

        const processedComplains = complains.map(complain => {
            if (complain.logs && Array.isArray(complain.logs)) {
                complain.logs = complain.logs.map(log => {
                    if (log.filePaths && Array.isArray(log.filePaths)) {
                        // Concatenate each file path with your custom string
                        log.filePaths = log.filePaths.map(filePath => filePath != null ?
                            `${req.protocol}://${req.get('host')}/api/v1/${filePath.replaceAll("\\", "/")}` : null
                        );
                    }
                    return log;
                });
            }
            // return processedComplains;
            return complain;
        });

        res.json(processedComplains);
        // res.json(complains);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getAssignedComplain = async (req, res) => {
    try {
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);

        // console.log("id",id)
        let role = getUserRoleFromJwt(token);
        const complains = await complainService.getAssignedComplain(id);

        // console.log(complains);
        res.json(complains);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const getComplainCounts = async (req, res) => {
    try {
        // console.log("hit controller");
        let token = req.headers["authorization"];
        let id = getUserIdFromJwt(token);
        let role = getUserRoleFromJwt(token);
        const complains = await complainService.getComplainCounts(id, role);
        res.json(complains);
    } catch (error) {
        // console.log("hit error");
        res.status(500).json({ message: error.message });
    }
};

const getActiveComplains = async (req, res) => {
    try {
        const complains = await complainService.getActiveComplains();
        res.json(complains);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateComplain = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedComplain = await complainService.updateComplain(id, { ...req.body, is_updated: true, updated_at: new Date(), updated_by: req.userId });
        console.log("_id....")
        res.status(201).json(updatedComplain);
    } catch (error) {
        console.log("-----", error)
        res.status(400).json({ message: error.message });
    }
};

const updateComplainStatus = async (req, res) => {
    const { id } = req.params;
    // console.log("id", id)
    console.log("---")
    // console.log("req.files", req.files)
    // console.log("req.body.files", req.body.files)
    const logFilePaths = req.files ? req.files.map(file => file.path) : [];

    // logFilePaths.forEach(element => {
    //     console.log("element", element)
    // });

    try {
        const updatedComplain = await complainService.updateComplainStatus(id, { ...req.body, created_by: req.userId, logFilePaths });

        // console.log(updateComplain);
        // const updatedComplain = await complainService.updateComplainStatus(id, { ...req.body, created_by: req.userId });
        // res.status(201).json({message: "getting files", files: logFilePaths});
        res.status(201).json(updatedComplain);
    } catch (error) {
        // console.log("error", error);
        res.status(400).json({ message: error.message });
    }
};

const deleteComplain = async (req, res) => {
    const { id } = req.params;
    try {
        await complainService.deleteComplain(id, { is_deleted: true, deleted_at: new Date(), deleted_by: req.userId });
        res.json({ message: 'Complain deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    upload,
    createComplain,
    getComplainCounts,
    getComplain,
    getComplains,
    getResolvedComplain,
    getActiveComplains,
    updateComplainStatus,
    updateComplain,
    deleteComplain,
    getAssignedComplain
};