const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports.isSignedIn = async (req, res, next) => {
  try {
    const token = req.header("token");
    console.log("TOKEN HERE ", token);
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new Error();
    }
    req.profile = user;
    next();
  } catch {
    return res.status(401).send({
      error: "Please authenticate",
    });
  }
};

module.exports.isCustomer = async (req, res, next) => {
  try {
    if (req.profile.role == 0) {
      next();
    } else {
      throw new Error();
    }
  } catch {
    return res.status(401).send({
      error: "Access denied",
    });
  }
};

module.exports.isDeliveryBoy = async (req, res, next) => {
  try {
    if (req.profile.role == 1) {
      next();
    } else {
      throw new Error();
    }
  } catch {
    return res.status(401).send({
      error: "Access denied",
    });
  }
};

module.exports.isAdmin = async (req, res, next) => {
  try {
    if (req.profile.role == 2) {
      next();
    } else {
      throw new Error();
    }
  } catch {
    return res.status(401).send({
      error: "Access denied",
    });
  }
};

module.exports.haveRightsForOrder = async (req, res, next) => {
  try {
    if (req.profile._id.toString() == req.compliant.resolvedBy) {
      next();
    } else {
      throw new Error();
    }
  } catch {
    return res.status(401).send({
      error: "Access denied",
    });
  }
};
