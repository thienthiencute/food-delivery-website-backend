# Swagger API Documentation

## Overview

This project now includes comprehensive Swagger/OpenAPI documentation for all API endpoints. The documentation is automatically generated from JSDoc comments in the router files.

## Accessing Swagger UI

Once your application is running, access the Swagger UI at:

```
http://localhost:5000/api-docs
```

## Features

- **Interactive API Testing**: Test endpoints directly from the UI
- **Request/Response Examples**: See exactly what parameters to send and what to expect
- **Authentication Support**: JWT Bearer token authentication integrated
- **Schema Definitions**: Clear definitions of all data models used in the API

## Setup

The Swagger setup is already configured in:

- `src/config/swagger.js` - Main Swagger configuration
- `src/server.js` - Swagger UI integration
- All router files - JSDoc comments with endpoint documentation

## API Endpoints

### Authentication Routes (`/auth`)

- `GET /auth` - Verify authentication
- `POST /auth/send-otp` - Send OTP to email
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/login-user` - Login with email/password
- `POST /auth/register-user` - Register new user
- `POST /auth/logout-user` - Logout
- `POST /auth/forgot-password/send-otp` - Send password reset OTP
- `POST /auth/forgot-password/verify-otp` - Verify password reset OTP
- `POST /auth/forgot-password/reset-password` - Reset password
- `GET /auth/google` - Google OAuth login
- `GET /auth/facebook` - Facebook OAuth login

### User Routes (`/user`) - _Requires Authentication_

- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile (with avatar upload)
- `PUT /user/password` - Change password
- `GET /user/addresses` - Get user addresses
- `POST /user/addresses` - Add new address
- `PUT /user/addresses/{id}` - Update address
- `DELETE /user/addresses/{id}` - Delete address
- `PUT /user/addresses/{id}/default` - Set default address

### Dish Routes (`/dish`)

- `GET /dish` - Get all dishes (with pagination)
- `GET /dish/{id}` - Get dish by ID
- `GET /dish/similar/{id}` - Get similar dishes

### Cart Routes (`/cart`) - _Requires Authentication_

- `GET /cart/cart` - Get cart items
- `PUT /cart/update-quantity` - Update item quantity
- `DELETE /cart/delete-item/{id}` - Delete cart item

### Voucher Routes (`/voucher`) - _Requires Authentication_

- `POST /voucher/check-voucher` - Validate voucher code

### Category Routes (`/category`)

- `GET /category` - Get all categories

### Upload Routes (`/upload`)

- `POST /upload` - Upload image file

## Environment Variables

Make sure your `.env` file includes:

```
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=localhost
DB_DIALECT=mysql
CLIENT_URL=http://localhost:3000
```

## Using Swagger UI

1. **Authorize**: Click the "Authorize" button to add your JWT token for authenticated endpoints
2. **Try it out**: Click "Try it out" on any endpoint
3. **Fill Parameters**: Enter required parameters
4. **Execute**: Click "Execute" to test the endpoint
5. **View Response**: See the response and status code on the right side

## Schema Definitions

The following data models are documented:

- `User` - User profile information
- `Dish` - Food dish details
- `Cart` - Shopping cart items
- `Category` - Food categories
- `Address` - User delivery addresses
- `Voucher` - Discount vouchers
- `Error` - Standard error response format

## Testing Authenticated Endpoints

For endpoints that require authentication:

1. First, use the login endpoint to get a JWT token
2. Click the "Authorize" button in Swagger UI
3. Paste the token in format: `Bearer your_jwt_token_here`
4. All subsequent requests will include the authentication header

## Customizing Documentation

To add or modify API documentation:

1. Edit the corresponding router file
2. Update or add JSDoc comments above the route handler
3. The documentation will auto-generate when the server restarts

Example format:

```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Description of the endpoint
 *     tags:
 *       - Tag Name
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: param_name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success response
 */
```

## Additional Resources

- [OpenAPI 3.0 Specification](https://spec.openapis.org/oas/v3.0.3)
- [Swagger JSDoc Documentation](https://github.com/Surnet/swagger-jsdoc)
- [Swagger UI Documentation](https://github.com/swagger-api/swagger-ui)
