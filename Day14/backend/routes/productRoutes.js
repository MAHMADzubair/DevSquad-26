import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, authorize('admin', 'superadmin'), upload.array('images', 5), createProduct);
router.put('/:id', protect, authorize('admin', 'superadmin'), upload.array('images', 5), updateProduct);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteProduct);

export default router;
