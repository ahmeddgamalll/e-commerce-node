const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all cart routes
router.use(auth);

// Cart routes
router.get('/', CartController.getCart);
router.post('/', CartController.addToCart);
router.put('/:id', CartController.updateCartItem);
router.delete('/:id', CartController.removeFromCart);
router.delete('/', CartController.clearCart);

module.exports = router;
