import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

// @route GET /api/admin/analytics  (superadmin)
export const getAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalOrders, revenueAgg, totalProducts] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: '$total' } } }]),
      Product.countDocuments()
    ]);
    const revenue = revenueAgg[0]?.revenue || 0;
    res.json({ success: true, analytics: { totalUsers, totalOrders, revenue: parseFloat(revenue.toFixed(2)), totalProducts } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route GET /api/admin/users  (superadmin)
export const listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments();
    const users = await User.find().skip(skip).limit(Number(limit)).select('-password');
    res.json({ success: true, users, page: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/users/:id/block  (superadmin)
export const blockUser = async (req, res) => {
  try {
    const userToBlock = await User.findById(req.params.id);
    if (!userToBlock) return res.status(404).json({ success: false, message: 'User not found' });
    if (userToBlock.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot block a superadmin' });
    }
    
    userToBlock.isBlocked = true;
    await userToBlock.save();
    res.json({ success: true, user: userToBlock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/users/:id/unblock  (superadmin)
export const unblockUser = async (req, res) => {
  try {
    const userToUnblock = await User.findById(req.params.id);
    if (!userToUnblock) return res.status(404).json({ success: false, message: 'User not found' });
    
    userToUnblock.isBlocked = false;
    await userToUnblock.save();
    res.json({ success: true, user: userToUnblock });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route PUT /api/admin/users/:id/role  (superadmin)
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const userToUpdate = await User.findById(req.params.id);
    if (!userToUpdate) return res.status(404).json({ success: false, message: 'User not found' });

    if (userToUpdate.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Cannot change role of a superadmin' });
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    res.json({ success: true, user: userToUpdate });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
// @route GET /api/admin/customers  (superadmin) - only role=user
export const getCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments({ role: 'user' });
    const customers = await User.find({ role: 'user' })
      .skip(skip).limit(Number(limit)).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, customers, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @route POST /api/admin/customers  (superadmin) - add a customer manually
export const addCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already in use' });
    const customer = await User.create({ name, email, password, role: 'user' });
    res.status(201).json({ success: true, customer: { _id: customer._id, name: customer.name, email: customer.email, role: customer.role, isBlocked: customer.isBlocked, createdAt: customer.createdAt } });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
