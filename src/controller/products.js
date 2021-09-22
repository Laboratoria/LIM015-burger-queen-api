const Product = require('../models/products');

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
  // console.log(productSave);
  // res.json(req.body);
};

const getProduct = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  /* validar que el producto exista */
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json('product id not found in database');

  return res.status(200).json(product);
};

const updateProductById = async (req, res) => {
  /* validar que el producto exista */
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json('product id not found in database');

  /* validar que se indique propiedad a modificar */

  if ((Object.keys(req.body).length === 0) || req.body.name === '' || req.body.price === '' || req.body.image === '' || req.body.type === '') return res.status(400).json('indica dato a modificar');

  const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body,
    { new: true });
  res.status(200).json(updateProduct);
};

const deleteProductById = async (req, res) => {
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
