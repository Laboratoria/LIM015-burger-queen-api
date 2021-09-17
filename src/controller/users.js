const User = require('../models/users');
const Role = require('../models/roles');
const { isValidEmail, isValidPassword } = require('../utils/utils');

const createUser = async (req, res) => {
  const { email, password, roles } = req.body;

  /* validar que ingrese usuario y/o contraseña */
  if (!email || !password) return res.status(400).json('Ingrese password y/o contraseña');

  /* validar que el email y contraseña cumplan con lo requerido */
  if (!isValidEmail(email) || !isValidPassword(password)) return res.status(400).json('Ingrese email y/o password validos');

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

  // metodo que genera un token
  // const token = jwt.sign({ id: savedUser._id }, secret, { expiresIn: 86400 });
  // res.status(200).json({ token });
};

const getUsers = async (req, resp) => {
  const products = await User.find();
  resp.json(products);
};

const getUserById = async (req, resp) => {
  // console.log(await User.findById(req.params));
  const user = await User.findById(req.params.uid);
  resp.status(200).json(user);
};

const updateUserById = async (req, resp) => {
  const updateUSer = await User.findByIdAndUpdate(req.params.uid, req.body,
    { new: true });
  resp.status(200).json(updateUSer);
};

const deleteUserById = async (req, res) => {
  await User.findByIdAndDelete(req.params.uid);
  res.status(204).json();
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
