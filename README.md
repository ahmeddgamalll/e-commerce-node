# E-Commerce Application

A full-stack e-commerce application built with Node.js, Express, MySQL, and React. This application provides a complete shopping experience with user authentication, product management, shopping cart functionality, and order processing.

## 🚀 Features

### User Features
- User registration and authentication
- User profile management
- Shopping cart functionality
- Order history and tracking
- Real-time cart updates
- Responsive design for all devices

### Admin Features
- Product management (CRUD operations)
- Order management
- User management
- Sales analytics
- Inventory tracking

## 🛠️ Tech Stack

### Backend
- Node.js & Express.js
- MySQL Database
- JWT Authentication
- Jest for Testing
- Sequelize ORM

### Frontend
- React with TypeScript
- Redux for State Management
- Material-UI Components
- React Router for Navigation
- Axios for API Calls
- Jest & React Testing Library

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager
- Git

## 🏗️ Project Structure

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

## 🚀 Getting Started

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=ecommerce_db
   JWT_SECRET=your_jwt_secret
   PORT=3001
   ```

4. Create the database and tables:
   ```bash
   npm run setup-db
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The backend server will start on http://localhost:3001

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
   REACT_APP_API_URL=http://localhost:3001/api
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The frontend application will start on http://localhost:3000

## 🧪 Testing

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

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
  - Request Body: `{ email, password, name }`
  - Response: `{ token, user }`

- `POST /api/auth/login` - Login user
  - Request Body: `{ email, password }`
  - Response: `{ token, user }`

- `GET /api/auth/profile` - Get user profile
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ user }`

### Cart Endpoints

- `GET /api/cart` - Get user's cart
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ items: [] }`

- `POST /api/cart` - Add item to cart
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ product_id, quantity }`
  - Response: `{ item }`

- `PUT /api/cart/:id` - Update cart item
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ quantity }`
  - Response: `{ item }`

- `DELETE /api/cart/:id` - Remove item from cart
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ message }`

- `DELETE /api/cart` - Clear cart
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ message }`

### Order Endpoints

- `GET /api/orders` - Get user's orders
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ orders: [] }`

- `POST /api/orders` - Create new order
  - Headers: `Authorization: Bearer <token>`
  - Request Body: `{ items: [{ product_id, quantity }] }`
  - Response: `{ order }`

- `GET /api/orders/:id` - Get order details
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ order }`

## 🔧 Development

### Backend Development

- The backend uses Express.js for the API server
- MySQL for the database with Sequelize ORM
- JWT for authentication
- Jest for testing
- Error handling middleware
- Input validation
- Database migrations

### Frontend Development

- The frontend uses React with TypeScript
- Redux for state management
- React Router for navigation
- Material-UI for components
- Axios for API calls
- Jest and React Testing Library for testing
- Responsive design
- Form validation

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation if needed
3. Ensure all tests pass
4. Follow the existing code style
5. Add tests for new features

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Ahmed Gamal - Initial work

## 🙏 Acknowledgments

- Material-UI for the component library
- React community for the amazing tools
- Node.js community for the backend tools
