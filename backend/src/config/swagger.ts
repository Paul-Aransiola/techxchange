import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TechXchange Marketplace API',
      version: '1.0.0',
      description: 'A comprehensive marketplace API for tech products with advanced features including external news integration, role-based authentication, and comprehensive filtering.',
      contact: {
        name: 'TechXchange Team',
        email: 'support@techxchange.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5002/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://api.techxchange.com/api/v1',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT authorization header using the Bearer scheme. Enter your token in the text input below.'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            firstName: { type: 'string', minLength: 3, maxLength: 30 },
            lastName: { type: 'string', minLength: 3, maxLength: 30 },
            email: { type: 'string', format: 'email' },
            phoneNumber: { type: 'string', pattern: '\\+\\d{3}\\d{9}' },
            role: { type: 'string', enum: ['buyer', 'seller', 'admin'] },
            isVerified: { type: 'boolean' },
            lastLogin: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            name: { type: 'string', minLength: 3, maxLength: 30 },
            description: { type: 'string', minLength: 10, maxLength: 430 },
            category: { type: 'string', minLength: 3, maxLength: 30 },
            price: { type: 'number', minimum: 0 },
            seller: { $ref: '#/components/schemas/User' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string', format: 'uuid' },
            text: { type: 'string', minLength: 3, maxLength: 30 },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            user: { $ref: '#/components/schemas/User' },
            product: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        NewsArticle: {
          type: 'object',
          properties: {
            source: {
              type: 'object',
              properties: {
                id: { type: 'string', nullable: true },
                name: { type: 'string' }
              }
            },
            author: { type: 'string', nullable: true },
            title: { type: 'string' },
            description: { type: 'string', nullable: true },
            url: { type: 'string', format: 'uri' },
            urlToImage: { type: 'string', format: 'uri', nullable: true },
            publishedAt: { type: 'string', format: 'date-time' },
            content: { type: 'string', nullable: true }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
            error: { type: 'string' }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            totalItems: { type: 'number' },
            totalPages: { type: 'number' },
            currentPage: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPrevPage: { type: 'boolean' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Application): void => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TechXchange API Documentation'
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;
