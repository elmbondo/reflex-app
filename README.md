# Reflex — Delivery Tracking & Role-Based Management Platform

Reflex is a delivery tracking and coordination platform built for small Kenyan retailers. It supports a **full role-based registration and approval system**, real-time delivery management with Socket.io, QR code verification, and dedicated portals for each user persona.

---

## 🌐 Live Production Deployment (Vercel)

Both the **Frontend (React SPA)** and **Backend (Express API)** are hosted live on Vercel:

- **App URL:** [https://reflex-app-hazel.vercel.app](https://reflex-app-hazel.vercel.app)
- **Live Backend API:** `https://reflex-app-hazel.vercel.app/api`
- **Database:** MongoDB Atlas Cloud (`reflex-cluster.srcq3y7.mongodb.net`)

---

## ⚡ Architecture Overview

This project is deployed as a **fullstack monorepo** on Vercel:

1. **Frontend (React SPA):** Role-aware routing, portal pages, registration/login flows, and protected routes via React Router and `AuthContext`.
2. **Backend (Express + Serverless `@vercel/node`):** Auth (JWT), Admin approval endpoints, delivery management, real-time Socket.io updates.
3. **Database:** MongoDB Atlas via Mongoose — persists users, delivery records, and approval status.
4. **Environment:** Secrets (`MONGO_URI`, `JWT_SECRET`) are stored as Vercel Environment Variables.

---

## 📁 Repository Structure

```
reflex-app/
├── backend/
│   ├── models/
│   │   ├── Delivery.js         → Mongoose delivery schema & status history
│   │   └── User.js             → User schema with role, status, and profile fields
│   ├── routes/
│   │   ├── auth.js             → Registration (role-specific), login, token validation
│   │   ├── admin.js            → Admin: list applicants, approve/reject
│   │   └── deliveries.js       → Delivery creation, assignment, status update & QR verification
│   ├── middleware/
│   │   └── auth.js             → JWT verification middleware & role guard
│   ├── seedAdmin.js            → One-time script to seed the system admin account
│   ├── test_e2e.js             → 23-assertion end-to-end test suite
│   ├── server.js               → Express backend entry point with DNS fix for Atlas
│   └── vercel.json             → Backend Vercel serverless function configuration
├── frontend/
│   ├── public/                 → Favicon, PWA manifest, SEO meta tags
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.js  → JWT auth context: login, logout, role, status state
│   │   ├── components/
│   │   │   ├── Navigation.js   → Persistent header with Home, portal links, status badges
│   │   │   └── ProtectedRoute.js → Route guard: checks role, status (approved)
│   │   ├── pages/
│   │   │   ├── HomePage.js         → Landing page with hero, features, and CTA
│   │   │   ├── About.js            → Platform and team overview
│   │   │   ├── HowItWorks.js       → Step-by-step process guide
│   │   │   ├── FAQs.js             → Frequently asked questions
│   │   │   ├── RegisterView.js     → Multi-step role registration form
│   │   │   ├── LoginView.js        → Email/password login with portal redirect
│   │   │   ├── PendingView.js      → Pending/rejected application status page
│   │   │   ├── AdminView.js        → Admin dashboard for approvals, stats & filtering
│   │   │   ├── RetailerView.js     → Delivery request creation & live status tracking
│   │   │   ├── DispatcherView.js   → Rider assignment dashboard for dispatchers
│   │   │   └── RiderView.js        → Rider workflow with QR code scanner
│   │   ├── api.js              → Axios client with JWT Bearer token interceptor
│   │   ├── socket.js           → Shared Socket.io client instance
│   │   ├── App.js              → React Router: all routes, ProtectedRoute wrappers
│   │   └── index.css           → Styling, animations, mobile-first layout
│   └── vercel.json             → SPA rewrite config for React Router
├── vercel.json                 → Monorepo root fullstack Vercel config
├── VERCEL_DEPLOYMENT.md        → Detailed Vercel deployment guide
└── README.md                   → This file
```

---

## 👥 User Roles & Portals

| Role           | Portal URL    | Access Level              |
|----------------|---------------|---------------------------|
| **Admin**      | `/admin`      | Full platform management  |
| **Retailer**   | `/retailer`   | Submit & track deliveries |
| **Dispatcher** | `/dispatcher` | Assign riders to orders   |
| **Rider**      | `/rider`      | Update statuses & scan QR |

---

## 🔐 Registration & Approval Flow

Reflex enforces a **multi-step registration and admin approval flow** before any user can access their portal:

```
Register → Choose Role → Fill Role Form → Submit (PENDING) → Admin Review → APPROVED / REJECTED
```

### Registration Fields by Role

**Retailer:**
- Full name, Phone, Shop/business name, Shop location, Business type

**Rider:**
- Full name, Phone, Address/location, Motorcycle registration number, Chassis/frame details, Motorcycle color, Motorcycle model

**Dispatcher:**
- Full name, Phone, Address/location

### Account States

| State        | Description                                        |
|--------------|----------------------------------------------------|
| `pending`    | Awaiting admin review after registration           |
| `approved`   | Access granted — user can enter their portal       |
| `rejected`   | Application declined — shown rejection message     |

After registration, users land on the **Pending Review** page. Once approved by an Admin, the user logs in and is redirected to their role-specific portal.

---

## 🛡️ Admin Dashboard

The Admin portal (`/admin`) provides:

- **Stats overview** — Total pending, approved, rejected counts per role
- **Tabbed filters** — View by status: Pending / Approved / Rejected / All
- **Role filters** — Filter by Retailer / Rider / Dispatcher
- **Applicant detail view** — See all submitted profile fields
- **One-click Approve / Reject** — Actions update user status instantly in MongoDB

### Admin Credentials (Seeded)

```
Email:    admin@reflex.co.ke
Password: Admin@Reflex2026!
```

> To re-seed the admin account: `cd backend && node seedAdmin.js`

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/reflex?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

Seed the admin account:
```bash
node seedAdmin.js
```

Start the backend:
```bash
npm start
```
*Backend runs at `http://localhost:5000`*

### 2. Frontend Setup (New Terminal)

```bash
cd frontend
npm install
npm start
```
*Frontend runs at `http://localhost:3000`*

---

## 🔌 API Endpoints Reference

### Auth Routes (`/api/auth`)

| Method | Endpoint               | Description                    | Auth Required |
|--------|------------------------|--------------------------------|---------------|
| POST   | `/api/auth/register`   | Register a new role applicant  | No            |
| POST   | `/api/auth/login`      | Login and receive JWT token    | No            |
| GET    | `/api/auth/me`         | Get authenticated user profile | Yes           |

### Admin Routes (`/api/admin`) — Admin only

| Method | Endpoint                       | Description                    |
|--------|--------------------------------|--------------------------------|
| GET    | `/api/admin/applications`      | List all applicants (filterable)|
| PUT    | `/api/admin/approve/:id`       | Approve an application         |
| PUT    | `/api/admin/reject/:id`        | Reject an application          |
| GET    | `/api/admin/stats`             | Get aggregate approval stats   |

### Delivery Routes (`/api/deliveries`)

| Method | Endpoint                          | Description                         |
|--------|-----------------------------------|-------------------------------------|
| GET    | `/api/deliveries`                 | List all deliveries                 |
| POST   | `/api/deliveries`                 | Create a new delivery request       |
| PUT    | `/api/deliveries/:id/assign`      | Assign a rider to a delivery        |
| PUT    | `/api/deliveries/:id/status`      | Update delivery status              |
| GET    | `/api/deliveries/verify/:qrCode`  | QR code delivery verification       |

---

## 🔄 Real-Time Features (Socket.io)

- Delivery status changes are broadcast in real-time to all connected clients
- Dispatcher dashboard auto-refreshes when rider updates a delivery
- Rider portal listens for new assignments without page reload

---

## ✅ Running Tests

Run the 23-assertion end-to-end test suite against the running backend:

```bash
cd backend
node test_e2e.js
```

Tests cover: registration, login, JWT auth, admin approval flow, delivery creation, assignment, status updates, and QR verification.

---

## 🌍 Deployment (Vercel)

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for the full deployment guide.

**Quick Deploy:**
1. Push to `main` — Vercel auto-deploys
2. Set `MONGO_URI` and `JWT_SECRET` in Vercel Project Settings → Environment Variables
3. Visit `https://reflex-app-hazel.vercel.app`
