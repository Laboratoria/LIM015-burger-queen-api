const Product = require('../models/products');

const createProduct = async (req, res) => {
  const {
    name, price, image, type,
  } = req.body;
  const newProduct = new Product({
    name, price, image, type,
  });

  const productSave = await newProduct.save();
  // productSave.then((e) => res.json(e));
  res.status(201).json(productSave);
  // console.log(productSave);
  // res.json(req.body);
};

const getProduct = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return res.status(404).json('product id not found in database');
  return res.status(200).json(product);
};

const updateProductById = async (req, res) => {
  const updateProduct = await Product.findByIdAndUpdate(req.params.productId, req.body,
    { new: true });
  res.status(200).json(updateProduct);
};

const deleteProductById = async (req, res) => {
  await Product.findByIdAndDelete(req.params.productId);
  res.status(204).json();
};

module.exports = {
  createProduct,
  getProduct,
  getProductById,
  updateProductById,
  deleteProductById,
};
