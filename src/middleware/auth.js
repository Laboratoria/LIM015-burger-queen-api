const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Role = require('../models/roles');

module.exports = (secret) => (req, resp, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return next();
    // return resp.status(401).json('no se ingreso cabecera');
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  jwt.verify(token, secret, (err, decodedToken) => {
    if (err) {
      return next(403);
    }

    // TODO: Verificar identidad del usuario usando `decodeToken.uid`
    const userFind = User.findById(decodedToken.id);
    userFind.then((doc) => {
      if (!doc) return resp.json('usuario no encontrado');
      req.authToken = decodedToken;
      return next();
    }).catch(() => next(403));
  });
};

module.exports.isAuthenticated = (req) => {
  // TODO: decidir por la informacion del request si la usuaria esta autenticada
  // console.log(req.authToken);
  if (req.authToken) return true;
  return false;
};

module.exports.isAdmin = async (req) => {
  const user = await User.findById(req.authToken.id);
  const roles = await Role.find({ _id: { $in: user.roles } });
  const nameRoles = roles.map((el) => el.name);
  return nameRoles.includes('admin');

  /* [
  { _id: new ObjectId("61426843502652acad3049e8"), name: 'user' },
  { _id: new ObjectId("61426843502652acad3049ea"), name: 'admin' }
] */
};

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => {
  if (!module.exports.isAuthenticated(req)) {
    return next(401);
  } (module.exports.isAdmin(req)).then((res) => {
    if (!res) {
      return resp.status(403).json({ message: 'Requiere rol de administrador' });
    }
    return next();
  });
};
