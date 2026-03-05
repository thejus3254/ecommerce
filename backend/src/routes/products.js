const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.post('/', authMiddleware, adminAuth, productController.createProduct);
router.put('/:id', authMiddleware, adminAuth, productController.updateProduct);
router.delete('/:id', authMiddleware, adminAuth, productController.deleteProduct);

module.exports = router;
