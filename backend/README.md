# TechXchange Backend

A comprehensive marketplace backend for tech products built with Node.js, Express, TypeScript, and MongoDB.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

## ✨ Features

- **User Authentication & Authorization**
  - Seller and Buyer registration
  - JWT-based authentication
  - Role-based access control

- **Product Management**
  - Create, read, update products (Sellers only)
  - Product reviews and ratings (Buyers only)
  - Product categorization

- **Seller Management**
  - Seller profiles and bio management
  - View seller products

- **News & Information**
  - Real-time tech news integration
  - Search technology news
  - Popular tech source aggregation
  - Intelligent caching system
  - Scheduled data refresh

- **Security**
  - Input validation with Joi
  - Password hashing with bcrypt
  - Helmet.js for security headers
  - CORS configuration

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Testing**: Jest with Supertest
- **Security**: Helmet.js, bcrypt
- **Logging**: Winston
- **Development**: Nodemon, ESLint, Prettier

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Paul-Aransiola/techxchange.git
   cd techxchange-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Build the TypeScript project**

   ```bash
   npm run tsc-build
   ```

## ⚙️ Environment Configuration

1. **Copy the environment example file**

   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables in `.env`**

   ```bash
   # Server Configuration
   PORT=4000
   
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/techxchange
   MONGO_DB_NAME=techxchange
   
   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   
   # External API Configuration
   NEWS_API_KEY=your-newsapi-org-api-key-here
   NEWS_API_BASE_URL=https://newsapi.org/v2
   CACHE_DURATION_MINUTES=30
   
   # Other configurations (optional)
   SALT_ROUNDS=10
   MAX_LOGIN_ATTEMPTS=3
   TOKEN_LIFE_SPAN=120h
   ```3. **Database Setup**
   - For local MongoDB: Ensure MongoDB is running on your machine
   - For MongoDB Atlas: Create a cluster and get your connection string

## 🏃‍♂️ Running the Application

### Development Mode

1. **Build and watch TypeScript files**

   ```bash
   npm run tsc-watch
   ```

2. **In a new terminal, start the development server**

   ```bash
   npm run dev
   ```

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:4000` (or your configured PORT).

## 📚 API Documentation

Base URL: `http://localhost:4000/api/v1`

### Authentication Endpoints

#### Register as Seller

- **POST** `/auth/seller/sign-up`
- **Body**:

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phoneNumber": "+1234567890",
    "password": "Password123!"
  }
  ```

#### Register as Buyer

- **POST** `/auth/buyer/sign-up`
- **Body**: Same as seller registration

#### Sign In

- **POST** `/auth/sign-in`
- **Body**:

  ```json
  {
    "email": "john.doe@example.com",
    "password": "Password123!"
  }
  ```

### Product Endpoints

#### Get All Products

- **GET** `/products`
- **Auth**: None required

#### Create Product (Sellers only)

- **POST** `/products`
- **Auth**: Bearer token required
- **Body**:

  ```json
  {
    "name": "iPhone 15 Pro",
    "category": "Smartphones",
    "description": "Latest iPhone with advanced features",
    "price": 999.99
  }
  ```

#### Get Single Product

- **GET** `/products/:id`
- **Auth**: None required

#### Update Product (Sellers only)

- **PUT** `/products/:id`
- **Auth**: Bearer token required
- **Body**: Same as create product

#### Create Product Review (Buyers only)

- **POST** `/products/:id/reviews`
- **Auth**: Bearer token required
- **Body**:

  ```json
  {
    "text": "Great product!",
    "rating": 5
  }
  ```

#### Get Product Reviews

- **GET** `/products/:id/reviews`
- **Auth**: None required

#### Get Single Review

- **GET** `/products/reviews/:id`
- **Auth**: None required

### Seller Endpoints

#### Get All Sellers

- **GET** `/sellers`
- **Auth**: None required

#### Get Single Seller

- **GET** `/sellers/:id`
- **Auth**: None required

#### Update Seller Profile (Sellers only)

- **PUT** `/sellers`
- **Auth**: Bearer token required

#### Get Seller Products

- **GET** `/sellers/:id/products`
- **Auth**: Bearer token required

### News Endpoints

#### Get Tech News
- **GET** `/news/tech`
- **Auth**: None required
- **Query Parameters**:
  - `q` - Search query (optional)
  - `page` - Page number (optional)
  - `pageSize` - Number of articles per page (optional, max 20)
  - `sortBy` - Sort by relevancy, popularity, or publishedAt (optional)

#### Get Tech Headlines
- **GET** `/news/headlines`
- **Auth**: None required
- **Query Parameters**:
  - `country` - Country code (optional, default: 'us')

#### Search Tech News
- **GET** `/news/search`
- **Auth**: None required
- **Query Parameters**:
  - `q` - Search query (required)
  - `page` - Page number (optional)
  - `pageSize` - Number of articles per page (optional)
  - `sortBy` - Sort by relevancy, popularity, or publishedAt (optional)

#### Get News from Tech Sources
- **GET** `/news/sources`
- **Auth**: None required

#### Get Cache Statistics (Admin only)
- **GET** `/news/cache/stats`
- **Auth**: Bearer token required (Admin role)

#### Clear Expired Cache (Admin only)
- **POST** `/news/cache/clear`
- **Auth**: Bearer token required (Admin role)

### Authentication

For protected endpoints, include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

## 📁 Project Structure

```
src/
├── @types/              # TypeScript type definitions
├── config/              # Configuration files
├── controllers/         # Route controllers
├── database/           # Database models and utilities
├── middlewares/        # Express middlewares
├── routes/             # Route definitions
├── services/           # Business logic services
└── utils/              # Utility functions and validation

dist/                  # Compiled JavaScript files
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Use ESLint and Prettier for code formatting
- Follow conventional commit messages
- Ensure all tests pass before submitting PR

### Code Style

```bash
# Format code
npm run format

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```
