const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    product: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    qty: {
      type: Number,
      required: true,
    },
  }],
  status: {
    type: String,
    required: true,
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  dateProcessed: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Order', orderSchema);
