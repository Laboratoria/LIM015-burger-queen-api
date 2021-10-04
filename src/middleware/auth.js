const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const User = require('../models/Users');
const Role = require('../models/Roles');

const authorization = async (req, resp, next) => {
  try {
    const { token } = req.headers;
    // validar que eltoken sea válido
    if (!token) {
      return resp.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    next();
  } catch (error) {
    return resp.status(401).json({ mesagge: 'invalid token' });
  }
};

const isAdmin = async (req, resp, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  roles.forEach((role) => {
    if (role.name === 'admin') {
      next();
    } else {
      resp.status(403).json({ message: 'you need the admin role' });
    }
  });
};

const checkAdmin = async (req) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  let admin = false;
  roles.forEach((role) => {
    if (role.name === 'admin') {
      admin = true;
    } else {
      admin = false;
    }
  });
  return admin;
};

module.exports = { authorization, isAdmin, checkAdmin };
