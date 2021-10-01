const User = require('../models/users');
const Role = require('../models/roles');
const { isAdmin } = require('../middleware/auth');
const {
  isValidEmail, isValidPassword, idUserOrEmail, pagination,
} = require('../utils/utils');

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
  return res.status(200).json(savedUser);
};

const getUsers = async (req, resp) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const users = await User.paginate({}, { limit, page });
  const url = `${req.protocol}://${req.get('host') + req.path}`;
  const links = pagination(users, url, users.limit, users.page, users.totalPages);

  resp.links(links);
  return resp.json(users.docs);
};

const getUserById = async (req, resp) => {
  const { uid } = req.params;
  const validar = idUserOrEmail(uid);
  const user = await User.findOne(validar);

  /* Validar que el id tenga la estructura correcta */
  // if (!isValidateObjectId(req.params.uid)) return resp.status(404).json('Ingrese id valido');

  /* Valida si el id existe */
  if (!user) return resp.status(404).json('user not found in database');

  /* validar que sea la misma usuaria y/o admin */
  if ((req.authToken.id === user._id.toString()) || (await isAdmin(req))) {
    return resp.status(200).json(user);
  }
  return resp.status(403).json('No tiene el rol de admin o no es su usuario a buscar');
};

const updateUserById = async (req, resp) => {
  const { uid } = req.params;
  const validar = idUserOrEmail(uid);
  const userFind = await User.findOne(validar);
  /* Validar que el id tenga la estructura correcta */
  // if (!isValidateObjectId(req.params.uid)) return resp.status(404).json('Ingrese id valido');

  /* validar que el usuario exista */
  // const user = await User.findById(req.params.uid);
  if (!userFind) return resp.status(404).json('user not found in database');

  if (req.authToken.id !== userFind._id.toString() && !await isAdmin(req)) {
    return resp.status(403).json('No tiene el rol de admin o no es su usuario a actualizar');
  }

  /* validar que se indique propiedad a modificar */
  if ((Object.keys(req.body).length === 0) || req.body.email === '' || req.body.password === '') return resp.status(400).json('indicar email y/o password a actualizar');

  /* usuario no puede modificar sus roles. */
  if (!await isAdmin(req) && req.body.roles) return resp.status(403).json('no puede modificar sus roles');
  /* encriptar password actualizado y devolver los datos actualizados. */
  if (req.body.password) {
    const passEncryp = await User.encryptPassword(req.body.password);
    req.body.password = passEncryp;
  }
  const updateUSer = await User.findByIdAndUpdate(userFind._id, req.body,
    { new: true });
  return resp.status(200).json(updateUSer);
};

const deleteUserById = async (req, res) => {
  const { uid } = req.params;
  const validar = idUserOrEmail(uid);
  const userFound = await User.findOne(validar);
  /* Validar que el id tenga la estructura correcta */
  // if (!isValidateObjectId(req.params.uid)) return res.status(404).json('Ingrese id valido');

  /* validar que el usuario exista */
  // const user = await User.findById(req.params.uid);
  if (!userFound) return res.status(404).json('user id not found in database');
  /* validar que sea la misma usuaria y/o admin */
  if ((req.authToken.id === userFound._id.toString()) || (await isAdmin(req))) {
    // const userDeleted = await User.findByIdAndDelete(req.params.uid);
    const userDeleted = await User.findByIdAndDelete(userFound._id);
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
