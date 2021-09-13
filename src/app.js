const express = require('express');

const config = require('./config');

const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/error');

const routes = require('./routes');

const pkg = require('../package.json');

const { secret } = config;
const app = express();

// configuraciones iniciales
app.set('config', config);
app.set('pkg', pkg);

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(authMiddleware(secret));
app.use(errorHandler);

// Registrar rutas
routes(app, (err) => {
  if (err) {
    throw err;
  }
});

module.exports = app;
