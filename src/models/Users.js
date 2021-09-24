const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    unique: true,
    required: true,
  },
  roles: [{
    ref: 'Role',
    type: Schema.Types.ObjectId,
  }],
}, {
  timestamps: true,
  versionKey: false,
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  const comparedPassword = await bcrypt.compare(password, receivedPassword);
  return comparedPassword;
};

userSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', userSchema);
