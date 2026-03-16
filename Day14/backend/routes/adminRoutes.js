import express from 'express';
import { getAnalytics, listUsers, blockUser, unblockUser, updateUserRole, getCustomers, addCustomer } from '../controllers/adminController.js';
import { getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

// Superadmin-only
router.get('/analytics', authorize('superadmin'), getAnalytics);
router.get('/users', authorize('superadmin'), listUsers);
router.put('/users/:id/block', authorize('superadmin'), blockUser);
router.put('/users/:id/unblock', authorize('superadmin'), unblockUser);
router.put('/users/:id/role', authorize('superadmin'), updateUserRole);
router.get('/customers', authorize('superadmin'), getCustomers);
router.post('/customers', authorize('superadmin'), addCustomer);

// Admin + superadmin
router.get('/orders', authorize('admin', 'superadmin'), getAllOrders);
router.put('/orders/:id/status', authorize('admin', 'superadmin'), updateOrderStatus);
router.get('/products', authorize('admin', 'superadmin'), getProducts);
router.post('/products', authorize('admin', 'superadmin'), upload.array('images', 5), createProduct);
router.put('/products/:id', authorize('admin', 'superadmin'), upload.array('images', 5), updateProduct);
router.delete('/products/:id', authorize('admin', 'superadmin'), deleteProduct);

export default router;
