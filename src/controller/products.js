const Product = require('../models/Products');

const createProduct = async (req, resp) => {
  const {
    name, price, image, type,
  } = req.body;
  const newProduct = new Product({
    name, price, image, type,
  });
  if (!name || !price) {
    resp.status(400).json({ message: 'You didn´t enter name or price' });
  }
  const productSaved = await newProduct.save();
  resp.status(200).json(productSaved);
};
const getProducts = async (req, resp) => {
  const allProducts = await Product.find();
  resp.json(allProducts);
};
const getProductById = async (req, resp) => {
  const product = await Product.findById(req.params.productId);
  if (product === null) {
    resp.status(404).json({ message: 'The product doesn´t exist' });
  }
  resp.status(200).json(product);
};
const updateProductById = async (req, resp) => {
  if (Object.keys(req.body).length === 0) {
    resp.status(400).json({ message: 'You didn´t enter property to modify' });
  }
  const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
    new: true,
  });
  if (updatedProduct === null) {
    resp.status(404).json({ message: 'The product doesn´t exist' });
  }
  resp.status(200).json(updatedProduct);
};
const deleteProductById = async (req, resp) => {
  const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
  if (deletedProduct === null) {
    resp.status(404).json({ message: 'The product doesn´t exist' });
  }
  resp.status(200).json(deletedProduct);
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
