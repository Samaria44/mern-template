const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const db = require("../models");
const authConfig = require("../config/auth.config");
const User = db.user;
const Role = db.role;
const Permissions = db.Permissions;
// const mongoose = require('mongoose');

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

const checkPermission = (entity, action) => {
  // console.log("checkPermission ")
  return async (req, res, next) => {
    try {
      const UserID = getUserIdFromJwt(req.headers["authorization"]);
      const user = await User.findById(UserID).populate('roles');
      const permissions = await Permissions.findOne({ userId: user._id });
      if (user.roles != 'admin' || user.roles != 'super admin') {
        if (!user || !permissions[entity][action]) {
          return res.status(403).json({ message: 'Access denied' });
        }
      }
      next();
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

// const verifyToken = (req, res, next) => {
//   let token = req.headers["authorization"];

//   console.log(token);
//   if (!token) {
//     return res.status(403).send({ message: "No token provided!" });
//   }

//   jwt.verify(token, config.secret, (err, decoded) => {
//     if (err) {
//       return catchError(err, res);
//     }
//     req.userId = decoded.id;
//     next();
//   });
// };

// const verifyToken = (req, res, next) => {
//   console.log('Middleware reached');
//   // next();
// };

function getUserIdFromJwt(token) {
  try {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    // Decode the JWT token
    const decodedToken = jwt.verify(token, authConfig.secret);
    // Extract user ID from the payload
    // console.log(decodedToken);
    return decodedToken.id; // Adjust according to your JWT payload structure
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}
function getUserRoleFromJwt(token) {
  try {
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    // Decode the JWT token
    const decodedToken = jwt.verify(token, authConfig.secret);
    // Extract user ID from the payload
    // console.log(decodedToken);
    return decodedToken.roles; // Adjust according to your JWT payload structure
  } catch (err) {
    console.error('Invalid token:', err);
    return null;
  }
}

const verifyToken = (req, res, next) => {
  // console.log("it hit")
  let token = req.headers["authorization"];

  // console.log("token", token);
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  // Remove the "Bearer " prefix if present
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err.message);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
  // next();
};

// const verifyToken = (req, res, next) => {
//   console.log('Middleware reached');
//   next();
// };

const verifyAdminToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    let status = false;

    decoded.roles.forEach(element => {
      if (element.name != "user") {
        status = true;
      }
    });

    if (!status) {
      return res.status(403).send({ message: "unkonwn error!" });
    }
    // console.log("in verifyAdminToken", decoded.roles);
    next();

  });
};

const verifyAdminTokenSecure = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    let status = false;

    decoded.roles.forEach(element => {
      if (element.name == "admin") {
        status = true;
      }
    });

    if (!status) {
      return res.status(403).send({ message: "unkonwn error!" });
    }
    // console.log("in verifyAdminToken", decoded.roles);
    next();

  });
};

const isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if (user.roles) {
      res.status(500).send({ message: "permission denied!!!" });
      return;
    }
    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "admin") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Admin Role!" });
        return;
      }
    );
  });
};

const isModerator = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "moderator") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require Moderator Role!" });
        return;
      }
    );
  });
};

const authJwt = {
  verifyToken,
  checkPermission,
  isAdmin,
  isModerator,
  verifyAdminToken,
  verifyAdminTokenSecure,
  getUserIdFromJwt,
  getUserRoleFromJwt
};
module.exports = authJwt;
