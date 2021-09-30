// import { Schema, model } from 'mongoose';

const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Product', productSchema);
