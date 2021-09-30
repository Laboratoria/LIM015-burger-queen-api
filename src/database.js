const mongoose = require('mongoose');
const config = require('./config');

const { dbUrl } = config;

// TODO: Conexión a la Base de Datos (MongoDB o MySQL)

// console.log(dbUrl);
const URL = dbUrl;

mongoose.connect(URL);

// const connection = mongoose.connection;
const { connection } = mongoose;

connection.once('open', () => {
  console.info('DB is connected');
});

// mongoose
//   .connect(config.dbUrl, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(console.log)
//   .catch(console.error);
