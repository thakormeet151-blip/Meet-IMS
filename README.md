# 🏭 CoreInventory — Inventory Management System

A professional full-stack inventory management system built with **React + Vite**, **Node.js + Express**, and **MongoDB**.

---

## ⚙️ Prerequisites

- **Node.js** v18+ → https://nodejs.org
- **MongoDB** local → https://www.mongodb.com/try/download/community  
  OR **MongoDB Atlas** free cloud → https://www.mongodb.com/atlas

---

## 🚀 Installation

### Step 1 — Set up environment variables

```bash
cd backend
copy .env.example .env
```

Open `backend/.env` and fill in:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/coreinventory
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173
```

### Step 2 — Install dependencies

Run these **three separate** installs (recommended for Windows):

```bash
# Clone the repo
git clone https://github.com/thakormeet151-blip/Meet-IMS.git
cd Meet-IMS

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 3 — Start the servers (two terminals)

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: http://localhost:5173

---

## 🔧 Troubleshooting

### "ERESOLVE could not resolve" (npm peer dep error)
Run frontend install with the legacy flag:
```bash
cd frontend
npm install --legacy-peer-deps
```

### "spawn cmd.exe ENOENT" with `npm run dev`
This happens on some Windows setups with `concurrently`.  
**Solution:** Use two separate terminals as shown in Step 3 above.

### MongoDB connection error
Make sure MongoDB is running:
```bash
# Windows - start MongoDB service
net start MongoDB

# Or run manually
mongod
```

### Gmail email not sending
1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Search "App passwords" → Create one for "Mail"
4. Use that 16-character password as `EMAIL_PASS` (NOT your regular Gmail password)

---

## 🖥️ Pages

| Page | URL |
|------|-----|
| Login | http://localhost:5173/login |
| Signup | http://localhost:5173/signup |
| Forgot Password | http://localhost:5173/forgot-password |
| Dashboard | http://localhost:5173/dashboard |
| Products | http://localhost:5173/products |
| Receipts | http://localhost:5173/receipts |
| Deliveries | http://localhost:5173/deliveries |
| Transfers | http://localhost:5173/transfers |
| Adjustments | http://localhost:5173/adjustments |
| Settings | http://localhost:5173/settings |

---

## 🔌 API Endpoints

All routes prefixed with `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/signup` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| POST | `/auth/forgot-password` | Send reset email |
| PUT | `/auth/reset-password/:token` | Reset password |
| PUT | `/auth/update-password` | Change password |
| GET/POST | `/products` | List / Create |
| PUT/DELETE | `/products/:id` | Update / Delete |
| GET | `/products/categories` | All categories |
| GET/POST | `/receipts` | List / Create |
| PUT | `/receipts/:id/validate` | Validate receipt (adds stock) |
| PUT | `/receipts/:id/cancel` | Cancel receipt |
| GET/POST | `/deliveries` | List / Create (deducts stock) |
| PUT | `/deliveries/:id/status` | Update delivery status |
| GET/POST | `/transfers` | List / Create |
| PUT | `/transfers/:id/complete` | Complete transfer |
| GET/POST | `/adjustments` | List / Create |
| GET | `/dashboard/stats` | All dashboard analytics |

---

## 📁 Project Structure

```
coreinventory-app/
├── .npmrc
├── package.json
├── README.md
├── backend/
│   ├── .env.example
│   ├── .npmrc
│   ├── package.json
│   ├── server.js
│   ├── middleware/auth.js
│   ├── models/          (User, Product, Receipt, Delivery, Transfer, Adjustment)
│   ├── controllers/     (auth, product, receipt, delivery, transfer, adjustment, dashboard)
│   └── routes/          (auth, products, receipts, deliveries, transfers, adjustments, dashboard)
└── frontend/
    ├── .npmrc
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── assets/logo.png
        ├── context/AuthContext.jsx
        ├── services/api.js
        ├── components/layout/Layout.jsx
        └── pages/  (Login, Signup, ForgotPassword, ResetPassword,
                     Dashboard, Products, Receipts, Deliveries,
                     Transfers, Adjustments, Settings)
```

---

## 🗄️ MongoDB Collections

| Collection | Purpose |
|---|---|
| `users` | Auth with hashed passwords + roles |
| `products` | SKU-based inventory items |
| `receipts` | Incoming stock — validates to add qty |
| `deliveries` | Outgoing orders — deducts qty on create |
| `transfers` | Location moves — qty unchanged |
| `adjustments` | Physical count corrections with history |

---

© 2026 CoreInventory · Powered by TruckBee
