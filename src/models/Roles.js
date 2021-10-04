const mongoose = require('mongoose');

const { Schema } = mongoose;

const roleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('Role', roleSchema);
