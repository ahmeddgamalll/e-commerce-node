import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import ShoppingCart from './components/ShoppingCart';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ShoppingCart />
        </ThemeProvider>
    );
}

export default App;
