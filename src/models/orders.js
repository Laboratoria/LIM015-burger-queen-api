const { Schema, model } = require('mongoose');
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
  product: [{
    quantity: {
      type: Number,
      required: true,
    },
    productId: {
      ref: 'Product',
      type: Schema.Types.ObjectId,
      required: true,
    },
  }],
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
  },
  // dateProcessed: {
  //   type: Date,
  //   required: true,
  // },
},
{
  timestamps: true,
  versionKey: false,
});

orderSchema.plugin(mongoosePaginate);

module.exports = model('Order', orderSchema);
