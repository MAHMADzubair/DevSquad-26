import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// @route GET /api/cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name images price variants');
    if (!cart) return res.json({ success: true, cart: { items: [], total: 0 } });
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, total: parseFloat(total.toFixed(2)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/cart
export const addToCart = async (req, res) => {
  const { productId, variantId, quantity = 1 } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    let price = product.price;
    let variantSize = null;

    if (variantId) {
      const variant = product.variants.id(variantId);
      if (!variant) return res.status(404).json({ success: false, message: 'Variant not found' });
      if (variant.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock for this variant' });
      price = variant.price;
      variantSize = variant.size;
    } else {
      if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) cart = new Cart({ user: req.user._id, items: [] });

    const existingIndex = cart.items.findIndex(i =>
      i.product.toString() === productId && (variantId ? i.variantId?.toString() === variantId : !i.variantId)
    );

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, variantId: variantId || undefined, variantSize, price, quantity });
    }

    await cart.save();
    await cart.populate('items.product', 'name images price variants');
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, total: parseFloat(total.toFixed(2)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/cart/:itemId
export const updateCartItem = async (req, res) => {
  const { quantity } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Cart item not found' });

    // Stock check
    const product = await Product.findById(item.product);
    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (variant.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock' });
    } else {
      if (product.stock < quantity) return res.status(400).json({ success: false, message: 'Not enough stock' });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate('items.product', 'name images price variants');
    const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, total: parseFloat(total.toFixed(2)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route DELETE /api/cart/:itemId
export const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(i => i._id.toString() !== req.params.itemId);
    await cart.save();
    const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    res.json({ success: true, cart: { items: cart.items, total: parseFloat(total.toFixed(2)) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
