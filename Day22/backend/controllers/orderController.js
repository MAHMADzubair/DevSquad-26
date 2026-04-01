import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const DELIVERY_FEE = 3.95;

// @route POST /api/orders  — place order from cart
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress } = req.body;
    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.email || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
      return res.status(400).json({ success: false, message: 'Shipping address (fullName, email, address, city, postalCode, country) is required' });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    // Validate stock & build items
    const orderItems = [];
    for (const item of cart.items) {
      const product = item.product;
      if (item.variantId) {
        const variant = product.variants.id(item.variantId);
        if (!variant || variant.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name} (${item.variantSize})` });
        }
        variant.stock -= item.quantity;
      } else {
        if (product.stock < item.quantity) {
          return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
        }
        product.stock -= item.quantity;
      }
      await product.save();
      orderItems.push({
        product: product._id, name: product.name,
        variantSize: item.variantSize || null,
        price: item.price, quantity: item.quantity
      });
    }

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const total = parseFloat((subtotal + DELIVERY_FEE).toFixed(2));

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      subtotal: parseFloat(subtotal.toFixed(2)),
      deliveryFee: DELIVERY_FEE,
      total
    });

    // Clear cart after order
    cart.items = [];
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/orders/my
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/orders  (admin+)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/orders/:id/status  (admin+)
export const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
