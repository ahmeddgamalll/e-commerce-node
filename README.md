# E-Commerce Application

A full-stack e-commerce application built with Node.js, Express, MySQL, and React.

## Features

- User authentication
- Product management
- Shopping cart functionality
- Real-time cart updates
- Responsive Material-UI design

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## Project Structure

```
e-commarce-node/
├── backend/           # Node.js/Express backend
│   ├── src/
│   │   ├── config/    # Database and other configurations
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/ # Custom middleware
│   │   ├── models/    # Database models
│   │   ├── routes/    # API routes
│   │   └── utils/     # Utility functions
│   └── tests/        # Backend tests
└── frontend/         # React frontend
    ├── my-app/
    │   ├── src/
    │   │   ├── components/ # React components
    │   │   ├── pages/     # Page components
    │   │   ├── services/  # API services
    │   │   └── utils/     # Utility functions
    │   └── tests/        # Frontend tests
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Create the database and tables:
   ```bash
   npm run setup-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/my-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend/my-app directory:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start on http://localhost:3000

## Testing

### Backend Tests

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Run the tests:
   ```bash
   npm test
   ```

This will run all backend tests using Jest. The tests include:
- Cart controller tests
- Order controller tests
- Authentication tests
- API endpoint tests

### Frontend Tests

1. Navigate to the frontend directory:
   ```bash
   cd frontend/my-app
   ```

2. Run the tests:
   ```bash
   npm test
   ```

This will run all frontend tests using Jest and React Testing Library. The tests include:
- Component tests
- Page tests
- Service tests
- Integration tests

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Cart Endpoints

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Order Endpoints

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## Development

### Backend Development

- The backend uses Express.js for the API server
- MySQL for the database
- JWT for authentication
- Jest for testing

### Frontend Development

- The frontend uses React with TypeScript
- Redux for state management
- React Router for navigation
- Jest and React Testing Library for testing

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
