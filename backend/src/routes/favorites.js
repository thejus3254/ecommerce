const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/auth');

// Note: Ensure authMiddleware guarantees req.user exists before hitting these controllers
router.post('/:id', authMiddleware, favoriteController.addFavorite);
router.delete('/:id', authMiddleware, favoriteController.removeFavorite);
router.get('/myfavorites', authMiddleware, favoriteController.getFavorites);

module.exports = router;
