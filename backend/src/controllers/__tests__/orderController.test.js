const OrderController = require('../orderController');
const db = require('../../config/database');

// Mock database
jest.mock('../../config/database', () => ({
    getConnection: jest.fn(),
    query: jest.fn()
}));

describe('OrderController', () => {
    let mockReq;
    let mockRes;
    let mockConnection;

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
        mockConnection = {
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn(),
            query: jest.fn()
        };
        db.getConnection.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrders', () => {
        test('should return orders successfully', async () => {
            const mockOrders = [
                {
                    id: 1,
                    user_id: 1,
                    total_amount: 50.99,
                    status: 'pending',
                    created_at: '2024-03-20T10:00:00Z'
                }
            ];

            db.query.mockResolvedValueOnce([mockOrders, []]);

            await OrderController.getOrders(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith(mockOrders);
        });

        test('should handle database error', async () => {
            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);

            await OrderController.getOrders(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error fetching orders'
            });
        });
    });

    describe('createOrder', () => {
        test('should create order successfully', async () => {
            mockReq.body = {
                items: [
                    { product_id: 1, quantity: 2 }
                ]
            };

            // Mock cart items check
            mockConnection.query.mockResolvedValueOnce([[
                { product_id: 1, quantity: 2, price: 10.99 }
            ], []]);
            // Mock order creation
            mockConnection.query.mockResolvedValueOnce([{ insertId: 1 }, []]);
            // Mock order items creation
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }, []]);
            // Mock cart clearing
            mockConnection.query.mockResolvedValueOnce([{ affectedRows: 1 }, []]);

            await OrderController.createOrder(mockReq, mockRes);

            expect(mockConnection.beginTransaction).toHaveBeenCalled();
            expect(mockConnection.query).toHaveBeenCalledTimes(4);
            expect(mockConnection.commit).toHaveBeenCalled();
            expect(mockConnection.release).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Order created successfully',
                orderId: 1
            });
        });

        test('should handle empty cart', async () => {
            mockReq.body = {
                items: []
            };

            await OrderController.createOrder(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'No items provided'
            });
        });

        test('should handle transaction error', async () => {
            mockReq.body = {
                items: [
                    { product_id: 1, quantity: 2 }
                ]
            };

            const error = new Error('Transaction error');
            mockConnection.query.mockRejectedValueOnce(error);

            await OrderController.createOrder(mockReq, mockRes);

            expect(mockConnection.rollback).toHaveBeenCalled();
            expect(mockConnection.release).toHaveBeenCalled();
            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error creating order',
                error: error.message
            });
        });
    });

    describe('getOrderById', () => {
        test('should return order details successfully', async () => {
            mockReq.params = { id: 1 };

            const mockOrder = {
                id: 1,
                user_id: 1,
                total_amount: 50.99,
                status: 'pending',
                created_at: '2024-03-20T10:00:00Z',
                items: [
                    {
                        product_id: 1,
                        quantity: 2,
                        price: 10.99
                    }
                ]
            };

            db.query.mockResolvedValueOnce([[mockOrder], []]);

            await OrderController.getOrderById(mockReq, mockRes);

            expect(db.query).toHaveBeenCalledWith(
                expect.stringContaining('SELECT'),
                [mockReq.params.id, mockReq.user.id]
            );
            expect(mockRes.json).toHaveBeenCalledWith(mockOrder);
        });

        test('should handle order not found', async () => {
            mockReq.params = { id: 999 };

            db.query.mockResolvedValueOnce([[], []]);

            await OrderController.getOrderById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Order not found'
            });
        });

        test('should handle database error', async () => {
            mockReq.params = { id: 1 };

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);

            await OrderController.getOrderById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Error fetching order'
            });
        });
    });
});
