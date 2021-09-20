const jwt = require('jsonwebtoken');
const { secret } = require('../config');
const User = require('../models/Users');
const Role = require('../models/Roles');
// module.exports = (secret) => (req, resp, next) => {
//   const { authorization } = req.headers;

//   if (!authorization) {
//     return next();
//   }

//   const [type, token] = authorization.split(' ');

//   if (type.toLowerCase() !== 'bearer') {
//     return next();
//   }

//   jwt.verify(token, secret, (err, decodedToken) => {
//     if (err) {
//       return next(403);
//     }

//     // TODO: Verificar identidad del usuario usando `decodeToken.uid`
//   });
// };

// module.exports.isAuthenticated = (req) => (
//   // TODO: decidir por la informacion del request si la usuaria esta autenticada
//   false
// );

// module.exports.isAdmin = (req) => (
//   // TODO: decidir por la informacion del request si la usuaria es admin
//   false
// );

// module.exports.requireAuth = (req, resp, next) => (
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : next()
// );

// module.exports.requireAdmin = (req, resp, next) => (
//   // eslint-disable-next-line no-nested-ternary
//   (!module.exports.isAuthenticated(req))
//     ? next(401)
//     : (!module.exports.isAdmin(req))
//       ? next(403)
//       : next()
// );

const authorization = async (req, resp, next) => {
  try {
    const { token } = req.headers;
    // validar que eltoken sea válido
    if (!token) {
      resp.status(403).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id;
    // const user = await User.findById(req.userId);
    // console.log(user);
    // if (!user) {
    //   resp.status(404).json({ message: 'no user found' });
    // }
    next();
  } catch (error) {
    resp.status(401).json({ mesagge: 'invalid token' });
  }
};

const isAdmin = async (req, resp, next) => {
  const user = await User.findById(req.userId);
  const roles = await Role.find({ _id: { $in: user.roles } });
  roles.forEach((role) => {
    if (role.name === 'admin') {
      next();
    } else {
      resp.status(403).json({ message: 'you need the admin role' });
    }
  });
};

module.exports = { authorization, isAdmin };
