const jwt = require('jsonwebtoken');
const User = require('../models/Users');
const { secret } = require('../config');

const auth = async (req, resp) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return resp.status(400).json('You didn´t enter email or password');
  }

  const userFound = await User.findOne({ email: req.body.email });
  // const passwordFpound = await User.findOne({password: req.body.password});

  if (!userFound) {
    return resp.status(400).json('user not found');
  }
  const matchPassword = await User.comparePassword(req.body.password, userFound.password);
  if (!matchPassword) {
    return resp.status(401).json({ token: null, message: 'Invalid password' });
  }
  const token = jwt.sign({ id: userFound._id }, secret, { expiresIn: 86400 });
  resp.status(200).json({ token });
};

module.exports = { auth };
