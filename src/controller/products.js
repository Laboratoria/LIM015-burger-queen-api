const Product = require('../models/products');
const { isValidateObjectId, pagination } = require('../utils/utils');

const createProduct = async (req, res) => {
  const {
    name, price, image, type,
  } = req.body;

  if (!name || !price || typeof price !== 'number') {
    // return next(400);
    return res.status(400).json('indicar nombre o precio');
  }

  const newProduct = new Product({
    name, price, image, type,
  });

  const productSave = await newProduct.save();
  // productSave.then((e) => res.json(e));
  res.status(200).json(productSave);
};

const getProduct = async (req, res) => {
  const url = `${req.protocol}://${req.get('host') + req.path}`; // http://localhost:8080/products
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const products = await Product.paginate({}, { limit, page });
  const links = pagination(products, url, products.limit, products.page, products.totalPages);

  res.links(links);
  return res.status(200).json(products.docs);
};

const getProductById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (isValidateObjectId(req.params.productId)) {
    /* validar que el producto exista */
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json('product id not found in database');
    return res.status(200).json(product);
  }
  return res.status(404).json('Ingrese id valido');
};

const updateProductById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.productId)) return res.status(404).json('Ingrese id valido');

  /* validar que el producto exista */
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json('product id not found in database');

  /* validar que se indique propiedad a modificar */

  if ((Object.keys(req.body).length === 0) || req.body.name === '' || req.body.price === '' || req.body.image === '' || req.body.type === '' || typeof req.body.price !== 'number') return res.status(400).json('indica dato a modificar');

  const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body,
    { new: true });
  res.status(200).json(updateProduct);
};

const deleteProductById = async (req, res) => {
  /* Validar que el id tenga la estructura correcta */
  if (!isValidateObjectId(req.params.productId)) return res.status(404).json('Ingrese id valido');

  /* validar que el producto exista */
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json('product id not found in database');

  await Product.findByIdAndDelete(req.params.productId);
  res.status(200).json(product);
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
