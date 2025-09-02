import { Router } from 'express';
import { getAllOrders, addOrder, editOrder,getOrderById } from '../controllers/orderController.js';
import { authRequired } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

// image upload field name: carImage
router.get('/', authRequired, getAllOrders);
router.get('/getOrder/:orderNumber', getOrderById);
router.post('/', upload.single('carImage'), addOrder);
router.put('/:id', authRequired, upload.single('carImage'), editOrder);

export default router;