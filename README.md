# 🛒 TechXchange - Full-Stack Tech Marketplace

A comprehensive tech marketplace platform that connects buyers and sellers for trading technology products. Built with modern technologies and best practices for scalability, security, and user experience.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠 Tech Stack](#-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📖 API Documentation](#-api-documentation)
- [🔧 Configuration](#-configuration)
- [🧪 Testing](#-testing)
- [📁 Project Structure](#-project-structure)
- [🔐 Security Features](#-security-features)
- [📊 Monitoring & Health Checks](#-monitoring--health-checks)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 🌟 Features

### 👥 User Management

- **Multi-role Authentication**: Buyer, Seller, and Admin roles
- **Secure Registration/Login**: JWT-based authentication with role-based access control
- **Profile Management**: Comprehensive user profiles with customizable seller bios

### 🛍️ Product Management

- **Full CRUD Operations**: Create, read, update, and delete products (sellers only)
- **Product Reviews & Ratings**: Comprehensive review system with 5-star ratings
- **Image Upload**: Multiple product image uploads with file validation
- **Advanced Filtering**: Search and filter products by category, price, and ratings
- **Product Analytics**: Track product views and engagement

### 🛒 Shopping Experience

- **Shopping Cart**: Add, update, remove items with quantity management
- **Product Discovery**: Browse products with pagination and search functionality
- **Seller Profiles**: View seller information and their product listings
- **Real-time Updates**: Dynamic cart updates and product availability

### 💬 Communication

- **Messaging System**: Direct messaging between buyers and sellers
- **Product Inquiries**: Context-aware messaging linked to specific products
- **Message Management**: Mark as read, delete, and organize conversations
- **Unread Notifications**: Real-time unread message count

### 📰 Tech News Integration

- **Live Tech News**: Integration with external news APIs
- **Tech Headlines**: Latest technology news and trends
- **News Search**: Search for specific tech news topics
- **Source Filtering**: News from verified tech sources

### 🔧 Admin Features

- **User Management**: Comprehensive admin dashboard for user oversight
- **Cache Management**: Redis cache statistics and management
- **System Monitoring**: Health checks and performance metrics
- **Rate Limiting**: Configurable API rate limiting for different user types

## 🏗️ Architecture

The application follows a modern microservices-inspired architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (MongoDB)     │
│                 │    │                 │    │                 │
│ • React Router  │    │ • JWT Auth      │    │ • Mongoose ODM  │
│ • Ant Design    │    │ • Rate Limiting │    │ • Transactions  │
│ • React Query   │    │ • File Upload   │    │ • Indexing      │
│ • Axios         │    │ • Validation    │    │ • Aggregation   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  External APIs  │
                       │                 │
                       │ • News API      │
                       │ • File Storage  │
                       └─────────────────┘
```

## 🛠 Tech Stack

### Frontend

- **Framework**: React 19 with TypeScript
- **UI Library**: Ant Design + Tailwind CSS
- **State Management**: React Query for server state, Context API for app state
- **Routing**: React Router v6
- **Forms**: Formik + Yup validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Toastify

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi schema validation
- **File Upload**: Multer with validation
- **Security**: Helmet, CORS, Rate Limiting
- **Logging**: Winston logger
- **Testing**: Jest + Supertest

### DevOps & Tools

- **Process Management**: PM2 (production)
- **Development**: Nodemon, TypeScript compiler
- **Code Quality**: ESLint, Prettier
- **Testing**: Jest, MongoDB Memory Server
- **Documentation**: Swagger/OpenAPI
- **Monitoring**: Health check endpoints

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **MongoDB** - [Local installation](https://www.mongodb.com/try/download/community) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - Version control

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Paul-Aransiola/techxchange.git
cd techxchange
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file (see Configuration section)
# Edit .env with your database URI, JWT secret, etc.

# Build TypeScript
npm run tsc-build

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your .env file
# Edit .env with your API base URL

# Start development server
npm start
```

### 4. Access the Application

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:4000>
- **API Documentation**: <http://localhost:4000/api-docs> (when Swagger is configured)

## 📖 API Documentation

### Base URL

```
Production: https://your-domain.com/api/v1
Development: http://localhost:4000/api/v1
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### API Endpoints Overview

#### 🔐 Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/seller/sign-up` | Register as seller | ❌ |
| `POST` | `/auth/buyer/sign-up` | Register as buyer | ❌ |
| `POST` | `/auth/sign-in` | User login | ❌ |

#### 🛍️ Product Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/products` | Get all products | ❌ | Public |
| `POST` | `/products` | Create product | ✅ | Seller |
| `GET` | `/products/:id` | Get single product | ❌ | Public |
| `PUT` | `/products/:id` | Update product | ✅ | Seller |
| `POST` | `/products/:id/reviews` | Create review | ✅ | Buyer |
| `GET` | `/products/:id/reviews` | Get product reviews | ❌ | Public |
| `GET` | `/products/reviews/:id` | Get single review | ❌ | Public |

#### 👤 Seller Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/sellers` | Get all sellers | ❌ | Public |
| `GET` | `/sellers/:id` | Get seller profile | ❌ | Public |
| `PUT` | `/sellers` | Update seller profile | ✅ | Seller |
| `GET` | `/sellers/products` | Get own products | ✅ | Seller |
| `GET` | `/sellers/:id/products` | Get seller's products | ✅ | Buyer, Seller |

#### 🛒 Cart Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/cart` | Get user's cart | ✅ | Buyer, Seller |
| `POST` | `/cart/add` | Add item to cart | ✅ | Buyer, Seller |
| `PUT` | `/cart/item/:productId` | Update cart item | ✅ | Buyer, Seller |
| `DELETE` | `/cart/item/:productId` | Remove from cart | ✅ | Buyer, Seller |
| `DELETE` | `/cart/clear` | Clear entire cart | ✅ | Buyer, Seller |

#### 💬 Message Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `POST` | `/messages` | Send message | ✅ | Buyer, Seller |
| `GET` | `/messages` | Get messages | ✅ | Buyer, Seller |
| `GET` | `/messages/unread-count` | Get unread count | ✅ | Buyer, Seller |
| `PATCH` | `/messages/:id/read` | Mark as read | ✅ | Buyer, Seller |
| `DELETE` | `/messages/:id` | Delete message | ✅ | Buyer, Seller |

#### 📰 News Endpoints

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/news/tech` | Get tech news | ❌ | Public |
| `GET` | `/news/headlines` | Get tech headlines | ❌ | Public |
| `GET` | `/news/search` | Search tech news | ❌ | Public |
| `GET` | `/news/sources` | Get news from sources | ❌ | Public |
| `GET` | `/news/cache/stats` | Get cache statistics | ✅ | Admin |
| `POST` | `/news/cache/clear` | Clear expired cache | ✅ | Admin |

#### 🏥 Health Check Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/health` | Basic health check | ❌ |
| `GET` | `/health/ready` | Readiness check | ❌ |
| `GET` | `/health/metrics` | System metrics | ❌ |

### Request/Response Examples

#### User Registration

```javascript
// Request
POST /api/v1/auth/seller/sign-up
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phoneNumber": "+1234567890",
  "password": "SecurePassword123!"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60f7b3b3e6b8d8001f8e4c8a",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "SELLER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Create Product

```javascript
// Request
POST /api/v1/products
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "iPhone 15 Pro",
  "category": "Smartphones",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "images": [file1, file2] // File uploads
}

// Response
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": "60f7b3b3e6b8d8001f8e4c8b",
      "name": "iPhone 15 Pro",
      "category": "Smartphones",
      "description": "Latest iPhone with advanced features",
      "price": 999.99,
      "images": ["url1", "url2"],
      "seller": "60f7b3b3e6b8d8001f8e4c8a",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### Add to Cart

```javascript
// Request
POST /api/v1/cart/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": "60f7b3b3e6b8d8001f8e4c8b",
  "quantity": 2
}

// Response
{
  "success": true,
  "message": "Item added to cart successfully",
  "data": {
    "cart": {
      "user": "60f7b3b3e6b8d8001f8e4c8a",
      "items": [
        {
          "product": {
            "id": "60f7b3b3e6b8d8001f8e4c8b",
            "name": "iPhone 15 Pro",
            "price": 999.99
          },
          "quantity": 2,
          "subtotal": 1999.98
        }
      ],
      "totalAmount": 1999.98,
      "totalItems": 2
    }
  }
}
```

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```bash
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/techxchange
MONGO_DB_NAME=techxchange

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB
ALLOWED_FILE_TYPES=jpeg,jpg,png,gif

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=5
NEWS_RATE_LIMIT_MAX=30
ADMIN_RATE_LIMIT_MAX=20

# External APIs
NEWS_API_KEY=your-news-api-key
NEWS_API_BASE_URL=https://newsapi.org/v2

# Redis Configuration (if using)
REDIS_URL=redis://localhost:6379

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log

# CORS
CORS_ORIGIN=http://localhost:3000

# Security
HELMET_CSP_DIRECTIVES=default-src 'self'
```

### Frontend Environment Variables

Create a `.env` file in the frontend directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:4000/api/v1

# App Configuration
REACT_APP_NAME=TechXchange
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_NEWS=true
REACT_APP_ENABLE_MESSAGING=true
REACT_APP_ENABLE_CART=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif
```

## 🧪 Testing

### Backend Testing

```bash
cd backend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- productService.test.ts

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── services/        # Service layer tests
│   ├── controllers/     # Controller tests
│   ├── middlewares/     # Middleware tests
│   └── utils/           # Utility function tests
├── integration/         # Integration tests
│   ├── auth.test.ts     # Authentication flows
│   ├── product.test.ts  # Product operations
│   └── cart.test.ts     # Cart functionality
└── e2e/                 # End-to-end tests
    └── user-journey.test.ts
```

### Frontend Testing

```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests without watch mode
npm test -- --watchAll=false
```

## 📁 Project Structure

```
techxchange/
├── backend/                    # Backend API
│   ├── src/
│   │   ├── @types/            # TypeScript type definitions
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   │   ├── product/       # Product-related controllers
│   │   │   └── external/      # External API controllers
│   │   ├── database/          # Database configuration
│   │   │   └── models/        # Mongoose models
│   │   ├── middlewares/       # Express middlewares
│   │   │   └── auth/          # Authentication middlewares
│   │   ├── routes/            # Route definitions
│   │   ├── services/          # Business logic services
│   │   │   └── product/       # Product-related services
│   │   └── utils/             # Utility functions
│   │       ├── util/          # General utilities
│   │       └── validation/    # Input validation schemas
│   ├── tests/                 # Test files
│   ├── dist/                  # Compiled JavaScript
│   ├── logs/                  # Application logs
│   └── uploads/               # File uploads
├── frontend/                  # React frontend
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── common/       # Common UI components
│   │   │   ├── forms/        # Form components
│   │   │   └── layout/       # Layout components
│   │   ├── contexts/         # React contexts
│   │   ├── pages/            # Page components
│   │   │   ├── auth/         # Authentication pages
│   │   │   ├── products/     # Product pages
│   │   │   └── profile/      # User profile pages
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API service functions
│   │   ├── types/            # TypeScript interfaces
│   │   └── utils/            # Utility functions
│   └── build/                # Production build
└── docs/                     # Documentation
    ├── api/                  # API documentation
    └── deployment/           # Deployment guides
```

## 🔐 Security Features

### Authentication & Authorization

- **JWT Tokens**: Secure, stateless authentication
- **Role-Based Access**: Granular permissions for Buyer, Seller, Admin
- **Password Hashing**: bcrypt with salt rounds
- **Token Expiration**: Configurable token lifetime

### Input Validation

- **Schema Validation**: Joi-based request validation
- **File Upload Security**: Type and size restrictions
- **SQL Injection Prevention**: Mongoose ODM parameterized queries
- **XSS Protection**: Input sanitization and output encoding

### Rate Limiting

- **API Rate Limiting**: Configurable limits per endpoint
- **Authentication Throttling**: Brute force protection
- **Role-Based Limits**: Different limits for different user types

### Security Headers

- **Helmet.js**: Comprehensive security headers
- **CORS Configuration**: Cross-origin resource sharing controls
- **Content Security Policy**: XSS and injection attack prevention

## 📊 Monitoring & Health Checks

### Health Check Endpoints

- **Basic Health**: `/health` - Simple health status
- **Readiness Check**: `/health/ready` - Database and service readiness
- **Metrics**: `/health/metrics` - System performance metrics

### Logging

- **Structured Logging**: Winston with configurable levels
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error logging with stack traces
- **Performance Monitoring**: Response time and throughput metrics

### Monitoring Integration

```javascript
// Example health check response
{
  "success": true,
  "message": "Service is healthy",
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "uptime": 3600,
    "checks": {
      "database": "connected",
      "memory": "normal",
      "disk": "normal"
    }
  }
}
```

## 🚀 Deployment

### Docker Deployment

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["node", "dist/server.js"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
      - MONGO_URI=mongodb://mongo:27017/techxchange
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

### Production Checklist

- [ ] Environment variables configured
- [ ] Database indexes created
- [ ] SSL certificates installed
- [ ] CORS origins configured
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Health checks working
- [ ] Backup strategy implemented

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Make** your changes
4. **Write** tests for new functionality
5. **Ensure** all tests pass (`npm test`)
6. **Commit** your changes (`git commit -m 'Add amazing feature'`)
7. **Push** to the branch (`git push origin feature/amazing-feature`)
8. **Open** a Pull Request

### Code Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the project's linting rules
- **Prettier**: Code formatting is automatically enforced
- **Testing**: Maintain >80% test coverage
- **Documentation**: Update documentation for new features

### Commit Convention

```
feat: add new user authentication system
fix: resolve cart calculation bug
docs: update API documentation
style: format code with prettier
refactor: improve database query performance
test: add unit tests for product service
chore: update dependencies
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Documentation**: [Wiki](https://github.com/Paul-Aransiola/techxchange/wiki)
- **Issues**: [GitHub Issues](https://github.com/Paul-Aransiola/techxchange/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Paul-Aransiola/techxchange/discussions)
- **Email**: <support@techxchange.com>

---

<div align="center">
  <p>Built with ❤️ by the TechXchange Team</p>
  <p>
    <a href="https://github.com/Paul-Aransiola/techxchange">⭐ Star us on GitHub</a> •
    <a href="https://github.com/Paul-Aransiola/techxchange/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Paul-Aransiola/techxchange/issues">✨ Request Feature</a>
  </p>
</div>
