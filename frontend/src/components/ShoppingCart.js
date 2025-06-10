import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Card,
    CardContent,
    Grid,
    IconButton,
    Button,
    Box,
    CircularProgress,
    Badge,
} from '@mui/material';
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    Delete as DeleteIcon,
    ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { cartService } from '../services/api';

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const items = await cartService.getCart();
            setCartItems(items);
            setError(null);
        } catch (err) {
            setError('Failed to fetch cart items');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateQuantity = async (productId, currentQuantity, change) => {
        try {
            const newQuantity = currentQuantity + change;
            if (newQuantity < 1) return;

            await cartService.updateQuantity(productId, newQuantity);
            fetchCart();
        } catch (err) {
            setError('Failed to update quantity');
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            await cartService.removeFromCart(productId);
            fetchCart();
        } catch (err) {
            setError('Failed to remove item');
        }
    };

    const handleClearCart = async () => {
        try {
            await cartService.clearCart();
            setCartItems([]);
        } catch (err) {
            setError('Failed to clear cart');
        }
    };

    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <IconButton
                color="primary"
                onClick={() => setIsOpen(!isOpen)}
                sx={{ position: 'fixed', top: 20, right: 20, zIndex: 1000 }}
            >
                <Badge badgeContent={totalItems} color="error">
                    <CartIcon />
                </Badge>
            </IconButton>

            {isOpen && (
                <Container
                    maxWidth="md"
                    sx={{
                        py: 4,
                        position: 'fixed',
                        top: 0,
                        right: 0,
                        height: '100vh',
                        backgroundColor: 'white',
                        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
                        zIndex: 999,
                        overflowY: 'auto'
                    }}
                >
                    <Typography variant="h4" component="h1" gutterBottom>
                        Shopping Cart
                    </Typography>

                    {loading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Typography color="error" align="center">
                            {error}
                        </Typography>
                    ) : cartItems.length === 0 ? (
                        <Typography align="center">Your cart is empty</Typography>
                    ) : (
                        <>
                            <Grid container spacing={2}>
                                {cartItems.map((item) => (
                                    <Grid item xs={12} key={item.id}>
                                        <Card>
                                            <CardContent>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item xs={12} sm={4}>
                                                        <Typography variant="h6">{item.name}</Typography>
                                                        <Typography color="textSecondary">
                                                            ${item.price.toFixed(2)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box display="flex" alignItems="center">
                                                            <IconButton
                                                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity, -1)}
                                                            >
                                                                <RemoveIcon />
                                                            </IconButton>
                                                            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                                                            <IconButton
                                                                onClick={() => handleUpdateQuantity(item.product_id, item.quantity, 1)}
                                                            >
                                                                <AddIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item xs={12} sm={4}>
                                                        <Box display="flex" justifyContent="flex-end">
                                                            <Typography variant="h6" sx={{ mr: 2 }}>
                                                                ${(item.price * item.quantity).toFixed(2)}
                                                            </Typography>
                                                            <IconButton
                                                                color="error"
                                                                onClick={() => handleRemoveItem(item.product_id)}
                                                            >
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box display="flex" justifyContent="space-between" mt={4}>
                                <Typography variant="h5">
                                    Total: ${totalPrice.toFixed(2)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={handleClearCart}
                                >
                                    Clear Cart
                                </Button>
                            </Box>
                        </>
                    )}
                </Container>
            )}
        </>
    );
};

export default ShoppingCart;
