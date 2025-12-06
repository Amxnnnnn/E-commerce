import * as swaggerJsdocModule from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerJsdoc = (swaggerJsdocModule as any).default || swaggerJsdocModule;

const options: any = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: 'Complete API documentation for E-Commerce Backend with authentication, product management, and address management',
            contact: {
                name: 'API Support',
                email: 'support@ecommerce.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Development server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter your JWT token in the format: Bearer <token>'
                }
            },
            schemas: {
                // User Schema
                User: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'John Doe' },
                        email: { type: 'string', format: 'email', example: 'john@example.com' },
                        role: { type: 'string', enum: ['USER', 'ADMIN'], example: 'USER' },
                        defaultShippingAddress: { type: 'integer', nullable: true, example: null },
                        defaultBillingAddress: { type: 'integer', nullable: true, example: null },
                        isActive: { type: 'boolean', example: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Address Schema
                Address: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        lineOne: { type: 'string', example: '123 Main Street' },
                        lineTwo: { type: 'string', nullable: true, example: 'Apt 4B' },
                        city: { type: 'string', example: 'New York' },
                        country: { type: 'string', example: 'USA' },
                        pincode: { type: 'string', example: '100001' },
                        userId: { type: 'integer', example: 1 },
                        created: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                // Product Schema
                Product: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        name: { type: 'string', example: 'Laptop' },
                        description: { type: 'string', example: 'High-performance laptop' },
                        price: { type: 'string', example: '999.99' },
                        tags: { type: 'string', example: 'electronics,computers' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                },
                // CartItem Schema
                CartItem: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        productId: { type: 'integer', example: 1 },
                        quantity: { type: 'integer', example: 2 },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        product: { $ref: '#/components/schemas/Product' }
                    }
                },
                // Order Schema
                Order: {
                    type: 'object',
                    properties: {
                        id: { type: 'integer', example: 1 },
                        userId: { type: 'integer', example: 1 },
                        netAmount: { type: 'string', example: '1999.98' },
                        address: { type: 'string', example: '123 Main St, Apt 4B, New York, USA - 100001' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        products: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', example: 1 },
                                    orderId: { type: 'integer', example: 1 },
                                    productId: { type: 'integer', example: 1 },
                                    quantity: { type: 'integer', example: 2 },
                                    product: { $ref: '#/components/schemas/Product' }
                                }
                            }
                        },
                        event: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', example: 1 },
                                    orderId: { type: 'integer', example: 1 },
                                    status: {
                                        type: 'string',
                                        enum: ['PENDING', 'ACCEPTED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELED'],
                                        example: 'PENDING'
                                    },
                                    createdAt: { type: 'string', format: 'date-time' }
                                }
                            }
                        }
                    }
                },
                // Error Schema
                Error: {
                    type: 'object',
                    properties: {
                        message: { type: 'string', example: 'Error message' },
                        errorCode: { type: 'integer', example: 1001 },
                        errors: { type: 'object', nullable: true }
                    }
                }
            }
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints (signup, login, profile)'
            },
            {
                name: 'Products',
                description: 'Product management endpoints (Admin only)'
            },
            {
                name: 'Users',
                description: 'User profile management'
            },
            {
                name: 'Addresses',
                description: 'Address management for users'
            },
            {
                name: 'Cart',
                description: 'Shopping cart management endpoints'
            },
            {
                name: 'Orders',
                description: 'Order management endpoints'
            }
        ]
    },
    apis: ['./src/routes/*.ts'] // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
    // Swagger UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'E-Commerce API Docs'
    }));

    // JSON endpoint
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });

    console.log(' Swagger documentation available at http://localhost:3000/api-docs');
};
