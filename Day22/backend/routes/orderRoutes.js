import express from 'express';
import { placeOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/my', getMyOrders);
router.get('/', authorize('admin', 'superadmin'), getAllOrders);
router.put('/:id/status', authorize('admin', 'superadmin'), updateOrderStatus);

export default router;
