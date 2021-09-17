// const jwt = require('jsonwebtoken');
// const { secret } = require('../config');
const User = require('../models/Users');
const Role = require('../models/Roles');

const singUp = async (req, resp) => {
  const {
    email,
    password,
    roles,
  } = req.body;
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
  console.log(savedUser);
  resp.status(200).json('sign up');
//   await newUser.save();
//   resp.json('signup');
};

const getUsers = async (req, resp, next) => {
  const allUsers = await User.find();
  resp.json(allUsers);
};

const getUserById = async (req, resp, next) => {
  const user = await User.findById(req.params.uid);
  // const user = await User.find({ $or: [{ email: req.params.uid }, { _id: req.params.uid }] });
  // const user = await User.find({ email: req.params.uid } || { _id: req.params.uid });
  resp.json(user);

  // resp.status(200).json(emailUser);
};
const updateUserById = async (req, resp, next) => {
  const updatedUser = await User.findByIdAndUpdate(req.params.uid, req.body, {
    new: true,
  });
  resp.status(200).json(updatedUser);
};
const deleteUserById = async (req, resp, next) => {
  const deletedUser = await User.findByIdAndDelete(req.params.uid);
  resp.status(200).json(deletedUser);
};

module.exports = {
  getUsers,
  singUp,
  getUserById,
  updateUserById,
  deleteUserById,
};
