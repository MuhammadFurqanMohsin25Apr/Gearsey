# Gearsey

A modern vehicle marketplace platform for vehicle dealers, customers, and automobile enthusiasts. Gearsey provides a comprehensive e-commerce solution with product listings, real-time auctions, order management, and payment processing.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Configuration](#-configuration)
- [Development](#-development)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## Features

### For Customers
-  **Product Browsing & Purchase** - Browse vehicle parts and accessories with advanced filtering
-  **Smart Search** - Search products by name, category, or specifications
-  **Shopping Cart** - Add multiple items and manage your cart before checkout
-  **Secure Payments** - Integrated payment processing with order tracking
-  **Order Management** - Track order status from processing to delivery
-  **Reviews & Ratings** - Leave feedback on purchased products
-  **Real-time Auctions** - Participate in live vehicle auctions with automatic bidding

### For Sellers
-  **Product Management** - Create, update, and manage product listings
-  **Category Management** - Organize products into categories
-  **Sales Analytics** - Track revenue, orders, and product performance
-  **Auction Creation** - Set up time-bound auctions with reserve prices
-  **Performance Metrics** - Monitor sales trends and customer engagement

### For Administrators
- **User Management** - Manage customer and seller accounts
- **Dashboard Analytics** - Comprehensive overview of platform metrics
- **Order Administration** - Oversee all orders and delivery statuses
- **Auction Oversight** - Monitor and manage active auctions
- **Revenue Tracking** - View gross revenue and sales by category
- **Penalty System** - Manage violations and enforce platform rules

---

## Tech Stack

### Frontend
- **Framework**: React 19 with React Router 7
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: Radix UI primitives (Dialog, Tooltip, Separator)
- **Icons**: Lucide React
- **Authentication**: Better Auth client
- **Build Tool**: Vite 7
- **Type Safety**: TypeScript 5.9

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: Better Auth
- **Validation**: Zod
- **File Upload**: Multer
- **Rate Limiting**: express-rate-limit & express-slow-down
- **Type Safety**: TypeScript 5.9

### DevOps
- **Containerization**: Docker
- **Process Management**: tsx for development
- **Testing**: Custom backend test suite

---

## Project Structure

```
Gearsey/
├── backend/                    # Backend API service
│   ├── src/
│   │   ├── api/               # Route modules by domain
│   │   │   ├── auction/       # Auction endpoints
│   │   │   ├── bids/          # Bidding system
│   │   │   ├── category/      # Product categories
│   │   │   ├── listing/       # Product listings
│   │   │   ├── notification/  # User notifications
│   │   │   ├── orders/        # Order management
│   │   │   ├── payment/       # Payment processing
│   │   │   ├── penalty/       # Penalty system
│   │   │   ├── review/        # Product reviews
│   │   │   └── users/         # User management
│   │   ├── controllers/       # Business logic handlers
│   │   ├── models/            # Mongoose data models
│   │   ├── lib/               # Utilities and services
│   │   ├── db/                # Database configuration
│   │   ├── jobs/              # Scheduled background jobs
│   │   └── server.ts          # Express app entry point
│   ├── public/                # Static file uploads
│   └── package.json
│
├── frontend/                   # React frontend application
│   ├── app/
│   │   ├── routes/            # Page components
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── home.tsx       # Landing page
│   │   │   ├── products.tsx   # Product catalog
│   │   │   ├── auctions.tsx   # Auction listings
│   │   │   ├── cart.tsx       # Shopping cart
│   │   │   ├── checkout.tsx   # Checkout flow
│   │   │   ├── orders.tsx     # Order history
│   │   │   └── profile.tsx    # User profile
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Base UI primitives
│   │   │   └── admin/         # Admin-specific components
│   │   ├── lib/               # Utilities and API client
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   └── root.tsx           # Root layout
│   ├── public/                # Static assets
│   └── package.json
│
└── test-backend.ps1           # Backend testing script
```

---

## Getting Started

### Prerequisites

- **Node.js** 20.x or higher
- **MongoDB** 6.x or higher
- **npm** or **yarn** package manager
- **Git** for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MuhammadFurqanMohsin25Apr/Gearsey.git
   cd Gearsey
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Credentials for Admin/Seller/Buyer**
   ```
   Admin : gearsey@gmail.com
   Password : 123456

   Seller : seller3@gmail.com
   Password : 123456

   Buyer : buyer2@gmail.com
   Password : 123456
   ```
---

## Configuration

### Backend Configuration

The backend uses environment variables for configuration. Key settings include:

- **MONGO_URI**: MongoDB connection string
- **PORT**: Server port (default: 3000)
- **BETTER_AUTH_SECRET**: Secret key for authentication
- **NODE_ENV**: Environment mode (development/production)

### Frontend Configuration

Frontend configuration is managed through `vite.config.ts` and connects to the backend API:

- API base URL: `http://localhost:3000/api` (development)
- Adjust in `frontend/app/lib/api.ts` for production

---

## 💻 Development

### Running the Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on `http://localhost:5173`


### Code Quality

**Type checking:**
```bash
# Frontend
cd frontend
npm run typecheck

# Backend
cd backend
npx tsc --noEmit
```

### Testing

**Backend tests:**
```bash
cd backend
npm test



1. **Set up MongoDB**
   ```bash
   docker run -d \
     --name mongodb \
     -p 27017:27017 \
     -v mongodb_data:/data/db \
     mongo:latest
   ```

2. **Run backend**
   ```bash
   cd backend
   docker run -d \
     --name gearsey-backend \
     -p 3000:3000 \
     --env-file .env \
     --link mongodb:mongodb \
     gearsey-backend
   ```

3. **Run frontend**
   ```bash
   docker run -d \
     --name gearsey-frontend \
     -p 80:3000 \
     --link gearsey-backend:api \
     gearsey-frontend
   ```

### Production Considerations

- Use a process manager like PM2 for Node.js applications
- Set up reverse proxy with Nginx
- Enable SSL/TLS certificates
- Configure MongoDB replica sets for high availability
- Set up monitoring and logging (e.g., Winston, Morgan)
- Implement CDN for static assets
- Enable rate limiting and security headers

---

## API Documentation

### Authentication Endpoints
- `POST /api/auth/sign-in` - User login
- `POST /api/auth/sign-up` - User registration
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/session` - Get current session

### Product Endpoints
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product (seller/admin)
- `PUT /api/products` - Update product (seller/admin)
- `DELETE /api/products` - Delete product (seller/admin)

### Order Endpoints
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/:userId` - Get user orders
- `POST /api/orders` - Create new order
- `PUT /api/orders` - Update order status
- `DELETE /api/orders` - Delete order

### Auction Endpoints
- `GET /api/auction` - List all auctions
- `GET /api/auction/:id` - Get auction details
- `POST /api/auction` - Create auction
- `PUT /api/auction/close` - Close auction
- `PUT /api/auction/cancel` - Cancel auction

### Category Endpoints
- `GET /api/category` - List categories
- `POST /api/category` - Create category (admin)
- `PUT /api/category` - Update category (admin)
- `DELETE /api/category` - Delete category (admin)

For detailed endpoint documentation, see README files in `backend/src/api/*/README.md`

---

### Coding Standards

- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.



**Repository**: [MuhammadFurqanMohsin25Apr/Gearsey](https://github.com/MuhammadFurqanMohsin25Apr/Gearsey)
