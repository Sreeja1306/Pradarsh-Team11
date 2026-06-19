# Pradarsh — Supabase Database Schema

Run all SQL below in your **Supabase SQL Editor** (Dashboard → SQL Editor → New Query).

---

## 1. Enable Extensions

```sql
-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

---

## 2. Profiles Table

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username      TEXT UNIQUE,
  full_name     TEXT,
  avatar_url    TEXT,
  bio           TEXT,
  github_url    TEXT,
  linkedin_url  TEXT,
  website_url   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
```

---

## 3. Categories Table

```sql
CREATE TABLE IF NOT EXISTS public.categories (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  slug       TEXT NOT NULL UNIQUE,
  icon       TEXT DEFAULT 'code'
);

-- Seed with all 10 categories shown in UI
INSERT INTO public.categories (name, slug, icon) VALUES
  ('Web Development',       'web-development',       'globe'),
  ('Mobile Apps',           'mobile-apps',           'smartphone'),
  ('AI & Machine Learning', 'ai-machine-learning',   'brain'),
  ('Generative AI',         'generative-ai',         'sparkles'),
  ('SaaS Products',         'saas-products',         'layers'),
  ('Portfolio',             'portfolio',             'user'),
  ('Open Source',           'open-source',           'git-branch'),
  ('Cyber Security',        'cyber-security',        'shield'),
  ('Cloud Computing',       'cloud-computing',       'cloud'),
  ('Dev Tools',             'dev-tools',             'tool')
ON CONFLICT (slug) DO NOTHING;
```

---

## 4. Projects Table

```sql
CREATE TABLE IF NOT EXISTS public.projects (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT NOT NULL,
  category      TEXT NOT NULL,
  technologies  TEXT[] DEFAULT '{}',
  github_url    TEXT,
  demo_url      TEXT,
  thumbnail_url TEXT,
  screenshots   TEXT[] DEFAULT '{}',
  status        TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft')),
  view_count    INTEGER DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS projects_user_id_idx    ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS projects_category_idx   ON public.projects(category);
CREATE INDEX IF NOT EXISTS projects_status_idx     ON public.projects(status);
CREATE INDEX IF NOT EXISTS projects_created_at_idx ON public.projects(created_at DESC);
```

---

## 5. Auto-Update `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

---

## 6. Auto-Create Profile on Signup Trigger

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),
    LOWER(REPLACE(COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', SPLIT_PART(NEW.email, '@', 1)), ' ', ''))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 7. Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- =====================
-- PROFILES POLICIES
-- =====================

-- Anyone can read profiles
CREATE POLICY "profiles_public_read"
  ON public.profiles FOR SELECT
  USING (true);

-- Users can only update their own profile
CREATE POLICY "profiles_owner_update"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "profiles_owner_insert"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================
-- PROJECTS POLICIES
-- =====================

-- Anyone can read published projects
CREATE POLICY "projects_public_read"
  ON public.projects FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id);

-- Authenticated users can create projects
CREATE POLICY "projects_auth_insert"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only owner can update their project
CREATE POLICY "projects_owner_update"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Only owner can delete their project
CREATE POLICY "projects_owner_delete"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);
```

---

## 8. Supabase Storage Buckets

Run in SQL Editor:

```sql
-- Create thumbnails bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-thumbnails', 'project-thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Create screenshots bucket (public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-screenshots', 'project-screenshots', true)
ON CONFLICT (id) DO NOTHING;
```

Or create via Dashboard: Storage → New Bucket → name it `project-thumbnails`, check **Public bucket**.
Repeat for `project-screenshots`.

### Storage Policies

```sql
-- Allow authenticated users to upload to their own folder in thumbnails
CREATE POLICY "thumbnails_upload_own_folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public to read thumbnails
CREATE POLICY "thumbnails_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-thumbnails');

-- Allow authenticated users to upload screenshots to their own folder
CREATE POLICY "screenshots_upload_own_folder"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'project-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public to read screenshots
CREATE POLICY "screenshots_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-screenshots');

-- Allow owners to delete their own files
CREATE POLICY "thumbnails_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-thumbnails'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "screenshots_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'project-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
```

---

## 9. Useful Views (Optional)

```sql
-- Projects with author info joined (for easier API queries)
CREATE OR REPLACE VIEW public.projects_with_authors AS
SELECT
  p.*,
  pr.full_name   AS author_name,
  pr.avatar_url  AS author_avatar,
  pr.username    AS author_username,
  pr.github_url  AS author_github
FROM public.projects p
LEFT JOIN public.profiles pr ON p.user_id = pr.id
WHERE p.status = 'published';
```

---

## Setup Checklist

- [ ] Run SQL blocks 1–9 in order in Supabase SQL Editor
- [ ] Create storage buckets via Dashboard or SQL block 8
- [ ] Enable Google OAuth: Auth → Providers → Google → add Client ID + Secret
- [ ] Enable GitHub OAuth: Auth → Providers → GitHub → add Client ID + Secret
- [ ] Set Site URL in Auth → URL Configuration → `http://localhost:5173`
- [ ] Add `http://localhost:5173` to Redirect URLs

---

## 10. Increment View Count RPC (Required by Backend)

```sql
CREATE OR REPLACE FUNCTION public.increment_view_count(project_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.projects
  SET view_count = view_count + 1
  WHERE id = project_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```
