const mongoose = require('mongoose');
const config = require('./config');

const { dbUrl } = config;

// TODO: Conexión a la Base de Datos (MongoDB o MySQL)

const URL = dbUrl;

mongoose.connect(URL);

const { connection } = mongoose;

connection.once('open', () => {
  console.info('DB is connected');
});
