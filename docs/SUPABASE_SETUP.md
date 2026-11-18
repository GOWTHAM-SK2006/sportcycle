# SportCycle – Supabase Configuration Guide

This guide details configuring Supabase PostgreSQL and Supabase Storage for the SportCycle marketplace.

---

## 1. Supabase Project Setup

1. Create an account on [supabase.com](https://supabase.com).
2. Click **New Project** and name it `sportcycle-production`.
3. Select your preferred AWS region (e.g., `ap-south-1 (Mumbai)` for optimal Indian marketplace latency).
4. Save your **Database Password** securely.

---

## 2. PostgreSQL Connection Details

Navigate to **Project Settings** > **Database** to copy your credentials:

- **Host:** `db.<your-project-id>.supabase.co`
- **Database Name:** `postgres`
- **Port:** `5432`
- **User:** `postgres`
- **Password:** `<your-db-password>`

### JDBC Connection String for Spring Boot
```properties
DATABASE_URL=jdbc:postgresql://db.<your-project-id>.supabase.co:5432/postgres
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=<your-db-password>
```

---

## 3. Database Migrations via Flyway

The backend uses versioned Flyway migrations located at `backend/src/main/resources/db/migration/`:
- `V1__initial_schema.sql`: Creates all 24 normalized relational tables, constraints, foreign keys, and search indexes.
- `V2__seed_data.sql`: Populates the 12 canonical sports, categories, brands, default roles, verified clubs, and initial seed equipment listings.

### Running Migrations Automatically
When the Spring Boot application starts, Flyway runs automatically and verifies schema consistency.

To run migrations manually via the Supabase SQL Editor:
1. Open **Supabase Studio** > **SQL Editor**.
2. Copy and execute `backend/src/main/resources/db/migration/V1__initial_schema.sql`.
3. Copy and execute `backend/src/main/resources/db/migration/V2__seed_data.sql`.

---

## 4. Supabase Storage Setup (Product Images)

1. In the Supabase Dashboard, navigate to **Storage**.
2. Click **New Bucket**.
3. Name the bucket: `sportcycle-products`.
4. Check **Public Bucket** so product images can be served directly to Next.js image components.
5. Click **Save**.

### Storage Policies (Row-Level Security)

To allow verified uploads from the Spring Boot backend while maintaining public image readability:

1. **Public Read Access:**
   ```sql
   CREATE POLICY "Public Read Access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'sportcycle-products');
   ```

2. **Backend Service Role Upload:**
   The backend uses the `SUPABASE_SERVICE_ROLE_KEY` to authenticate uploads to the bucket, which automatically bypasses RLS and writes directly to `/storage/v1/object/sportcycle-products/`.

---

## 5. Obtaining API Keys

Navigate to **Project Settings** > **API**:

| Key Name | Configuration Location | Purpose |
|---|---|---|
| **Project URL** | Backend `SUPABASE_URL` & Frontend `NEXT_PUBLIC_SUPABASE_URL` | Supabase endpoint |
| **anon (public)** | Frontend `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client-side public read access |
| **service_role (secret)** | Backend `SUPABASE_SERVICE_ROLE_KEY` | Server-to-server image uploads |

> [!CAUTION]
> Never expose `SUPABASE_SERVICE_ROLE_KEY` or database passwords in the frontend repository or public client environment variables!

