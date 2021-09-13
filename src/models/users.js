const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  roles: {
    admin: {
      type: Boolean,
      required: true,
    },
  },
});

model.export = model('User', userSchema);
