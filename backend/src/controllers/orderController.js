const db = require('../config/database');
const Joi = require('joi');

// Validation schema for order creation
const createOrderSchema = Joi.object({
    items: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().positive().required(),
            quantity: Joi.number().integer().min(1).required(),
            price: Joi.number().min(0).required()
        })
    ).min(1).required()
});

class OrderController {
    // Create a new order
    static async createOrder(req, res) {
        let connection;
        try {
            const { items: orderItems } = req.body;

            if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
                return res.status(400).json({ message: 'No items provided' });
            }

            // Get a connection from the pool
            connection = await db.getConnection();

            // Start transaction
            await connection.beginTransaction();

            try {
                let subtotal = 0;
                let processedItems = [];

                // Calculate subtotal and validate products
                for (const item of orderItems) {
                    const [product] = await connection.query(
                        'SELECT price, stock_quantity FROM products WHERE id = ?',
                        [item.product_id]
                    );

                    if (product.length === 0) {
                        throw new Error(`Product ${item.product_id} not found`);
                    }

                    if (product[0].stock_quantity < item.quantity) {
                        throw new Error(`Not enough stock for product ${item.product_id}`);
                    }

                    const itemSubtotal = product[0].price * item.quantity;
                    subtotal += itemSubtotal;

                    processedItems.push({
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: product[0].price,
                        subtotal: itemSubtotal
                    });
                }

                // Calculate tax and shipping
                const tax = subtotal * 0.1; // 10% tax
                const shipping = subtotal > 100 ? 0 : 10; // Free shipping over $100
                const total = subtotal + tax + shipping;

                // Create order
                const [orderResult] = await connection.query(
                    'INSERT INTO orders (user_id, status, subtotal, tax, shipping, total) VALUES (?, ?, ?, ?, ?, ?)',
                    [req.user.id, 'pending', subtotal, tax, shipping, total]
                );

                const orderId = orderResult.insertId;

                // Add order items
                for (const item of processedItems) {
                    await connection.query(
                        'INSERT INTO order_items (order_id, product_id, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                        [orderId, item.product_id, item.quantity, item.price, item.subtotal]
                    );

                    // Update product stock
                    await connection.query(
                        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
                        [item.quantity, item.product_id]
                    );
                }

                // Clear user's cart
                await connection.query(
                    'DELETE FROM cart_items WHERE user_id = ?',
                    [req.user.id]
                );

                await connection.commit();

                // Get the created order with items
                const [orders] = await connection.query(
                    'SELECT * FROM orders WHERE id = ?',
                    [orderId]
                );

                const order = orders[0];
                const [orderItemsResult] = await connection.query(
                    `SELECT oi.*, p.name as product_name, p.image_url as product_image
                     FROM order_items oi
                     JOIN products p ON oi.product_id = p.id
                     WHERE oi.order_id = ?`,
                    [orderId]
                );
                order.items = orderItemsResult;

                res.status(201).json({
                    message: 'Order created successfully',
                    order
                });
            } catch (error) {
                await connection.rollback();
                throw error;
            } finally {
                if (connection) {
                    connection.release();
                }
            }
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({
                message: 'Error creating order',
                error: error.message
            });
        }
    }

    // Get all orders for the current user
    static async getOrders(req, res) {
        try {
            const [orders] = await db.query(
                'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
                [req.user.id]
            );

            // Get order items for each order
            for (let order of orders) {
                const [items] = await db.query(
                    `SELECT oi.*, p.name as product_name, p.image_url as product_image
                     FROM order_items oi
                     JOIN products p ON oi.product_id = p.id
                     WHERE oi.order_id = ?`,
                    [order.id]
                );
                order.items = items;
            }

            res.json(orders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Error fetching orders' });
        }
    }

    // Get a specific order
    static async getOrderById(req, res) {
        try {
            const [orders] = await db.query(
                'SELECT * FROM orders WHERE id = ? AND user_id = ?',
                [req.params.id, req.user.id]
            );

            if (orders.length === 0) {
                return res.status(404).json({ message: 'Order not found' });
            }

            const order = orders[0];
            const [items] = await db.query(
                `SELECT oi.*, p.name as product_name, p.image_url as product_image
                 FROM order_items oi
                 JOIN products p ON oi.product_id = p.id
                 WHERE oi.order_id = ?`,
                [order.id]
            );
            order.items = items;

            res.json(order);
        } catch (error) {
            console.error('Error fetching order:', error);
            res.status(500).json({ message: 'Error fetching order' });
        }
    }
}

module.exports = OrderController;
