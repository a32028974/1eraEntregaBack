const express = require('express');
const CartManager = require('../managers/CartManager');

const router = express.Router();
const cartManager = new CartManager('./src/data/carts.json');

// Crear carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(req.params.cid);
  if (cart) res.json(cart);
  else res.status(404).json({ error: 'Carrito no encontrado' });
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const result = await cartManager.addProductToCart(req.params.cid, req.params.pid);
  if (result) res.json(result);
  else res.status(404).json({ error: 'No se pudo agregar el producto' });
});

module.exports = router;
