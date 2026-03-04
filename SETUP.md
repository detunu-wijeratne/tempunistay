# UniStay — Full Setup Guide

This guide walks you from **zero** to a fully running MERN stack app with a real MongoDB database.

---

## Prerequisites

- [Node.js 18+](https://nodejs.org/) installed
- A free [MongoDB Atlas](https://www.mongodb.com/atlas) account (or local MongoDB)
- A code editor (VS Code recommended)

---

## 1. Get a MongoDB Connection String

### Option A — MongoDB Atlas (Recommended, Free)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) → **Create a free account**
2. Create a **free M0 cluster** (choose any region)
3. Under **Security → Database Access** → Add a new user:
   - Username: `unistay`
   - Password: (generate a strong password, copy it)
   - Role: **Atlas admin**
4. Under **Security → Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`)
5. Under **Deployment → Database** → click **Connect** → **Drivers**
6. Copy the connection string — it looks like:
   ```
   mongodb+srv://unistay:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<password>` with the password you created

### Option B — Local MongoDB

If you have MongoDB installed locally:
```
mongodb://localhost:27017/unistay
```

---

## 2. Configure Environment Variables

Create the file `backend/.env`:

```bash
# backend/.env
PORT=5000
MONGO_URI=mongodb+srv://unistay:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/unistay?retryWrites=true&w=majority
JWT_SECRET=unistay_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

> ⚠️ **Never commit `.env` to git.** It's already in `.gitignore`.

---

## 3. Install Dependencies

From the project root:

```bash
npm run install-all
```

This installs packages for the root, server, and client in one go.

---

## 4. Seed the Database

Populate the database with demo users, properties, and meal plans:

```bash
cd server
npm run seed
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👥 Created 4 users
🏠 Created 3 properties
🍽️  Created 2 meal plans

🎉 Seed complete! Login credentials:
  Student:       student@demo.com  /  demo1234
  Landlord:      landlord@demo.com /  demo1234
  Meal Provider: meal@demo.com     /  demo1234
  Facility:      facility@demo.com /  demo1234
```

---

## 5. Run the App

From the project root, run both frontend and backend together:

```bash
npm run dev
```

| Service  | URL                         |
|----------|-----------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:5000        |
| API Health | http://localhost:5000/api/health |

---

## 6. Log In

Go to **http://localhost:3000/login** and use any of the demo credentials from step 4, or use the **Quick Access** buttons on the login page.

---

## Project Structure

```
unistay-mern/
├── frontend/                    # React frontend (CRA)
│   └── src/
│       ├── pages/
│       │   ├── public/        # Home, Login, Register, Properties...
│       │   ├── student/       # Student dashboard (9 pages)
│       │   ├── landlord/      # Landlord dashboard (8 pages)
│       │   ├── meal/          # Meal Provider dashboard (7 pages)
│       │   └── facility/      # Facility dashboard (6 pages)
│       ├── context/AuthContext.jsx
│       └── services/api.js    # Axios API calls
│
├── backend/                    # Express backend
│   └── src/
│       ├── models/            # Mongoose schemas
│       ├── controllers/       # Route logic
│       ├── routes/            # Express routers
│       ├── middleware/auth.js  # JWT middleware
│       └── seed.js            # Database seeder
│
├── package.json               # Root (concurrently scripts)
└── SETUP.md                   # This file
```

---

## API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/properties` | List all properties |
| GET | `/api/properties/my` | Landlord's own properties |
| POST | `/api/properties` | Create property |
| GET | `/api/bookings/my` | Student bookings |
| GET | `/api/bookings/landlord` | Landlord booking requests |
| PUT | `/api/bookings/:id/status` | Approve/reject booking |
| GET | `/api/meals/plans` | All meal plans |
| POST | `/api/meals/orders` | Place meal order |
| GET | `/api/services/my` | My service requests |
| POST | `/api/services` | Create service request |

---

## Deployment

### Frontend → Vercel
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set **Root Directory** to `client`
4. Deploy

### Backend → Railway (Recommended)
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Set **Root Directory** to `server`
3. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`
4. Copy the Railway URL and update the client's proxy or `REACT_APP_API_URL`

### Backend → Render (Alternative)
1. Go to [render.com](https://render.com) → New → Web Service
2. Connect GitHub repo, set Root to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add the same env vars

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `MongoServerError: bad auth` | Check your Atlas username/password in MONGO_URI |
| `CORS error` | Make sure server is running on port 5000 |
| `Cannot GET /api/...` | Server not running — run `npm run dev` from root |
| Login with real email fails | Run `npm run seed` in `/server` first |
| Port 3000 already in use | Kill the process or change port in frontend/package.json |

---

## What's Currently Mock vs Real

| Feature | Status |
|---------|--------|
| Login / Register | ✅ Real (hits MongoDB) |
| Quick Access buttons | ✅ Mock (dev convenience) |
| Property listings | ✅ Real (seeded) |
| Bookings | ✅ Real |
| Meal plans | ✅ Real (seeded) |
| Dashboard UI data | ⚡ Mock (rich UI demo data) |
| Messages | ⚡ Mock (Socket.io not yet wired) |
| File uploads | ⚡ Mock (Multer installed, needs cloud storage) |

---

*Built with React 18, Express, MongoDB, Tailwind CSS, and Lucide icons.*
