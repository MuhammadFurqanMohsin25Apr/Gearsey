# Gearsey - Complete Setup Guide

## Project Overview

**Gearsey** is a full-stack online marketplace for vehicle spare parts in Pakistan, supporting both fixed-price listings and auctions for new, used, and vintage parts.

## Architecture

- **Frontend**: React 19 + React Router 7 + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB
- **Authentication**: BetterAuth (integrated in backend)
- **Payments**: JazzCash, Easypaisa, Credit/Debit Cards

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js** 18 or higher
- **MongoDB** (local or Atlas)
- **npm** or **pnpm**

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file
# Add your MongoDB connection string and other config
PORT=3000
MONGODB_URI=your_mongodb_connection_string

# Start backend server
npm run dev
```

Backend will run on **http://localhost:3000**

### 3. Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5713**

---

## 📁 Frontend Structure

```
frontend/
├── app/
│   ├── components/          # Reusable components
│   │   ├── Header.tsx       # Navigation with search
│   │   ├── Footer.tsx       # Footer with links
│   │   └── ProductCard.tsx  # Product display card
│   │
│   ├── lib/                 # Utilities
│   │   ├── api.ts           # API client for backend
│   │   └── utils.ts         # Helper functions
│   │
│   ├── routes/              # Pages (React Router)
│   │   ├── home.tsx         # Homepage
│   │   ├── products.tsx     # Product listing
│   │   ├── products.$id.tsx # Product detail
│   │   ├── auctions.tsx     # Auctions list
│   │   ├── auctions.$id.tsx # Auction bidding
│   │   ├── cart.tsx         # Shopping cart
│   │   ├── checkout.tsx     # Checkout
│   │   ├── sell.tsx         # Create listing
│   │   └── dashboard.tsx    # Seller dashboard
│   │
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   │
│   ├── app.css              # Global styles
│   └── root.tsx             # Root layout
│
├── public/                  # Static assets
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🎯 Key Features Implemented

### For Buyers 🛍️

✅ **Homepage**
- Featured products
- Category browsing
- Live auction showcase
- Hero section with CTA

✅ **Product Browsing**
- Search functionality
- Category filters
- Condition filters (New/Used/Refurbished)
- Sort by price/date
- Responsive grid layout

✅ **Product Details**
- Image gallery with thumbnails
- Full description
- Seller information
- Add to cart / Buy now
- Related products

✅ **Auctions**
- Real-time countdown timer
- Current bid display
- Place bid functionality
- Auction status tracking
- Quick bid buttons

✅ **Shopping Cart**
- Add/remove items
- Quantity adjustment
- Price calculation
- Shipping costs

✅ **Checkout**
- Shipping information form
- Payment method selection
- Order summary
- Multiple payment options

### For Sellers 🏪

✅ **Create Listing**
- Product details form
- Category selection
- Condition selection
- Price setting
- Multiple image upload (JPG/PNG)
- Auction toggle

✅ **Dashboard**
- Statistics overview
- Active listings table
- Sold items tracking
- Revenue display
- Quick actions

---

## 🔌 API Integration

The frontend uses a centralized API client (`app/lib/api.ts`) that handles all backend communication.

### Base URL
```typescript
const API_BASE_URL = "http://localhost:3000/api";
```

### Available Endpoints

#### Products
```typescript
api.products.getAll({ limit, category, sellerId, query })
api.products.create(formData)
api.products.update(formData)
api.products.delete(productId)
api.products.getImage(filename)
```

#### Categories
```typescript
api.categories.getAll(limit)
api.categories.create({ name, description })
api.categories.update({ id, name, description })
api.categories.delete(id)
```

#### Auctions
```typescript
api.auctions.getAll({ limit, start_time, end_time })
api.auctions.close(auctionId)
api.auctions.cancel(auctionId)
api.auctions.delete(auctionId)
```

#### Orders
```typescript
api.orders.getAll()
api.orders.getByUser(userId)
api.orders.create({ userId, items, total_amount })
api.orders.confirm(orderId)
api.orders.cancel(orderId)
```

#### Reviews
```typescript
api.reviews.getAll()
api.reviews.getByProduct(productId)
api.reviews.create({ userId, partId, rating, comment })
api.reviews.delete(reviewId)
```

---

## 🎨 Component Reference

### Header Component
- Sticky navigation
- Search bar
- Category links
- Cart icon with count
- Mobile responsive menu

### Footer Component
- Site links
- Payment methods
- Social media
- Contact information

### ProductCard Component
```tsx
<ProductCard product={listing} />
```
- Product image
- Name and description
- Price display
- Condition badge
- Auction indicator
- CTA button

---

## 🛠️ Utility Functions

### Formatting (`lib/utils.ts`)

```typescript
formatPrice(12500)          // "PKR 12,500"
formatDate("2025-01-01")    // "January 1, 2025"
formatDateTime(dateString)   // "Jan 1, 2025, 10:30 AM"
formatRelativeTime(date)     // "2 hours ago"
```

### Helpers

```typescript
getTimeRemaining(endDate)    // { days, hours, minutes, seconds, total }
isAuctionActive(start, end)  // boolean
truncateText(text, 50)       // "This is a long text..."
getConditionBadgeColor(condition)  // Tailwind classes
getStatusBadgeColor(status)        // Tailwind classes
```

---

## 🎯 TypeScript Types

All types are defined in `app/types/index.ts`:

```typescript
Listing     // Product listing data
Auction     // Auction data
Category    // Product category
Order       // Order information
Review      // Product review
User        // User data
CartItem    // Shopping cart item
```

---

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

All components adapt to screen size with Tailwind responsive classes.

---

## 🚦 Development Workflow

1. **Start Backend**
   ```bash
   cd backend && npm run dev
   ```

2. **Start Frontend** (in new terminal)
   ```bash
   cd frontend && npm run dev
   ```

3. **Open Browser**
   - Frontend: http://localhost:5713
   - Backend API: http://localhost:3000/api

4. **Test Key Flows**
   - Browse products
   - View product details
   - Add to cart
   - Create listing (seller)
   - View dashboard

---

## 🔄 Data Flow

```
User Action → React Component → API Client → Backend Express 
                                               ↓
User Interface ← React State ← API Response ← MongoDB
```

### Example: Creating a Listing

1. User fills form in `/sell`
2. Form submits with images (FormData)
3. `api.products.create()` sends POST to backend
4. Backend saves to MongoDB + stores images
5. Success response returns to frontend
6. User redirected to dashboard
7. New listing appears in table

---

## 🎨 Styling Guide

### Color Palette

- **Primary**: Blue (#2563eb)
- **Success**: Green (#16a34a)
- **Warning**: Yellow (#eab308)
- **Error**: Red (#dc2626)
- **Neutral**: Gray shades

### Common Patterns

```tsx
// Page wrapper
<div className="bg-gray-50 min-h-screen">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Content */}
  </div>
</div>

// Card
<div className="bg-white rounded-lg shadow-md p-6">
  {/* Card content */}
</div>

// Button Primary
<button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
  Click Me
</button>
```

---

## ✅ Testing the Application

### 1. Homepage
- [ ] Loads featured products
- [ ] Categories display correctly
- [ ] Search bar works
- [ ] Navigation links functional

### 2. Product Listing
- [ ] Products display in grid
- [ ] Filters work (category, condition)
- [ ] Search returns results
- [ ] Pagination/load more works

### 3. Product Detail
- [ ] Images load and switch
- [ ] Add to cart works
- [ ] Buy now navigates to checkout
- [ ] Related products shown

### 4. Auctions
- [ ] Countdown timer updates
- [ ] Bid amount validates
- [ ] Quick bid buttons work
- [ ] Active/closed status correct

### 5. Seller Flow
- [ ] Create listing form submits
- [ ] Images upload successfully
- [ ] Dashboard shows listings
- [ ] Statistics display correctly

---

## 🐛 Common Issues & Solutions

### Issue: CORS errors
**Solution**: Ensure backend CORS is configured for `http://localhost:5713`

### Issue: Images not loading
**Solution**: Check backend static files middleware and image paths

### Issue: TypeScript errors in routes
**Expected**: Route type generation happens on first build/run

### Issue: API calls failing
**Solution**: Verify backend is running on port 3000

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build
npm run start

# Backend
cd backend
npm run build
npm start
```

---

## 🎓 Learning Resources

- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/)

---

## 📝 Next Steps

### Phase 2: Authentication
- Integrate BetterAuth on frontend
- Protected routes
- User profile pages
- Session management

### Phase 3: Enhanced Features
- Real-time bidding with WebSockets
- Advanced search filters
- Product reviews display
- Wishlist/favorites
- Seller ratings

### Phase 4: Optimization
- Image optimization
- Lazy loading
- Service workers
- SEO improvements
- Performance monitoring

---

## 📞 Support

For questions or issues:
- Check backend/frontend READMEs
- Review API documentation
- Test with provided mock data

---

**Happy Coding! 🚀**

Built for the Pakistani automotive community with ❤️
