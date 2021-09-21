const { authenthicateUser } = require('../controller/auth');

/** @module auth */
module.exports = (app, nextMain) => {
  /**
   * @name /auth
   * @description Crea token de autenticación.
   * @path {POST} /auth
   * @body {String} email Correo
   * @body {String} password Contraseña
   * @response {Object} resp
   * @response {String} resp.token Token a usar para los requests sucesivos
   * @code {200} si la autenticación es correcta
   * @code {400} si no se proveen `email` o `password` o ninguno de los dos
   * @auth No requiere autenticación
   */

  // app.post('/auth', (req, resp, next) => {
  //   const { email, password } = req.body;

  //   if (!email || !password) {
  //     return next(400);
  // return res.status(400).json('Ingrese password y/o contraseña');
  //   }

  //   // TODO: autenticar a la usuarix
  //   next();
  // });

  app.post('/auth', authenthicateUser);

  return nextMain();
};
