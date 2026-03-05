const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/', authMiddleware, orderController.createOrder);
router.get('/myorders', authMiddleware, orderController.getUserOrders);
router.get('/all', authMiddleware, adminAuth, orderController.getAllOrders);
router.put('/:id/status', authMiddleware, adminAuth, orderController.updateOrderStatus);

module.exports = router;
