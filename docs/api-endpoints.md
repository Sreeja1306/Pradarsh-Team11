# Pradarsh API Endpoints

Base URL: `http://localhost:8000`

All protected routes require `Authorization: Bearer <supabase_jwt>` header.

---

## Health

| Method | Path      | Auth | Description        |
|--------|-----------|------|--------------------|
| GET    | `/health` | No   | Health check       |
| GET    | `/`       | No   | API root info      |

---

## Authentication — `/auth`

| Method | Path                       | Auth     | Description                          |
|--------|----------------------------|----------|--------------------------------------|
| GET    | `/auth/me`                 | Required | Get authenticated user's profile     |
| PUT    | `/auth/me`                 | Required | Update authenticated user's profile  |
| GET    | `/auth/profile/:username`  | No       | Get public profile by username       |

### PUT /auth/me — Request Body
```json
{
  "username": "string",
  "full_name": "string",
  "avatar_url": "string",
  "bio": "string",
  "github_url": "string",
  "linkedin_url": "string",
  "website_url": "string"
}
```

---

## Projects — `/projects`

| Method | Path                          | Auth     | Description                              |
|--------|-------------------------------|----------|------------------------------------------|
| GET    | `/projects`                   | No       | List published projects (paginated)      |
| POST   | `/projects`                   | Required | Create a new project                     |
| GET    | `/projects/stats`             | No       | Live platform stats                      |
| GET    | `/projects/my`                | Required | Get current user's own projects          |
| GET    | `/projects/user/:username`    | No       | Get published projects by developer      |
| GET    | `/projects/:id`               | No       | Get single project (increments views)    |
| PUT    | `/projects/:id`               | Required | Update project (owner only)              |
| DELETE | `/projects/:id`               | Required | Delete project (owner only)              |

### GET /projects — Query Params
- `page` (int, default 1)
- `limit` (int, default 12, max 50)

### POST /projects — Request Body
```json
{
  "title": "string (required)",
  "description": "string (required)",
  "category": "string (required)",
  "technologies": ["string"],
  "github_url": "string",
  "demo_url": "string",
  "thumbnail_url": "string",
  "screenshots": ["string"],
  "status": "published | draft"
}
```

### GET /projects/stats — Response
```json
{
  "success": true,
  "data": {
    "total_projects": 42,
    "total_developers": 18,
    "total_categories": 8
  }
}
```

---

## Search — `/search`

| Method | Path      | Auth | Description                     |
|--------|-----------|------|---------------------------------|
| GET    | `/search` | No   | Search and filter projects      |

### Query Params
- `q` — search by project name OR developer name
- `category` — exact category match (e.g. `AI & Machine Learning`)
- `technologies` — repeatable (e.g. `technologies=React&technologies=Python`)
- `page` (int, default 1)
- `limit` (int, default 12, max 50)

### Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 12,
    "pages": 9,
    "has_next": true,
    "has_prev": false
  }
}
```

---

## Uploads — `/uploads`

| Method | Path                    | Auth     | Description                        |
|--------|-------------------------|----------|------------------------------------|
| POST   | `/uploads/thumbnail`    | Required | Upload project thumbnail           |
| POST   | `/uploads/screenshots`  | Required | Upload multiple screenshots (≤10)  |

Both endpoints accept `multipart/form-data`.

### POST /uploads/thumbnail — Response
```json
{
  "success": true,
  "data": {
    "url": "https://...supabase.co/storage/v1/object/public/project-thumbnails/...",
    "path": "user_id/uuid.jpg",
    "filename": "uuid.jpg"
  }
}
```

### POST /uploads/screenshots — Response
```json
{
  "success": true,
  "data": {
    "urls": ["https://..."],
    "paths": ["user_id/uuid.jpg"],
    "count": 3
  }
}
```

---

## Standard Response Format

### Success
```json
{ "success": true, "message": "...", "data": {...} }
```

### Error
```json
{ "success": false, "message": "...", "data": null }
```

### Paginated
```json
{
  "success": true,
  "message": "...",
  "data": [...],
  "pagination": { "total": 0, "page": 1, "limit": 12, "pages": 0, "has_next": false, "has_prev": false }
}
```
