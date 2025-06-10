const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

// Apply auth middleware to all order routes
router.use(auth);

// Order routes
router.get('/', OrderController.getOrders);
router.post('/', OrderController.createOrder);
router.get('/:id', OrderController.getOrderById);

module.exports = router;
