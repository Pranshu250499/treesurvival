# 🛍️ NOVA MART — Modern Premium Full-Stack E-Commerce Platform

NOVA MART is a production-quality, full-stack e-commerce application engineered from the ground up with clean architecture, robust security, and a minimal aesthetic inspired by industry benchmarks like Apple, Nike, and Myntra.

Built with a responsive **React 18 + Vite + Tailwind CSS** frontend and a modular **Node.js + Express + MongoDB/Mongoose** backend.

---

## 🌟 Key Features

### 🛒 Customer Experience
- **Sleek, Responsive Interface**: Mobile-first navigation drawer, sticky elevation navbar, and fluid 4/3/2 column product grids.
- **Hero & Curated Collections**: Engaging hero with CTA buttons, category cards, and "Trending Now" showcase.
- **Mega Deals with Live Countdown**: Dynamic Days : Hours : Minutes : Seconds countdown timer updating in real-time.
- **Advanced Multi-Facet Catalog (Shop)**:
  - Real-time price range slider (₹500 to ₹1,00,000).
  - Multi-select category and brand filters.
  - Rating, discount, and stock availability toggles.
  - Sort by Featured, Price (Low-to-High / High-to-Low), Rating, and Newest.
  - Active URL search params synchronization (`/shop?category=electronics&sort=price-low`).
- **Debounced Instant Search**: Autocomplete popup with category suggestions and instant product previews.
- **Interactive Product Details**:
  - Multi-image gallery with high-resolution thumbnail switcher.
  - Dynamic color picker and size selector.
  - Stock level indicators with low-stock warnings.
  - Verified buyer reviews with star distribution breakdowns (5★ down to 1★).
  - Review submission dialog with live rating picker.
- **Smart Shopping Cart**:
  - Persistent storage across page reloads.
  - Quantity steppers with instant stock validation.
  - Dynamic coupon code engine (`NOVA10`, `SAVE500`, `WELCOME50`).
  - Financial breakdown: Subtotal, Discount, Free Shipping (over ₹999), 18% GST calculation, Grand Total.
  - Save-for-later / 1-click move to wishlist.
- **Saved Wishlist**: Instant add/remove toggle and direct Move to Cart.
- **Multi-Step Checkout**:
  - Step 1: Address Book selector or new address form.
  - Step 2: Order Summary & item breakdown.
  - Step 3: Payment selection (Razorpay online or Cash on Delivery).
- **Payment Gateway Integration**:
  - Native Razorpay checkout modal.
  - Built-in Sandbox Simulation fallback for instant local testing without live merchant keys.
- **Order Tracking**:
  - Visual step-by-step progress timeline: `Order Placed` → `Confirmed` → `Shipped` → `Out for Delivery` → `Delivered`.
  - Self-service order cancellation for processing orders with automatic inventory restocking.
- **Customer Account Center**:
  - Profile management (name, phone, avatar).
  - Address book management (Add, Edit, Delete, Set Default).
  - Security password change.

### 👑 Administrator Dashboard (`/admin`)
- **Protected Access**: Enforced by JWT + role-based `adminOnly` middleware.
- **Business Analytics**:
  - Total Revenue, Total Orders, Total Products, and Total Users metrics.
  - Interactive **Recharts** charts: 7-day Revenue Trend Area Chart and Category Sales Distribution.
  - Recent orders table with real-time status changes.
- **Product Inventory Management**:
  - Searchable, filterable catalog table with image thumbnails and stock badges.
  - Comprehensive Add/Edit Product forms supporting multiple image URLs or file uploads, colors, sizes, specifications, and featured/trending flags.
  - Permanent product deletion with associated review cleanup.
- **Order Fulfillment Manager**:
  - Real-time status changer (`Processing` → `Confirmed` → `Shipped` → `Out for Delivery` → `Delivered` → `Cancelled`).
  - Filter orders by fulfillment status.
- **Customer Account Controls**:
  - Directory of all registered users with order count and lifetime spend.
  - One-click account Enable/Disable access control.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM 6, Axios, Lucide React, React Hot Toast, Recharts, Canvas Confetti |
| **Backend** | Node.js (ES Modules), Express.js, MongoDB, Mongoose, JWT (jsonwebtoken), bcryptjs, Multer, Express Validator, Morgan, CORS |
| **Dev Database** | `mongodb-memory-server` (Automatic zero-config local fallback if no MongoDB service is running) |
| **Payments** | Razorpay SDK + Built-in Sandbox Gateway Mode |

---

## 📁 Project Structure

```
nova-mart/
├── client/
│   ├── public/
│   │   └── logo.svg                # Vector brand logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Sticky responsive header & mobile drawer
│   │   │   ├── Footer.jsx          # Footer with newsletter and trust badges
│   │   │   ├── ProductCard.jsx     # Card with hover zoom, discount & quick add
│   │   │   ├── ProductGrid.jsx     # Responsive 4/3/2 column grid with skeleton
│   │   │   ├── CategoryCard.jsx    # Visual category card
│   │   │   ├── SearchBar.jsx       # Debounced autocomplete search
│   │   │   ├── Rating.jsx          # Interactive / display star rating
│   │   │   ├── Loader.jsx          # Spinners and skeleton cards
│   │   │   ├── EmptyState.jsx      # Reusable empty states
│   │   │   ├── ProtectedRoute.jsx  # Customer authentication guard
│   │   │   ├── AdminRoute.jsx      # Administrator role guard
│   │   │   ├── CartItem.jsx        # Cart line item with stepper
│   │   │   ├── WishlistItem.jsx    # Wishlist card with move-to-cart
│   │   │   ├── OrderCard.jsx       # Order tracking & timeline
│   │   │   └── Modal.jsx           # Accessible dialog component
│   │   ├── pages/
│   │   │   ├── Home.jsx            # Hero, categories, trending, deals timer
│   │   │   ├── Shop.jsx            # Multi-facet filters, sorting, pagination
│   │   │   ├── ProductDetails.jsx  # Gallery, variants, review tabs & modal
│   │   │   ├── Cart.jsx            # Cart items, promo coupons, totals
│   │   │   ├── Wishlist.jsx        # Saved products grid
│   │   │   ├── Checkout.jsx        # 3-step checkout with Razorpay/COD
│   │   │   ├── OrderSuccess.jsx    # Confetti celebration screen
│   │   │   ├── Orders.jsx          # User order history
│   │   │   ├── Profile.jsx         # Personal info & saved address book
│   │   │   ├── Login.jsx           # Sign in with 1-click demo buttons
│   │   │   ├── Register.jsx        # Account registration
│   │   │   ├── ForgotPassword.jsx  # Password reset flow
│   │   │   ├── NotFound.jsx        # 404 page
│   │   │   └── admin/
│   │   │       ├── AdminLayout.jsx # Admin dark header & navigation
│   │   │       ├── Dashboard.jsx   # Metrics cards & Recharts graphs
│   │   │       ├── Products.jsx    # Product list with search & delete
│   │   │       ├── AddProduct.jsx  # New product creation form
│   │   │       ├── EditProduct.jsx # Product editor form
│   │   │       ├── Orders.jsx      # Admin order status management
│   │   │       ├── Users.jsx       # User list & access toggle
│   │   │       └── Customers.jsx   # Alias re-export
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # User authentication state
│   │   │   ├── CartContext.jsx     # Cart items & coupon calculations
│   │   │   └── WishlistContext.jsx # Wishlist persistence
│   │   ├── services/
│   │   │   ├── api.js              # Axios instance with interceptors
│   │   │   ├── authService.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   ├── userService.js
│   │   │   └── adminService.js
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useCart.js
│   │   │   └── useWishlist.js
│   │   ├── utils/
│   │   │   ├── formatCurrency.js   # Indian Rupee format (₹)
│   │   │   ├── validators.js       # Phone, email, PIN validation
│   │   │   └── constants.js        # Categories, statuses, coupons
│   │   ├── App.jsx                 # Routes & layout structure
│   │   ├── main.jsx                # React DOM mount point
│   │   └── index.css               # Tailwind directives & custom styles
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js                   # Mongoose connector + in-memory fallback
│   ├── controllers/
│   │   ├── authController.js       # Authentication & profile logic
│   │   ├── productController.js    # Catalog, filters, reviews CRUD
│   │   ├── orderController.js      # Orders & Razorpay payment verification
│   │   ├── userController.js       # Saved address book management
│   │   ├── adminController.js      # Analytics, order status, user controls
│   │   └── categoryController.js   # Public categories
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT validation
│   │   ├── adminMiddleware.js      # Role authorization
│   │   ├── errorMiddleware.js      # Centralized error handler
│   │   └── uploadMiddleware.js     # Multer file storage
│   ├── models/
│   │   ├── User.js                 # User schema with bcrypt
│   │   ├── Product.js              # Product schema with specifications
│   │   ├── Order.js                # Order schema with timeline
│   │   ├── Review.js               # Customer review schema
│   │   └── Category.js             # Category schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── categoryRoutes.js
│   ├── utils/
│   │   ├── generateToken.js        # JWT signer
│   │   ├── seedProducts.js         # 32 realistic products seed data
│   │   ├── seedAdmin.js            # Admin & demo customer seeder
│   │   └── seedDatabase.js         # Automatic database population
│   ├── server.js                   # Main Express application
│   ├── package.json
│   └── .env.example
├── README.md
└── .gitignore
```

---

## 🔑 Demo & Admin Credentials

> [!CAUTION]
> **DEVELOPMENT / DEMO NOTICE**: The credentials below are provided strictly for local development and evaluation. **Change these passwords and secrets immediately before deploying to a public production environment.**

| Role | Email | Password | Access |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@novamart.com` | `Admin@12345` | Full administrative access at `/admin` |
| **👤 Customer** | `user@novamart.com` | `User@12345` | Standard customer account with test addresses |

*Tip: On the `/login` page, click either **"👤 Customer"** or **"👑 Administrator"** to auto-fill these credentials in 1 click.*

---

## ⚙️ Environment Variables

### Backend Configuration (`server/.env`)
```env
PORT=5000
NODE_ENV=development

# Optional: Provide your local or MongoDB Atlas URI.
# If left blank, the server automatically boots an in-memory MongoDB database!
MONGO_URI=mongodb://127.0.0.1:27017/novamart

# JWT secret key for signing tokens
JWT_SECRET=novamart_jwt_super_secret_production_key_2025

# Razorpay Test Keys (Leave blank to use built-in Sandbox Gateway)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

# Frontend origin URL for CORS
CLIENT_URL=http://localhost:5173
```

### Frontend Configuration (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18 or higher (v20+ recommended)
- **npm**: v9 or higher

### Step 1: Start the Backend Server

Open Terminal 1:
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`. On first boot, it automatically seeds 32 realistic products, categories, reviews, and the administrator account.

### Step 2: Start the Frontend Client

Open Terminal 2:
```bash
cd client
npm install
npm run dev
```
The Vite development server will start on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

---

## 🌐 Complete Backend API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user account.
- `POST /api/auth/login` — Sign in and receive JWT token.
- `GET /api/auth/me` — Get current logged-in user profile (Private).
- `PUT /api/auth/profile` — Update user profile or password (Private).
- `POST /api/auth/forgot-password` — Request password reset.
- `POST /api/auth/reset-password` — Complete password reset with token.

### Products (`/api/products`)
- `GET /api/products` — Retrieve products with filters (`category`, `brand`, `minPrice`, `maxPrice`, `rating`, `discount`, `inStock`, `featured`, `trending`, `sort`, `page`, `limit`).
- `GET /api/products/search?q=:query` — Fast debounced autocomplete search.
- `GET /api/products/:id` — Get product details by MongoDB ID or slug.
- `POST /api/products` — Create product (Admin only).
- `PUT /api/products/:id` — Update product (Admin only).
- `DELETE /api/products/:id` — Delete product (Admin only).
- `POST /api/products/:id/reviews` — Submit a product review (Private).
- `GET /api/products/:id/reviews` — Get all reviews for a product.

### Categories (`/api/categories`)
- `GET /api/categories` — Get list of categories with live product counts.
- `GET /api/categories/:slug` — Get single category details.

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order with items and address (Private).
- `GET /api/orders` — Retrieve logged-in user's order history (Private).
- `GET /api/orders/:id` — Retrieve specific order details (Private).
- `PUT /api/orders/:id/cancel` — Cancel processing order & restock (Private).
- `POST /api/orders/create-payment` — Initiate Razorpay/Mock payment intent (Private).
- `POST /api/orders/verify-payment` — Verify payment signature (Private).

### User Addresses (`/api/users`)
- `GET /api/users/addresses` — List saved user addresses (Private).
- `POST /api/users/addresses` — Add address to user book (Private).
- `PUT /api/users/addresses/:id` — Update existing address (Private).
- `DELETE /api/users/addresses/:id` — Remove address (Private).

### Admin (`/api/admin`)
- `GET /api/admin/dashboard` — Get metrics, recent orders, and sales trends (Admin only).
- `GET /api/admin/orders` — View all orders with status filtering (Admin only).
- `PUT /api/admin/orders/:id/status` — Update order fulfillment status (Admin only).
- `GET /api/admin/users` — View all registered users and spend metrics (Admin only).
- `PUT /api/admin/users/:id/toggle-status` — Enable or disable user account (Admin only).

---

## 🚢 Production Deployment

### Frontend (Vercel / Netlify / Cloudflare Pages)
1. Push your repository to GitHub.
2. In Vercel or Netlify, select the `client` directory as the Root Directory.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variable: `VITE_API_URL=https://your-backend-api-domain.com/api`

### Backend (Render / Railway / Fly.io / VPS)
1. Select the `server` directory as the Root Directory.
2. Build command: `npm install`
3. Start command: `npm start`
4. Environment variables:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/novamart`
   - `JWT_SECRET=<strong-random-32-character-secret>`
   - `CLIENT_URL=https://your-frontend-domain.com`
   - `RAZORPAY_KEY_ID=<your-live-key>`
   - `RAZORPAY_KEY_SECRET=<your-live-secret>`

---

## 🔮 Future Enhancements
- Automated email order confirmation dispatches using Nodemailer / Resend.
- Cloudinary cloud bucket integration for multi-image CDN delivery.
- Redis caching for product catalog and search queries.
- Multi-currency conversion (USD / EUR / GBP).
- Real-time order status push notifications via WebSockets.

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
