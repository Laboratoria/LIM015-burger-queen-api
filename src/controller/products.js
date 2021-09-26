const Product = require('../models/Products');
const { verifyId } = require('../utils/utils');

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
  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;
  const allProducts = await Product.paginate({}, { limit, page });
  const linkHeader = {
    first: `http://localhost:8080/products?limit=${limit}&page=1`,
    prev: allProducts.hasPrevPage ? `http://localhost:8080/products?limit=${limit}&page=${page - 1}` : false,
    next: allProducts.hasNextPage ? `http://localhost:8080/products?limit=${limit}&page=${page + 1}` : false,
    last: allProducts.totalPages ? `http://localhost:8080/products?limit=${limit}&page=${allProducts.totalPages}` : false,
  };
  // resp.status(200).json(linkHeader);
  resp.status(200).json(allProducts);
};

const getProductById = async (req, resp) => {
  const validation = verifyId(req.params.productId);
  if (validation === true) {
    const product = await Product.findById(req.params.productId);
    if (product === null) {
      resp.status(404).json({ message: 'The product doesn´t exist' });
    }
    resp.status(200).json(product);
  } else {
    resp.status(404).json({ message: 'Id format is invalid' });
  }
};

const updateProductById = async (req, resp) => {
  const validation = verifyId(req.params.productId);
  if (validation === true) {
    if ((Object.keys(req.body).length === 0) || req.body.name === '' || req.body.price === '' || req.body.image === '' || req.body.type === '') {
      resp.status(400).json({ message: 'You didn´t enter property to modify' });
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.productId, req.body, {
      new: true,
    });
    if (updatedProduct === null) {
      resp.status(404).json({ message: 'The product doesn´t exist' });
    }
    resp.status(200).json(updatedProduct);
  } else {
    resp.status(404).json({ message: 'Id format is invalid' });
  }
};

const deleteProductById = async (req, resp) => {
  const validation = verifyId(req.params.productId);
  if (validation === true) {
    const deletedProduct = await Product.findByIdAndDelete(req.params.productId);
    if (deletedProduct === null) {
      resp.status(404).json({ message: 'The product doesn´t exist' });
    }
    resp.status(200).json(deletedProduct);
  } else {
    resp.status(404).json({ message: 'Id format is invalid' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
};
