const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/users');

const { secret } = config;

const signUp = async (req, res) => {
  const { email, password } = req.body;

  const newUser = new User({
    email,
    password: await User.encryptPassword(password),
  });
  const savedUser = await newUser.save();
  // res.json(savedUser);

  // guardar el token
  const token = jwt.sign({ id: savedUser._id }, secret, { expiresIn: 86400 });
  res.status(200).json({ token });
};

const signIn = async (req, res) => {
  res.json('singIn');
};

module.exports = { signIn, signUp };
