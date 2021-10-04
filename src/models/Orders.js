const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

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
    required: false,
    default: Date.now,
  },
}, {
  versionKey: false,
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Order', orderSchema);
