// import { Schema, model } from 'mongoose';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
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

// const productSchema = new Schema({
//   name: String,
//   price: Number,
//   image: String,
//   type: String,
// },
// { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

// export default model('Product', productSchema);
