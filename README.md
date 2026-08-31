# Reflex — Delivery Tracking App

Reflex is a delivery tracking and coordination platform built for small Kenyan retailers to manage parcel dispatches, track rider status updates in real-time, and verify completed deliveries via QR code scanning.

---

## 🌐 Live Fullstack Production Deployment (Vercel)

Both the **Frontend (React SPA)** and **Backend (Express API Serverless Functions)** are hosted live on Vercel:

- **App Production URL:** [https://reflex-app-hazel.vercel.app](https://reflex-app-hazel.vercel.app)
- **Live Backend API Base:** `https://reflex-app-hazel.vercel.app/api`
- **Backend Health Check:** [https://reflex-app-hazel.vercel.app/api/deliveries](https://reflex-app-hazel.vercel.app/api/deliveries)
- **Database Connection:** MongoDB Atlas Cloud (`reflex-cluster.srcq3y7.mongodb.net`)

---

## ⚡ Architecture Overview

This project is deployed as a **fullstack monorepo** on Vercel:
1. **Frontend (React SPA):** Renders the user interface and routes `/retailer`, `/dispatcher`, and `/rider` pages using React Router with SPA rewrites (`frontend/vercel.json`).
2. **Backend Serverless API (`@vercel/node`):** Express routing (`backend/server.js`) served under `/api/*` endpoints. Database connections are managed via serverless Mongoose connection pooling.
3. **Environment Configuration:** Live production secrets (`MONGO_URI`, `REACT_APP_RETAILER_ID`, `REACT_APP_DISPATCHER_ID`, `REACT_APP_RIDER_ID`) are securely stored in Vercel.

---

## 📁 Repository Structure

```
reflex-app/
├── backend/
│   ├── models/
│   │   ├── Delivery.js       → Mongoose delivery schema & status history
│   │   └── User.js           → User schema (Retailer, Dispatcher, Rider)
│   ├── routes/
│   │   └── deliveries.js     → Delivery creation, assignment, status update & QR verification endpoints
│   ├── server.js             → Express backend with serverless database middleware
│   └── vercel.json           → Backend Vercel serverless function configuration
├── frontend/
│   ├── public/               → Favicon, PWA manifest, SEO meta tags
│   ├── src/
│   │   ├── pages/
│   │   │   ├── RetailerView.js   → Delivery request creation & status tracking
│   │   │   ├── DispatcherView.js → Dispatcher rider assignment dashboard
│   │   │   └── RiderView.js      → Rider status updater & camera QR scanner
│   │   ├── api.js            → Shared Axios API helper
│   │   ├── socket.js         → Shared Socket.io client instance
│   │   ├── App.js            → React Router navigation & persona switcher
│   │   └── index.css         → Styling, animations & mobile-first UI layout
│   └── vercel.json           → Single Page Application (SPA) Vercel rewrite configuration
├── vercel.json               → Monorepo root fullstack Vercel deployment configuration
└── VERCEL_DEPLOYMENT.md      → Detailed guide for Vercel deployment options
```

---

## 👥 Persona Portals

- **`/retailer`**: Retailer portal to submit package delivery requests and view live status tracking.
- **`/dispatcher`**: Dispatcher management screen for assigning pending orders to active riders.
- **`/rider`**: Rider mobile workflow with delivery action buttons and live camera QR code scanner.

---

## 🛠️ How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Add your MongoDB connection string in `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/reflex?retryWrites=true&w=majority
```
Run backend server:
```bash
npm run dev
```
*Backend runs at `http://localhost:5000`.*

### 2. Frontend Setup (Separate Terminal)
```bash
cd frontend
npm install
npm start
```
*Frontend runs at `http://localhost:3000`.*
