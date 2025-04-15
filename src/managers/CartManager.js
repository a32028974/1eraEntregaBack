const fs = require('fs').promises;
const path = require('path');

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Obtener todos los carritos
  async getCarts() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  // Obtener carrito por ID con los productos completos
  async getCartById(id) {
    const carts = await this.getCarts();
    const cart = carts.find(cart => cart.id === id);
    if (!cart) return null;

    // Leemos todos los productos desde products.json
    const productsData = await fs.readFile(path.resolve('src/data/products.json'), 'utf-8');
    const allProducts = JSON.parse(productsData);

    // Reemplazamos el ID del producto por el objeto completo
    const fullCart = {
      ...cart,
      products: cart.products.map(item => {
        const productInfo = allProducts.find(p => p.id === item.product);
        return {
          product: productInfo || { id: item.product, error: 'Producto no encontrado' },
          quantity: item.quantity
        };
      })
    };

    return fullCart;
  }

  // Crear un nuevo carrito
  async createCart() {
    const carts = await this.getCarts();
    const newCart = {
      id: Date.now().toString(),
      products: []
    };
    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  // Agregar un producto al carrito
  async addProductToCart(cartId, productId) {
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === cartId);
    if (!cart) return null;

    const existingProduct = cart.products.find(p => p.product === productId);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return cart;
  }
}

module.exports = CartManager;
