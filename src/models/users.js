const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

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
      // required: true,
    },
  },
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// eslint-disable-next-line max-len
userSchema.statics.comparePassword = async (password, receivedPassword) => bcrypt.compare(password, receivedPassword);

module.exports = model('User', userSchema);
