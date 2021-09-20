// const jwt = require('jsonwebtoken');
// const { secret } = require('../config');
const User = require('../models/Users');
const Role = require('../models/Roles');
const { checkAdmin } = require('../middleware/auth');

const singUp = async (req, resp) => {
  const {
    email,
    password,
    roles,
  } = req.body;
  if (!email || !password) {
    resp.status(400).json({ message: 'You didn´t enter email or password' });
  }
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists) {
    resp.status(403).json('user already exists');
  } else {
    // resp.json('no existe');
    const newUser = new User({
      email,
      password: await User.encryptPassword(password),
    });
    if (roles) {
      const foundRoles = await Role.find({ name: { $in: roles } });
      newUser.roles = foundRoles.map((role) => role._id);
    } else {
      const role = await Role.findOne({ name: 'user' });
      newUser.roles = [role._id];
    }
    // const savedUser = await newUser.save();
    // const token = jwt.sign({ id: savedUser._id }, secret, { expiresIn: 86400 });
    const savedUser = await newUser.save();
    // console.log(savedUser);
    resp.status(200).json(savedUser);
  }
//   await newUser.save();
//   resp.json('signup');
};

const getUsers = async (req, resp) => {
  const allUsers = await User.find();
  resp.status(200).json(allUsers);
};

const getUserById = async (req, resp) => {
  const user = await User.findById(req.params.uid);
  // const user = await User.find({ $or: [{ email: req.params.uid }, { _id: req.params.uid }] });
  // const user = await User.find({ email: req.params.uid } || { _id: req.params.uid });
  checkAdmin(req).then(async (admin) => {
    if ((admin === true) || (req.userId === req.params.uid)) {
      if (user === null) {
        resp.status(404).json({ message: 'The user doesn´t exist' });
      }
      resp.status(200).json(user);
    } else {
      resp.status(403).json('you need the admin role');
    }
  });
};
const updateUserById = async (req, resp) => {
  if (Object.keys(req.body).length === 0) {
    resp.status(400).json({ message: 'You didn´t enter email or password' });
  } else {
    // const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, {
    //   new: true,
    // });
    // resp.status(200).json(updatedUser);
    const user = await User.findById(req.params.uid);
    checkAdmin(req).then(async (admin) => {
      if ((admin === true) || (req.userId === req.params.uid)) {
        if (user === null) {
          resp.status(404).json({ message: 'The user doesn´t exist' });
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, {
          new: true,
        });
        resp.status(200).json(updatedUser);
      } else {
        resp.status(403).json('you need the admin role');
      }
    });
  }
};

const deleteUserById = async (req, resp) => {
  const user = await User.findById(req.params.uid);
  checkAdmin(req).then(async (admin) => {
    if ((admin === true) || (req.userId === req.params.uid)) {
      if (user === null) {
        resp.status(404).json({ message: 'The user doesn´t exist' });
      }
      await User.findByIdAndDelete(req.params.uid);
      resp.status(200).json(user);
    } else {
      resp.status(403).json('you need the admin role');
    }
  });
};

module.exports = {
  getUsers,
  singUp,
  getUserById,
  updateUserById,
  deleteUserById,
};
