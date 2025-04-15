const express = require('express');
const router = express.Router();
const ProductManager = require('../managers/ProductManager');

const productManager = new ProductManager('./src/data/products.json');

router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(req.params.pid);
  if (product) res.json(product);
  else res.status(404).json({ error: 'Producto no encontrado' });
});

router.post('/', async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const updated = await productManager.updateProduct(req.params.pid, req.body);
  res.json(updated);
});

router.delete('/:pid', async (req, res) => {
  const result = await productManager.deleteProduct(req.params.pid);
  res.json(result);
});

module.exports = router;
