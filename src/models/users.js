const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
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
  roles: [{
    ref: 'Role',
    type: Schema.Types.ObjectId,
  }],
},
{
  timestamps: true,
  versionKey: false,
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// eslint-disable-next-line max-len
userSchema.statics.comparePassword = async (password, receivedPassword) => bcrypt.compare(password, receivedPassword);

userSchema.plugin(mongoosePaginate);
module.exports = model('User', userSchema);
