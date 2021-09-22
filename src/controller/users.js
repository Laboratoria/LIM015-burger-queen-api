const User = require('../models/users');
const Role = require('../models/roles');
const { isAdmin } = require('../middleware/auth');
const { isValidEmail, isValidPassword } = require('../utils/utils');

const createUser = async (req, res) => {
  const { email, password, roles } = req.body;

  /* validar que ingrese usuario y/o contraseña */
  if (!email || !password) return res.status(400).json('Ingrese password y/o contraseña');

  // /* validar que el email y contraseña cumplan con lo requerido */
  if (!isValidEmail(email) || !isValidPassword(password)) return res.status(400).json('Ingrese email y/o password validos');

  /* validar si existe usuaria con ese email */
  const findUser = await User.findOne({ email });
  // console.log(findUser);
  if (findUser) {
    return res.status(403).json({
      message: 'El usuario ya se encuentra registrado',
    });
  }

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
};

const getUsers = async (req, resp) => {
  const products = await User.find();
  resp.json(products);
};

const getUserById = async (req, resp) => {
  /* Valida si el id existe */
  const user = await User.findById(req.params.uid);
  if (!user) return resp.status(404).json('userId not found in database');

  /* validar que sea la misma usuaria y/o admin */
  if ((req.authToken.id === user._id.toString()) || (await isAdmin(req))) return resp.json(user);
  return resp.status(403).json('No tiene el rol de admin o no es su usuario a buscar');
};

const updateUserById = async (req, resp) => {
  /* validar que el usuario exista */
  const user = await User.findById(req.params.uid);
  if (!user) return resp.status(404).json('user id not found in database');

  /* validar que se indique propiedad a modificar */
  if ((Object.keys(req.body).length === 0) || req.body.email === '' || req.body.password === '') return resp.status(400).json('indicar email y/o password a actualizar');

  /* validar que sea la misma usuaria y/o admin */
  if ((req.authToken.id === user._id.toString()) || (await isAdmin(req))) {
    const updateUSer = await User.findByIdAndUpdate(req.params.uid, req.body,
      { new: true });
    resp.status(200).json(updateUSer);
  }

  return resp.status(403).json('No tiene el rol de admin o no es su usuario a actualizar');
};

const deleteUserById = async (req, res) => {
  /* validar que el usuario exista */
  const user = await User.findById(req.params.uid);
  if (!user) return res.status(404).json('user id not found in database');

  /* validar que sea la misma usuaria y/o admin */
  if ((req.authToken.id === user._id.toString()) || (await isAdmin(req))) {
    const userDeleted = await User.findByIdAndDelete(req.params.uid);
    return res.status(200).json(userDeleted);
  }
  return res.status(403).json('No tiene el rol de admin o no es su usuario a eliminar');
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
