const Orders = require('../models/orders');
const { isValidateObjectId, pagination } = require('../utils/utils');

const createOrder = async (req, res) => {
  const { userId, client, products } = req.body;

  if (!products || products.length === 0) {
    // return next(400);
    return res.status(400).json('ingresar producto');
  }

  const newOrder = new Orders({
    userId,
    client,
    products: products.map((el) => ({
      qty: el.qty,
      product: el.productId,
    })),
  });

  const orderSave = await newOrder.save();
  const currentOrder = await Orders.findOne({ _id: orderSave._id }).populate('products.product');
  // console.log(currentOrder);
  return res.status(200).json(currentOrder);
};

const getOrders = async (req, res) => {
  const url = `${req.protocol}://${req.get('host') + req.path}`;
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const orders = await Orders.paginate({}, { limit, page });
  const links = pagination(orders, url, orders.limit, orders.page, orders.totalPages);

  res.links(links);

  return res.json(orders.docs);
};

const getOrderById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.orderId)) {
    return res.status(404).json('Ingrese id valido');
  }
  /* validar que el producto exista */
  const order = await Orders.findOne({ _id: req.params.orderId }).populate('products.product');
  if (!order) return res.status(404).json('product id not found in database');
  return res.status(200).json(order);
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
  return res.status(200).json(updateOrder);
};

const deleteOrderById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.orderId)) return res.status(404).json('Ingrese id valido');

  /* validar que el producto exista */
  const order = await Orders.findById(req.params.orderId);
  if (!order) return res.status(404).json('product id not found in database');

  await Orders.findByIdAndDelete(req.params.orderId);
  return res.status(200).json(order);
};

module.exports = {
  createOrder, getOrders, getOrderById, updateOrderById, deleteOrderById,
};
