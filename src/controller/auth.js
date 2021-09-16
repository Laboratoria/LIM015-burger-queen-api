const jwt = require('jsonwebtoken');
// const bcrypt = require('bcrypt');
const config = require('../config');
const User = require('../models/users');
const Role = require('../models/roles');

const { secret } = config;

/* ****** Crear una cuenta ****** */

const signUp = async (req, res) => {
  const { email, password, roles } = req.body;

  const newUser = new User({
    email,
    password: await User.encryptPassword(password),
  });

  /* asignar roles al crear la cuenta */
  if (roles) {
    const foundRoles = await Role.find({ name: { $in: roles } });
    newUser.roles = foundRoles.map((role) => role._id);
  } else {
    const role = await Role.findOne({ name: 'user' });
    newUser.roles = [role._id];
  }

  const savedUser = await newUser.save();
  res.status(200).json(savedUser);
  console.log(savedUser);

  // metodo que genera un token
  // const token = jwt.sign({ id: savedUser._id }, secret, { expiresIn: 86400 });
  // res.status(200).json({ token });
};

/* ****** Iniciar sesion ****** */

const signIn = async (req, res) => {
  const { email, password } = req.body;

  /* Validar si el usuario existe */
  const userFound = await User.findOne({ email }).populate('roles');
  if (!userFound) return res.status(400).json('user not found');

  /* Validar si el pass coincide */
  const matchPassword = await User.comparePassword(password, userFound.password);
  if (!matchPassword) return res.status(401).json({ token: null, message: 'Invalid Password' });

  /* Devuelve el token del usuario registrado */
  const token = jwt.sign({ id: userFound._id }, secret, { expiresIn: 86400 });
  res.json({ token });

  // console.log(userFound);
};

/* ****** Autenticar Usuario ****** */

const authenthicateUser = async (req, res) => {
  const { email, password } = req.body;

  /* validar que ingrese usuario y/o contraseña */
  if (!email || !password) return res.status(400).json('Ingrese password y/o contraseña');

  /* validar si el usuario existe */
  const userFound = await User.findOne({ email });
  if (!userFound) return res.status(400).json('user not found');

  /* Validar si el pass coincide */
  const matchPassword = await User.comparePassword(password, userFound.password);
  if (!matchPassword) return res.status(400).json({ token: null, message: 'Invalid Password' });

  /* Devuelve el token del usuario autenticado correctamente */
  const token = jwt.sign({ id: userFound._id }, secret, { expiresIn: 86400 });
  res.status(200).json({ token });
};

module.exports = { signIn, signUp, authenthicateUser };
