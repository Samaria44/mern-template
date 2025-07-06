const mongoose = require('mongoose');
const dbConfig = require("./db");
const db = require("../models");
const Permission = require('../models/Permission');
const { generatePermissions } = require('../utils/HelperFunctions');
const Role = db.role;
const User = db.user;

const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
            //useNewUrlParser: true,
            //useUnifiedTopology: true
        })
            .then(()  => {
                console.log("Successfully connect to MongoDB.");
                initial();
                initialUser();
                initialUserPermission();
            })
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

module.exports = connectDB;


async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("added 'user' to roles collection");

            await new Role({ name: "admin" }).save();
            console.log("added 'admin' to roles collection");

            await new Role({ name: "super admin" }).save();
            console.log("added 'super admin' to roles collection");
        }
    } catch (err) {
        console.error("Error initializing roles:", err);
    }
}


async function initialUser() {
    try {
        const count = await User.estimatedDocumentCount();
        if (count === 0) {
            const role = await Role.findOne({ name: "super admin" });
            if (role) {
                const newUser = new User({
                    name: "Admin User",
                    email: "Admin",
                    number: "00000000000",
                    username: "admin",
                    email: "admin",
                    password: "$2a$08$0lmLLY/Vt7Q6tgCSI/FIveXh3LDlsTfo9bEXjzg.ptdO383oiiGEm",//Admin@100
                    // password: "$2a$08$81IdAvtI89yWrST.mncgMurKSspFJgUd9/7E29nU45HDfpqp9o7ji",//Test@123
                    roles: [role._id],
                });

                await newUser.save();
                console.log("added 'super admin user' to users collection");
            } else {
                console.log("Super Admin role not found");
            }
        }
    } catch (err) {
        console.error("Error initializing user:", err);
    }
}

async function initialUserPermission() {
    try {
        const count = await Permission.estimatedDocumentCount();
        if (count === 0) {
            const role = await Role.findOne({ name: "super admin" });
            if (role) {
                const user = await User.findOne({roles : role._id});

                const permission = new Permission({
                    userId: user._id,
                    ...generatePermissions(true)
                });

                await permission.save();
                console.log("added 'super admin user permission' to users Permission");
            }else{
                console.log("Super Admin role not found");
            }
        }
    } catch (err){
        console.error("Error initializing user Permission:", err);
    }
}
// const adminRole = new Role({
//     name: 'admin',
//     permissions: {
//       products: { create: true, read: true, update: true, delete: true },
//       categories: { create: true, read: true, update: true, delete: true }
//     }
//   });
  
//   const userRole = new Role({
//     name: 'user',
//     permissions: {
//       products: { create: true, read: true, update: false, delete: false },
//       categories: { create: false, read: true, update: false, delete: false }
//     }
//   });