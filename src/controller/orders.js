const Orders = require('../models/orders');
const { isValidateObjectId } = require('../utils/utils');

const createOrder = async (req, res) => {
  const { client, product } = req.body;

  if (!product) {
    // return next(400);
    return res.status(400).json('ingresar producto');
  }

  const newOrder = new Orders({
    userId: req.authToken.id,
    client,
    product: product.map((product) => ({
      quantity: product.quantity,
      productId: product.productId,
    })),
  });

  const orderSave = await newOrder.save();
  res.status(200).json(orderSave);
};

const getOrders = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const orders = await Orders.paginate({}, { limit, page });

  return res.json(orders);
};

const getOrderById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (isValidateObjectId(req.params.orderId)) {
    /* validar que el producto exista */
    const order = await Orders.findById(req.params.orderId);
    if (!order) return res.status(404).json('product id not found in database');
    return res.status(200).json(order);
  }
  return res.status(404).json('Ingrese id valido');
};

const updateOrderById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.orderId)) return res.status(404).json('Ingrese id valido');

  /* validar que el producto exista */
  const order = await Orders.findById(req.params.orderId);
  if (!order) return res.status(404).json('product id not found in database');

  if ((Object.keys(req.body).length === 0)) return res.status(400).json('indica dato a modificar');

  const statusOrder = [
    'pending',
    'canceled',
    'delivering',
    'delivered',
    'preparing',
  ];
  if (req.body.status && !statusOrder.includes(req.body.status)) return res.status(400).json('No es un estado valido');

  const updateOrder = await Orders.findByIdAndUpdate(req.params.orderId, req.body,
    { new: true });
  res.status(200).json(updateOrder);
};

const deleteOrderById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.orderId)) return res.status(404).json('Ingrese id valido');

  /* validar que el producto exista */
  const order = await Orders.findById(req.params.orderId);
  if (!order) return res.status(404).json('product id not found in database');

  await Orders.findByIdAndDelete(req.params.orderId);
  res.status(200).json(order);
};

module.exports = {
  createOrder, getOrders, getOrderById, updateOrderById, deleteOrderById,
};
