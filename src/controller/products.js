const Product = require('../models/Products');

const createProduct = async (req, resp, next) => {
  const {
    name, price, image, type,
  } = req.body;
  const newProduct = new Product({
    name, price, image, type,
  });
  const productSaved = await newProduct.save();
  resp.json(productSaved);
};
const getProducts = async (req, resp, next) => {
  const allProducts = await Product.find();
  resp.json(allProducts);
};
const getProductById = async (req, resp, next) => {
  const product = await Product.findById(req.params.productId);
  resp.status(200).json(product);
};
const updateProductById = async (req, resp, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
  });
  resp.status(200).json(updatedProduct);
};
const deleteProductById = async (req, resp, next) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
  resp.status(200).json(deletedProduct);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
