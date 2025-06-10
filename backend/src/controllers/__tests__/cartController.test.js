const CartController = require('../cartController');
const db = require('../../config/database');

// Mock database
jest.mock('../../config/database', () => ({
    query: jest.fn()
}));

describe('CartController', () => {
    let mockReq;
    let mockRes;

    beforeEach(() => {
        mockReq = {
            user: { id: 1 },
            params: {},
            body: {}
        };
        mockRes = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getCart', () => {
        test('should return cart items successfully', async () => {
            const mockCartItems = [
                {
                    id: 1,
                    product_id: 1,
                    quantity: 2,
                    product_name: 'Test Product',
                    price: 10.99,
                    image_url: 'test.jpg'
                }
            ];

            db.query.mockResolvedValueOnce([mockCartItems]);

            await CartController.getCart(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith({ items: mockCartItems });
        });

        test('should handle database error', async () => {
            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);

            await CartController.getCart(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error fetching cart items'
            });
        });
    });

    describe('addToCart', () => {
        test('should add item to cart successfully', async () => {
            mockReq.body = {
                product_id: 1,
                quantity: 2
            };

            // Mock product check
            db.query.mockResolvedValueOnce([[{ id: 1, stock_quantity: 10 }]]);
            // Mock existing items check
            db.query.mockResolvedValueOnce([[]]);
            // Mock insert
            db.query.mockResolvedValueOnce([{ insertId: 1 }]);
            // Mock get new item
            db.query.mockResolvedValueOnce([[{ id: 1, product_id: 1, quantity: 2 }]]);

            await CartController.addToCart(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.body.product_id]
            );
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ id: 1, product_id: 1, quantity: 2 });
        });

        test('should handle invalid input', async () => {
            mockReq.body = {};

            await CartController.addToCart(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Product ID and quantity are required'
            });
        });
    });

    describe('updateCartItem', () => {
        test('should update cart item successfully', async () => {
            mockReq.params = { id: 1 };
            mockReq.body = { quantity: 3 };

            // Mock cart item check
            db.query.mockResolvedValueOnce([[{ id: 1, product_id: 1, stock_quantity: 10 }]]);
            // Mock update
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
            // Mock get updated item
            db.query.mockResolvedValueOnce([[{ id: 1, product_id: 1, quantity: 3 }]]);

            await CartController.updateCartItem(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.params.id, mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith({ id: 1, product_id: 1, quantity: 3 });
        });

        test('should handle item not found', async () => {
            mockReq.params = { id: 999 };
            mockReq.body = { quantity: 3 };

            db.query.mockResolvedValueOnce([[]]);

            await CartController.updateCartItem(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Cart item not found'
            });
        });
    });

    describe('removeFromCart', () => {
        test('should remove item from cart successfully', async () => {
            mockReq.params = { id: 1 };

            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

            await CartController.removeFromCart(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM cart_items'),
                [mockReq.params.id, mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Item removed from cart'
            });
        });

        test('should handle item not found', async () => {
            mockReq.params = { id: 999 };

            db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

            await CartController.removeFromCart(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Cart item not found'
            });
        });
    });

    describe('clearCart', () => {
        test('should clear cart successfully', async () => {
            db.query.mockResolvedValueOnce([{ affectedRows: 2 }]);

            await CartController.clearCart(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('DELETE FROM cart_items'),
                [mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Cart cleared successfully'
            });
        });

        test('should handle empty cart', async () => {
            db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

            await CartController.clearCart(mockReq, mockRes);

            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Cart cleared successfully'
            });
        });
    });

    describe('Cart Calculations', () => {
        test('should calculate cart totals correctly', async () => {
            const mockCartItems = [
                {
                    id: 1,
                    product_id: 1,
                    quantity: 2,
                    product_name: 'Product 1',
                    price: 10.99,
                    image_url: 'test1.jpg'
                },
                {
                    id: 2,
                    product_id: 2,
                    quantity: 1,
                    product_name: 'Product 2',
                    price: 20.99,
                    image_url: 'test2.jpg'
                }
            ];

            db.query.mockResolvedValueOnce([mockCartItems]);

            await CartController.getCart(mockReq, mockRes);

            const response = mockRes.json.mock.calls[0][0];
            const items = response.items;

            // Calculate expected values
            const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const tax = subtotal * 0.10; // 10% tax rate
            const shipping = 15; // Flat rate shipping
            const total = subtotal + tax + shipping;

            expect(response).toHaveProperty('subtotal', subtotal);
            expect(response).toHaveProperty('tax', tax);
            expect(response).toHaveProperty('shipping', shipping);
            expect(response).toHaveProperty('total', total);
        });

        test('should handle empty cart calculations', async () => {
            db.query.mockResolvedValueOnce([[]]);

            await CartController.getCart(mockReq, mockRes);

            const response = mockRes.json.mock.calls[0][0];

            expect(response).toHaveProperty('subtotal', 0);
            expect(response).toHaveProperty('tax', 0);
            expect(response).toHaveProperty('shipping', 15); // Shipping still applies
            expect(response).toHaveProperty('total', 15); // Just shipping cost
        });

        test('should round calculations to 2 decimal places', async () => {
            const mockCartItems = [
                {
                    id: 1,
                    product_id: 1,
                    quantity: 3,
                    product_name: 'Product 1',
                    price: 10.333,
                    image_url: 'test1.jpg'
                }
            ];

            db.query.mockResolvedValueOnce([mockCartItems]);

            await CartController.getCart(mockReq, mockRes);

            const response = mockRes.json.mock.calls[0][0];

            // Verify all monetary values are rounded to 2 decimal places
            expect(response.subtotal).toBe(31.00); // 10.333 * 3 = 30.999 rounded to 31.00
            expect(response.tax).toBe(3.10); // 31.00 * 0.10 = 3.10
            expect(response.shipping).toBe(15.00);
            expect(response.total).toBe(49.10); // 31.00 + 3.10 + 15.00
        });
    });
});
