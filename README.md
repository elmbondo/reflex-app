# Reflex — Delivery Tracking App

## What's already set up for you

This is a starting skeleton, not a finished app — the folders and basic wiring exist so nobody starts from zero, but every "TODO" comment is real work still to be done.

```
reflex-app/
  backend/
    server.js          → main entry point, already connects Express + MongoDB + Socket.io
    models/
      Delivery.js       → Person 2's data model (already written)
      User.js           → Person 2's data model (already written)
    routes/
      deliveries.js     → Person 3 builds out the API logic here
    .env.example        → copy this to .env and fill in your own values (never commit .env)
  frontend/
    src/
      api.js            → shared helper so every screen talks to the backend the same way
      socket.js         → shared real-time connection, Person 5 builds on this
      pages/
        RetailerView.js   → Person 1's screen
        DispatcherView.js → Person 4's screen
        RiderView.js       → Person 5's screen
      App.js             → connects all three screens together
```

## How to get it running on your laptop

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
This starts the server at `http://localhost:5000`. You'll need MongoDB running locally, or use a free MongoDB Atlas cluster and paste that connection string into your `.env`.

**Frontend (separate terminal):**
```bash
cd frontend
npm install
npm start
```
This opens the app at `http://localhost:3000`.

## Before you start coding

1. Make sure you can run both backend and frontend locally first — if it doesn't start, fix that before writing new code
2. Create your own branch: `git checkout -b your-branch-name`
3. Work inside your assigned file(s) — check the folder map above for where your role's code lives
4. Push often, open a pull request when a piece works, so it can get merged in

## Where each person works

| Person | File(s) |
|---|---|
| Person 1 | `frontend/src/pages/RetailerView.js` |
| Person 2 | `backend/models/Delivery.js`, `backend/models/User.js` (already drafted — refine as needed) + merging everyone's PRs |
| Person 3 | `backend/routes/deliveries.js` |
| Person 4 | `frontend/src/pages/DispatcherView.js` |
| Person 5 | `frontend/src/pages/RiderView.js` + `frontend/src/socket.js` (real-time wiring) |

## A note on the "TODO" comments

Every TODO in the code is a real gap — placeholder IDs, missing QR scan logic, no login system yet. These are honest, expected gaps for a one-week sprint, and several of them are good material for your trade-off log (e.g. "we hardcoded user IDs instead of building login, because auth wasn't the focus this week").
