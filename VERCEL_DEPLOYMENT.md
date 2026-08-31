# Vercel Deployment Guide for Reflex

This repository is structured as a fullstack app with `frontend/` (React SPA) and `backend/` (Node.js/Express API).

---

## Deployment Option 1: Monorepo Deployment (Single Vercel Project)

Deploy the entire repository in one click:
1. Import `reflex-app` on [Vercel](https://vercel.app).
2. Leave **Root Directory** as `./` (Root).
3. Vercel will automatically read the root `vercel.json` file.
4. Add Environment Variable in Vercel Dashboard:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/reflex?retryWrites=true&w=majority`
5. Click **Deploy**.

---

## Deployment Option 2: Split Deployment (Separate Vercel Projects)

### Backend (`/backend`)
1. Import `reflex-app` into Vercel and set **Root Directory** to `backend`.
2. Add Environment Variables:
   - `MONGO_URI`: MongoDB Atlas connection string
3. Deploy to get backend URL (e.g., `https://reflex-backend.vercel.app`).

### Frontend (`/frontend`)
1. Import `reflex-app` into Vercel and set **Root Directory** to `frontend`.
2. Framework Preset: **Create React App**.
3. Add Environment Variables:
   - `REACT_APP_API_URL`: `https://reflex-backend.vercel.app/api`
   - `REACT_APP_RETAILER_ID`: `<retailer-object-id>`
   - `REACT_APP_DISPATCHER_ID`: `<dispatcher-object-id>`
   - `REACT_APP_RIDER_ID`: `<rider-object-id>`
4. Deploy.

---

## Config Files Included
- **`vercel.json`** (Root): Monorepo fullstack routing.
- **`frontend/vercel.json`**: SPA React Router rewrites (`/*` -> `/index.html`).
- **`backend/vercel.json`**: Node.js `@vercel/node` serverless function configuration.
