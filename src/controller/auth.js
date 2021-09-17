const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/users');

const { secret } = config;

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
  return res.status(200).json({ token });
};

module.exports = { authenthicateUser };
