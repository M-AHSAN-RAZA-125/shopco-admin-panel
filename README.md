# SHOP.CO — E-Commerce Administrator Portal

A modern, responsive, and full-featured Admin Dashboard for the **Shop.Co** e-commerce platform. Built with **React 19**, **Vite**, **Tailwind CSS**, **Lucide Icons**, and **Recharts**, fully synchronized with the Node.js/Express & MongoDB backend API.

---

## 🌟 Key Features

- **🔐 Real Authentication & Role-Based Access**:
  - Secure JWT login directly through backend `/api/auth/login`.
  - Automatic token management with persistent session restore via `/api/auth/me`.
  - Admin-only route guard.
- **📊 Real-Time Analytics & Dashboard**:
  - Live revenue, order count, total products, and low-stock alerts.
  - Interactive Revenue & Order Trend Area Charts.
  - Real-time product category breakdown chart.
  - Recent customer orders stream.
- **🛍️ Complete Product Catalog Management (CRUD)**:
  - Add new products with title, category, price, old price, discount badge, stock, sizes, colors, and Cloudinary/web image URLs.
  - Edit existing products with instant store reflection.
  - Delete products with safe confirmation modal.
  - Search by keyword/SKU and filter by category or stock level.
- **📦 Order Processing & Status Tracking**:
  - Review all orders placed across the store.
  - Real-time order status switcher (*Placed ➔ Processing ➔ Shipped ➔ Delivered ➔ Cancelled*).
  - Inspect comprehensive customer order modal (shipping address, phone, item details, subtotal, and total).
  - Printable invoice generator.
- **👥 User Directory & Permission Management**:
  - List of registered customers and administrators.
  - Promote customer accounts to Administrator role or revoke privileges.
  - Remove inactive accounts.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ or v20+ recommended.
- **Backend API**: The `shopco-backend` service should be running (default `http://localhost:5000`).

### 2. Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Local Development API endpoint
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies & Run
```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Default Seed Admin Credentials

When the backend database is seeded, you can sign in immediately using:
- **Email**: `admin@shopco.com`
- **Password**: `admin12345`

---

## 🌐 Production Build & Deployment

### Build for Production
```bash
npm run build
```
This generates the optimized production bundle in the `dist/` directory.

### Deploying to Vercel or Netlify
1. Push this project to your GitHub repository.
2. Link the repository on **Vercel** or **Netlify**.
3. Set the **Build Command** to `npm run build` and **Output Directory** to `dist`.
4. Add the Environment Variable in your deployment dashboard:
   - `VITE_API_URL`: Your live backend API URL (e.g. `https://your-backend.vercel.app/api`).

---

## 📁 Project Structure

```
├── public/                 # Static assets & icons
├── src/
│   ├── api/
│   │   └── adminApi.js     # Centralized backend API client & JWT interceptor
│   ├── components/
│   │   ├── Dashboard.jsx   # Live KPI metrics & analytics charts
│   │   ├── Header.jsx      # Top navigation, search, and admin profile
│   │   ├── Sidebar.jsx     # Navigation tabs & mobile drawer
│   │   ├── LoginPage.jsx   # Administrative JWT sign-in
│   │   ├── ProductList.jsx # Products table with filters & pagination
│   │   ├── ProductModal.jsx# Add/Edit product modal
│   │   ├── OrderList.jsx   # Orders table with status updater
│   │   ├── OrderDetailsModal.jsx # Full order inspection & printing
│   │   ├── UserList.jsx    # User directory & role management
│   │   └── EditUserModal.jsx # User permissions modal
│   ├── App.jsx             # Main application orchestrator & live state
│   ├── index.css           # Tailwind CSS styling
│   └── main.jsx            # React root entry point
├── .env.example            # Environment variables template
├── package.json
└── vite.config.js
```
