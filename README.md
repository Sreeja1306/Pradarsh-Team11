# Pradarsh — Developer Project Showcase Platform

> Showcase. Discover. Get Inspired.

Pradarsh is a full-stack platform where developers publish their projects, build public portfolios, and get discovered by the community.

---

## Tech Stack

| Layer      | Technology                                    |
|------------|-----------------------------------------------|
| Frontend   | React 18 (JSX) + React Router v6 + Vite       |
| Styling    | TailwindCSS 3 + Custom design system          |
| Backend    | Python 3.11 + FastAPI                         |
| Database   | Supabase (PostgreSQL)                         |
| Auth       | Supabase Auth (Email + Google + GitHub OAuth) |
| Storage    | Supabase Storage                              |

---

## Project Structure

```
Team11/
├── frontend/                    # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── routes/AppRoutes.jsx
│   │   ├── context/AuthContext.jsx
│   │   ├── hooks/useAuth.js
│   │   ├── services/            # API + auth + upload service wrappers
│   │   ├── utils/               # constants + helpers
│   │   ├── pages/               # Home, Projects, Publish, Login, Register,
│   │   │                        # Dashboard, ProjectDetails, EditProject,
│   │   │                        # DeveloperProfile, NotFound
│   │   └── components/
│   │       ├── common/          # Navbar, Footer, Loader, ProtectedRoute
│   │       ├── home/            # Hero, Stats, FAQ (categories)
│   │       ├── auth/            # LoginForm, RegisterForm
│   │       ├── apps/            # ProjectCard, ProjectGrid, SearchBar, FilterPanel
│   │       ├── publish/         # ProjectForm, ThumbnailUpload
│   │       └── dashboard/       # MyProjects, ProjectActions
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── .env.example
│
├── backend/                     # FastAPI backend
│   ├── app/
│   │   ├── main.py              # App entry point + CORS
│   │   ├── core/                # config.py, security.py (JWT)
│   │   ├── database/            # supabase.py (client init)
│   │   ├── dependencies/        # auth.py (get_current_user)
│   │   ├── routers/             # auth, projects, search, uploads
│   │   ├── schemas/             # auth, project, upload (Pydantic)
│   │   ├── services/            # auth, project, search, storage, supabase
│   │   └── utils/               # response.py (standard response helpers)
│   ├── requirements.txt
│   └── .env.example
│
└── docs/
    ├── database-schema.md       # Full SQL schema + RLS policies
    ├── api-endpoints.md         # All API endpoint documentation
    ├── deployment-guide.md      # Setup instructions
    ├── testing-checklist.md     # Manual test cases
    └── ppt-content.md           # Presentation slides content
```

---

## Quick Start

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Run all SQL from `docs/database-schema.md` in SQL Editor
3. Create storage buckets: `project-thumbnails`, `project-screenshots` (both public)
4. Enable Google + GitHub OAuth in Auth → Providers
5. Set Site URL and Redirect URLs to `http://localhost:5173`

### 2. Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux
pip install -r requirements.txt
cp .env.example .env           # Fill in your Supabase credentials
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env           # Fill in your Supabase credentials
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Environment Variables

### Backend (`backend/.env`)
```
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
FRONTEND_URL=http://localhost:5173
APP_ENV=development
```

### Frontend (`frontend/.env`)
```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:8000
```

---

## API Overview

| Method | Endpoint                    | Auth     | Description                   |
|--------|-----------------------------|----------|-------------------------------|
| GET    | `/health`                   | No       | Health check                  |
| GET    | `/auth/me`                  | Required | Get own profile               |
| PUT    | `/auth/me`                  | Required | Update own profile            |
| GET    | `/auth/profile/:username`   | No       | Get public profile            |
| GET    | `/projects`                 | No       | List all published projects   |
| POST   | `/projects`                 | Required | Create project                |
| GET    | `/projects/stats`           | No       | Live platform stats           |
| GET    | `/projects/my`              | Required | Get own projects              |
| GET    | `/projects/:id`             | No       | Get single project            |
| PUT    | `/projects/:id`             | Required | Update project (owner only)   |
| DELETE | `/projects/:id`             | Required | Delete project (owner only)   |
| GET    | `/search`                   | No       | Search + filter projects      |
| POST   | `/uploads/thumbnail`        | Required | Upload thumbnail              |
| POST   | `/uploads/screenshots`      | Required | Upload screenshots            |

Full documentation: `docs/api-endpoints.md`

---

## Features

- **Auth** — Email/password + Google OAuth + GitHub OAuth via Supabase
- **Explore** — Search by project name or developer name, filter by category + technology
- **Publish** — Rich form with thumbnail + screenshot uploads to Supabase Storage
- **Developer Profiles** — Public portfolio at `/developer/:username`
- **Dashboard** — Full CRUD for own projects (create, edit, delete)
- **Live Stats** — Real-time counts from database
- **Responsive** — Mobile, tablet, desktop
- **Security** — JWT verification, RLS policies, ownership checks on all mutations

---

## Design System

- Primary: `#8B5CF6` (purple) → Accent: `#EC4899` (pink) gradient
- Typography: Inter font
- Components: glassmorphism cards, gradient buttons, hover animations
- Consistent spacing via Tailwind utility classes
