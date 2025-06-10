const db = require('../config/database');
const { validationResult } = require('express-validator');

class CartController {
    // Get cart items
    static async getCart(req, res) {
        try {
            const [items] = await db.query(
                `SELECT ci.*, p.name as product_name, p.price, p.image_url
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.user_id = ?`,
                [req.user.id]
            );
            res.json({ items });
        } catch (error) {
            console.error('Error fetching cart:', error);
            res.status(500).json({ message: 'Error fetching cart items' });
        }
    }

    // Add item to cart
    static async addToCart(req, res) {
        try {
            const { product_id, quantity } = req.body;
            const user_id = req.user.id;

            // Validate input
            if (!product_id || !quantity) {
                return res.status(400).json({ message: 'Product ID and quantity are required' });
            }

            // Check if product exists and has enough stock
            const [products] = await db.query(
                'SELECT * FROM products WHERE id = ?',
                [product_id]
            );

            if (products.length === 0) {
                return res.status(404).json({ message: 'Product not found' });
            }

            const product = products[0];
            if (product.stock_quantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            // Check if item already exists in cart
            const [existingItems] = await db.query(
                'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
                [user_id, product_id]
            );

            if (existingItems.length > 0) {
                // Update quantity if item exists
                const newQuantity = existingItems[0].quantity + quantity;
                if (product.stock_quantity < newQuantity) {
                    return res.status(400).json({ message: 'Not enough stock available' });
                }

                await db.query(
                    'UPDATE cart_items SET quantity = ? WHERE id = ?',
                    [newQuantity, existingItems[0].id]
                );

                const [updatedItem] = await db.query(
                    'SELECT * FROM cart_items WHERE id = ?',
                    [existingItems[0].id]
                );

                return res.json(updatedItem[0]);
            }

            // Add new item to cart
            const [result] = await db.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [user_id, product_id, quantity]
            );

            const [newItem] = await db.query(
                'SELECT * FROM cart_items WHERE id = ?',
                [result.insertId]
            );

            res.status(201).json(newItem[0]);
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json({ message: 'Error adding item to cart' });
        }
    }

    // Update cart item quantity
    static async updateCartItem(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const user_id = req.user.id;

            if (!quantity || quantity < 1) {
                return res.status(400).json({ message: 'Valid quantity is required' });
            }

            // Check if item exists in user's cart
            const [items] = await db.query(
                `SELECT ci.*, p.stock_quantity
                FROM cart_items ci
                JOIN products p ON ci.product_id = p.id
                WHERE ci.id = ? AND ci.user_id = ?`,
                [id, user_id]
            );

            if (items.length === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            const item = items[0];
            if (item.stock_quantity < quantity) {
                return res.status(400).json({ message: 'Not enough stock available' });
            }

            // Update quantity
            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [quantity, id]
            );

            const [updatedItem] = await db.query(
                'SELECT * FROM cart_items WHERE id = ?',
                [id]
            );

            res.json(updatedItem[0]);
        } catch (error) {
            console.error('Error updating cart item:', error);
            res.status(500).json({ message: 'Error updating cart item' });
        }
    }

    // Remove item from cart
    static async removeFromCart(req, res) {
        try {
            const { id } = req.params;
            const user_id = req.user.id;

            const [result] = await db.query(
                'DELETE FROM cart_items WHERE id = ? AND user_id = ?',
                [id, user_id]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Cart item not found' });
            }

            res.json({ message: 'Item removed from cart' });
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json({ message: 'Error removing item from cart' });
        }
    }

    // Clear cart
    static async clearCart(req, res) {
        try {
            const user_id = req.user.id;
            await db.query('DELETE FROM cart_items WHERE user_id = ?', [user_id]);
            res.json({ message: 'Cart cleared successfully' });
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json({ message: 'Error clearing cart' });
        }
    }
}

module.exports = CartController;
