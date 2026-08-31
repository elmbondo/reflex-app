# Reflex — Delivery Tracking App

Reflex is a delivery tracking and coordination platform built for small Kenyan retailers to manage parcel dispatches, track rider status updates in real-time, and verify completed deliveries via QR code scanning.

---

## 🚀 Live Production Deployment

- **Production App (Vercel):** [https://reflex-app-hazel.vercel.app](https://reflex-app-hazel.vercel.app)
- **Database:** MongoDB Atlas (`reflex-cluster`)
- **Backend API Base:** `https://reflex-app-hazel.vercel.app/api`

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
│   ├── server.js             → Express backend, Socket.io real-time engine & Mongo connection
│   └── vercel.json           → Vercel serverless function configuration
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

## 🛠️ How to Run Locally

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Ensure your `backend/.env` file has a valid `MONGO_URI` connection string (either local MongoDB or MongoDB Atlas):
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/reflex?retryWrites=true&w=majority
```
Start the backend development server:
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
*Frontend app runs at `http://localhost:3000`.*

---

## 🌐 Deploying to Vercel

The application is fully configured for zero-config deployment on Vercel:

1. Connect the repository to Vercel.
2. Add the environment variable in Vercel settings:
   - `MONGO_URI`: MongoDB Atlas connection URL
3. Deploy!

For step-by-step instructions, see [VERCEL_DEPLOYMENT.md](file:///home/sinux/Projects/PLP/reflex-app/VERCEL_DEPLOYMENT.md).

---

## 👥 Persona Portals

- **`/retailer`**: Retailer dashboard for creating requests & tracking live progress.
- **`/dispatcher`**: Dispatcher management screen for assigning pending deliveries to active riders.
- **`/rider`**: Rider interface with delivery status action buttons and camera QR verification scanner.
