# Pradarsh — Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+
- Python 3.11+
- A Supabase account (free tier works)

---

## Step 1: Supabase Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy your **Project URL**, **anon key**, and **service role key** from Settings → API
3. Copy your **JWT Secret** from Settings → API → JWT Settings
4. Run all SQL from `docs/database-schema.md` in the SQL Editor (blocks 1–10 in order)
5. Create Storage buckets:
   - `project-thumbnails` (public)
   - `project-screenshots` (public)
6. Enable OAuth providers in Auth → Providers:
   - **Google**: add Client ID + Secret from Google Cloud Console
   - **GitHub**: add Client ID + Secret from GitHub OAuth Apps
7. In Auth → URL Configuration:
   - Site URL: `http://localhost:5173`
   - Redirect URLs: add `http://localhost:5173`

---

## Step 2: Backend Setup

```bash
cd Team11/backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

Edit `backend/.env`:
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
APP_ENV=development
```

Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

Verify: open `http://localhost:8000/health` → should return `{"status": "ok"}`
API docs: `http://localhost:8000/docs`

---

## Step 3: Frontend Setup

```bash
cd Team11/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

Start dev server:
```bash
npm run dev
```

Open: `http://localhost:5173`

---

## Step 4: Verify Everything Works

- [ ] Home page loads with categories grid
- [ ] Register with email → receives confirmation email
- [ ] Login with email/password works
- [ ] Google OAuth redirects and returns logged in
- [ ] GitHub OAuth redirects and returns logged in
- [ ] Publish a project with thumbnail upload
- [ ] Project appears in Explore
- [ ] Search by project name works
- [ ] Filter by category works
- [ ] Developer profile page loads
- [ ] Dashboard shows your projects
- [ ] Edit project saves changes
- [ ] Delete project with confirmation works

---

## Production Deployment

### Backend (e.g. Railway, Render, Fly.io)

1. Set environment variables from `.env.example`
2. Set `APP_ENV=production`
3. Update `FRONTEND_URL` to your production frontend URL
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Frontend (e.g. Vercel, Netlify)

1. Set environment variables from `.env.example`
2. Update `VITE_API_URL` to your production backend URL
3. Build command: `npm run build`
4. Output directory: `dist`

### Supabase (Production)
1. Update Site URL in Auth settings to your production domain
2. Add production domain to Redirect URLs
3. Update OAuth provider redirect URLs
