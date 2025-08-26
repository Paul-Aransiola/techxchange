# 🚀 TechXchange Frontend

A modern, responsive React application for the TechXchange marketplace platform. Built with React 19, TypeScript, and Ant Design for an exceptional user experience.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Ant Design](https://img.shields.io/badge/Ant_Design-0170FE?style=for-the-badge&logo=ant-design&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white)

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🛠 Tech Stack](#-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔧 Configuration](#-configuration)
- [🎨 UI Components](#-ui-components)
- [🔄 State Management](#-state-management)
- [🛣️ Routing](#️-routing)
- [📱 Responsive Design](#-responsive-design)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)

## 🌟 Features

### 🔐 Authentication & Authorization

- **Multi-role Login**: Seamless authentication for Buyers, Sellers, and Admins
- **Protected Routes**: Role-based access control with route protection
- **JWT Token Management**: Automatic token handling with refresh capabilities
- **Profile Management**: User profile editing and management

### 🛍️ E-commerce Experience

- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Comprehensive product information with image galleries
- **Shopping Cart**: Real-time cart management with quantity updates
- **Product Reviews**: Read and write product reviews with star ratings
- **Seller Profiles**: View seller information and their product listings

### 💬 Communication Features

- **Real-time Messaging**: Direct communication between buyers and sellers
- **Message Management**: Organize conversations and mark messages as read
- **Unread Notifications**: Real-time unread message count indicators
- **Product Inquiries**: Context-aware messaging linked to specific products

### 📰 Tech News Integration

- **Live News Feed**: Latest technology news and trends
- **News Search**: Search for specific tech topics and keywords
- **Source Filtering**: News from verified technology sources
- **News Categories**: Browse news by different tech categories

### 🎨 Modern UI/UX

- **Responsive Design**: Mobile-first design that works on all devices
- **Dark/Light Mode**: Theme switching for user preference
- **Loading States**: Elegant loading indicators and skeleton screens
- **Error Handling**: User-friendly error messages and fallbacks
- **Accessibility**: WCAG compliant design for inclusive user experience

## 🛠 Tech Stack

### Core Technologies

- **React 19**: Latest React version with concurrent features
- **TypeScript**: Full type safety and enhanced developer experience
- **Create React App**: Optimized build setup and development server

### UI & Styling

- **Ant Design 5.26**: Comprehensive React UI component library
- **Tailwind CSS**: Utility-first CSS framework for custom styling
- **Ant Design Icons**: Extensive icon library
- **Material-UI Icons**: Additional icon options

### State Management & Data Fetching

- **TanStack React Query**: Powerful data synchronization for React
- **React Context**: Global state management for app-wide data
- **Axios**: HTTP client with interceptors and request/response handling

### Forms & Validation

- **Formik**: Build forms without tears
- **Yup**: JavaScript schema validation
- **Ant Design Forms**: Integrated form components with validation

### Routing & Navigation

- **React Router v6**: Declarative routing for React applications
- **Protected Routes**: Route-level authentication and authorization
- **Dynamic Navigation**: Context-aware navigation based on user roles

### Development & Testing

- **React Testing Library**: Simple and complete testing utilities
- **Jest**: JavaScript testing framework
- **TypeScript ESLint**: Code quality and consistency
- **Web Vitals**: Performance monitoring

## 📋 Prerequisites

Before running this project, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **Backend API** - TechXchange backend server running

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Paul-Aransiola/techxchange.git
cd techxchange/frontend
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Setup

```bash
# Copy the environment example file
cp .env.example .env

# Edit the .env file with your configuration
```

### 4. Configure Environment Variables

Edit the `.env` file with your settings:

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
```

### 5. Start Development Server

```bash
npm start
```

The application will open at `http://localhost:3000`

### 6. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/              # Reusable UI components
│   ├── AddToCartButton.tsx  # Shopping cart functionality
│   ├── LoadingSpinner.tsx   # Loading indicators
│   ├── MarketPlace.tsx      # Main marketplace component
│   ├── Navigation/          # Navigation components
│   ├── News.tsx             # News display components
│   ├── ProdectedRoute.tsx   # Route protection
│   └── ProductList.tsx      # Product listing components
├── contexts/                # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   ├── CartContext.tsx      # Shopping cart state
│   └── ThemeContext.tsx     # Theme management
├── pages/                   # Page components
│   ├── Home.tsx             # Homepage
│   ├── CartPage.tsx         # Shopping cart page
│   ├── MessagesPage.tsx     # Messaging interface
│   ├── NewsPage.tsx         # News feed page
│   ├── Unauthorized.tsx     # Access denied page
│   ├── auth/                # Authentication pages
│   │   ├── Login.tsx        # Login page
│   │   ├── Register.tsx     # Registration page
│   │   └── Profile.tsx      # User profile page
│   └── seller/              # Seller-specific pages
│       ├── Dashboard.tsx    # Seller dashboard
│       ├── Products.tsx     # Product management
│       └── Analytics.tsx    # Sales analytics
├── routes/                  # Route configuration
│   ├── AppRoutes.tsx        # Main route definitions
│   ├── ProtectedRoute.tsx   # Route protection logic
│   └── RouteConstants.tsx   # Route path constants
├── services/                # API service functions
│   ├── authService.ts       # Authentication APIs
│   ├── productService.ts    # Product APIs
│   ├── cartService.ts       # Cart APIs
│   ├── messageService.ts    # Messaging APIs
│   ├── newsService.ts       # News APIs
│   └── api.ts               # Base API configuration
├── types/                   # TypeScript type definitions
│   ├── auth.ts              # Authentication types
│   ├── product.ts           # Product types
│   ├── user.ts              # User types
│   ├── cart.ts              # Cart types
│   └── api.ts               # API response types
├── utils/                   # Utility functions
│   ├── constants.ts         # App constants
│   ├── helpers.ts           # Helper functions
│   ├── validation.ts        # Form validation schemas
│   └── formatters.ts        # Data formatting utilities
├── App.tsx                  # Main App component
├── index.tsx                # App entry point
└── setupTests.ts            # Test configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# API Configuration
REACT_APP_API_BASE_URL=http://localhost:4000/api/v1
REACT_APP_WS_URL=ws://localhost:4000

# App Configuration
REACT_APP_NAME=TechXchange
REACT_APP_VERSION=1.0.0
REACT_APP_DESCRIPTION=Tech Marketplace Platform

# Feature Flags
REACT_APP_ENABLE_NEWS=true
REACT_APP_ENABLE_MESSAGING=true
REACT_APP_ENABLE_CART=true
REACT_APP_ENABLE_NOTIFICATIONS=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=your-ga-id
REACT_APP_SENTRY_DSN=your-sentry-dsn

# Upload Configuration
REACT_APP_MAX_FILE_SIZE=5242880
REACT_APP_ALLOWED_FILE_TYPES=image/jpeg,image/jpg,image/png,image/gif

# Theme Configuration
REACT_APP_DEFAULT_THEME=light
REACT_APP_PRIMARY_COLOR=#1890ff
REACT_APP_SECONDARY_COLOR=#52c41a
```

### API Integration

The frontend integrates with the TechXchange backend API:

```typescript
// API Base Configuration
const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// Authentication Headers
const authHeaders = {
  Authorization: `Bearer ${localStorage.getItem('token')}`
};
```

## 🎨 UI Components

### Component Library

Built with **Ant Design** for consistent, professional UI components:

- **Forms**: Login, Registration, Product Creation
- **Tables**: Product listings, Order history
- **Cards**: Product cards, User profiles
- **Modals**: Confirmation dialogs, Image galleries
- **Navigation**: Menus, Breadcrumbs, Pagination

### Custom Components

```typescript
// Example: Product Card Component
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails
}) => {
  return (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.images[0]} />}
      actions={[
        <ShoppingCartOutlined onClick={() => onAddToCart(product.id)} />,
        <EyeOutlined onClick={() => onViewDetails(product.id)} />
      ]}
    >
      <Card.Meta
        title={product.name}
        description={`$${product.price}`}
      />
    </Card>
  );
};
```

### Styling Approach

- **Ant Design**: Base component styling
- **Tailwind CSS**: Custom utility classes
- **CSS Modules**: Component-specific styles
- **Theme Customization**: Ant Design theme tokens

## 🔄 State Management

### React Query for Server State

```typescript
// Product Queries
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productService.getAllProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};
```

### Context for Global State

```typescript
// Auth Context
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### Local Storage Management

- **Authentication tokens**: Persistent login state
- **User preferences**: Theme, language settings
- **Cart data**: Offline cart persistence
- **Form data**: Draft form state

## 🛣️ Routing

### Route Structure

```typescript
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      
      {/* Protected Routes */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Seller Routes */}
      <Route path="/seller/*" element={
        <ProtectedRoute allowedRoles={['SELLER']}>
          <SellerRoutes />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminRoutes />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
```

### Protected Routes

```typescript
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = []
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
```

## 📱 Responsive Design

### Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px - 1440px
- **Large Desktop**: 1440px+

### Responsive Features

- **Mobile Navigation**: Collapsible sidebar menu
- **Grid Layouts**: Responsive product grids
- **Touch Interactions**: Mobile-optimized interactions
- **Progressive Enhancement**: Mobile-first approach

### Ant Design Grid System

```typescript
<Row gutter={[16, 16]}>
  <Col xs={24} sm={12} md={8} lg={6}>
    <ProductCard product={product} />
  </Col>
</Row>
```

## 🧪 Testing

### Test Setup

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watchAll

# Run specific test file
npm test ProductCard.test.tsx
```

### Testing Strategy

- **Unit Tests**: Component logic and utilities
- **Integration Tests**: Component interactions
- **E2E Tests**: User journey testing
- **Accessibility Tests**: WCAG compliance

### Example Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from './ProductCard';

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 99.99,
    images: ['test-image.jpg']
  };

  it('should render product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should call onAddToCart when cart button is clicked', () => {
    const mockOnAddToCart = jest.fn();
    render(
      <ProductCard 
        product={mockProduct} 
        onAddToCart={mockOnAddToCart} 
      />
    );
    
    fireEvent.click(screen.getByTestId('add-to-cart-button'));
    expect(mockOnAddToCart).toHaveBeenCalledWith('1');
  });
});
```

## 🚀 Deployment

### Build Process

```bash
# Create production build
npm run build

# Analyze bundle size
npm run build -- --analyze

# Test production build locally
npx serve -s build
```

### Environment-specific Builds

```bash
# Development
npm run build:dev

# Staging
npm run build:staging

# Production
npm run build:prod
```

### Deployment Options

#### Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=build
```

#### Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel --prod
```

#### Docker Deployment

```dockerfile
# Multi-stage build
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Performance Optimization

- **Code Splitting**: Lazy loading with React.lazy()
- **Bundle Analysis**: Webpack Bundle Analyzer
- **Image Optimization**: WebP format and lazy loading
- **Caching Strategy**: Service worker implementation
- **CDN Integration**: Static asset optimization

## 📊 Performance Monitoring

### Web Vitals

```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Performance monitoring
const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  }
};
```

### Error Tracking

```typescript
// Error boundary implementation
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 🔐 Security Features

### Authentication Security

- **JWT Token Handling**: Secure token storage and refresh
- **Route Protection**: Role-based access control
- **Input Validation**: Client-side validation with Yup
- **XSS Prevention**: Content sanitization

### API Security

```typescript
// Request interceptor for authentication
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      logout();
      navigate('/login');
    }
    return Promise.reject(error);
  }
);
```

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Component Structure**: Use functional components with hooks
3. **TypeScript**: Maintain strict type checking
4. **Testing**: Write tests for new components and features
5. **Documentation**: Update README for significant changes

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### Code Review Checklist

- [ ] TypeScript types are properly defined
- [ ] Components are properly tested
- [ ] Responsive design is implemented
- [ ] Accessibility guidelines are followed
- [ ] Performance optimizations are considered
- [ ] Error handling is implemented

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 📞 Support

- **Documentation**: [Frontend Wiki](https://github.com/Paul-Aransiola/techxchange/wiki/frontend)
- **Issues**: [GitHub Issues](https://github.com/Paul-Aransiola/techxchange/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Paul-Aransiola/techxchange/discussions)

---

<div align="center">
  <p>Built with ❤️ using React, TypeScript, and Ant Design</p>
  <p>
    <a href="https://github.com/Paul-Aransiola/techxchange">⭐ Star the Project</a> •
    <a href="https://github.com/Paul-Aransiola/techxchange/issues">🐛 Report Bug</a> •
    <a href="https://github.com/Paul-Aransiola/techxchange/issues">✨ Request Feature</a>
  </p>
</div>
