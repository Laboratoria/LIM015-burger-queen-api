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
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const allUsers = await User.paginate({}, { limit, page });
  const linkHeader = {
    first: `http://localhost:8080/products?limit=${limit}&page=1`,
    prev: allUsers.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${page - 1}` : false,
    next: allUsers.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${page + 1}` : false,
    last: allUsers.totalPages ? `http://localhost:8080/products?limit=${limit}&page=${allUsers.totalPages}` : false,
  };
  // resp.status(200).json(allUsers);
  resp.status(200).json(linkHeader);
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
  // console.log(Object.keys(req.body));
  if ((Object.keys(req.body).length === 0) || req.body.email === '' || req.body.password === '') {
    resp.status(400).json({ message: 'You didn´t enter email or password' });
  } else {
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
