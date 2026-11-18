# SportCycle – Railway Deployment Guide

This guide walks you through deploying the complete multi-sport marketplace on [Railway](https://railway.app).

---

## 1. Prerequisites

- A GitHub repository containing the `sportcycle` monorepo.
- An active [Railway](https://railway.app) account.
- An active [Supabase](https://supabase.com) project with PostgreSQL and Storage configured.

---

## 2. Deploying Service 1: Spring Boot Backend

1. In Railway, click **New Project** > **Deploy from GitHub repo**.
2. Select your `sportcycle` repository.
3. Under **Service Settings**:
   - **Root Directory:** `/backend`
   - **Builder:** Dockerfile (auto-detects `backend/Dockerfile`)
4. In the **Variables** tab, add the backend environment variables:

| Variable Name | Value | Note |
|---|---|---|
| `PORT` | `8080` | Required |
| `SPRING_PROFILES_ACTIVE` | `prod` | Activates production profile |
| `DATABASE_URL` | `jdbc:postgresql://db.<supabase-id>.supabase.co:5432/postgres` | Supabase JDBC URL |
| `DATABASE_USERNAME` | `postgres` | Supabase DB user |
| `DATABASE_PASSWORD` | `<your-db-password>` | Supabase DB password |
| `JWT_SECRET` | `<random-256-bit-string>` | JWT signing key |
| `SUPABASE_URL` | `https://<supabase-id>.supabase.co` | Supabase API URL |
| `SUPABASE_SERVICE_ROLE_KEY` | `<your-supabase-service-role-key>` | For storage uploads |
| `SUPABASE_STORAGE_BUCKET` | `sportcycle-products` | Storage bucket name |
| `RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay API Key |
| `RAZORPAY_KEY_SECRET` | `...` | Razorpay Key Secret |
| `CORS_ALLOWED_ORIGINS` | `https://*.railway.app,http://localhost:3000` | Will be updated with frontend domain |

5. Under **Settings** > **Networking**:
   - Click **Generate Domain** (e.g. `sportcycle-backend-production.up.railway.app`).
   - Configure **Healthcheck Path**: `/api/v1/actuator/health`

---

## 3. Deploying Service 2: Next.js Frontend

1. In the same Railway project, click **New Service** > **GitHub Repo**.
2. Select the same `sportcycle` repository.
3. Under **Service Settings**:
   - **Root Directory:** `/frontend`
   - **Builder:** Dockerfile (auto-detects `frontend/Dockerfile`)
4. In the **Variables** tab, add the frontend environment variables:

| Variable Name | Value | Note |
|---|---|---|
| `PORT` | `3000` | Standard Next.js port |
| `NODE_ENV` | `production` | Production mode |
| `NEXT_PUBLIC_API_URL` | `https://sportcycle-backend-production.up.railway.app/api/v1` | URL from Backend Service |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<supabase-id>.supabase.co` | Supabase Public URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `<your-supabase-anon-key>` | Public Anon Key |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_test_...` | Razorpay Client Key |

5. Under **Settings** > **Networking**:
   - Click **Generate Domain** (e.g. `sportcycle.up.railway.app`).

6. Copy your new frontend domain and update `CORS_ALLOWED_ORIGINS` in your backend service variables:
   ```properties
   CORS_ALLOWED_ORIGINS=https://sportcycle.up.railway.app
   ```

---

## 4. Verification Checklist

- [ ] Check backend logs: Verify Flyway executed migrations `V1` and `V2`.
- [ ] Visit `https://sportcycle-backend-production.up.railway.app/api/v1/swagger-ui.html` to confirm OpenAPI docs load.
- [ ] Visit `https://sportcycle-backend-production.up.railway.app/api/v1/actuator/health` to confirm `{"status":"UP"}`.
- [ ] Visit `https://sportcycle.up.railway.app` on desktop and mobile browsers to confirm responsive layout and complete marketplace functionality.
- [ ] Test demo login with `customer@sportcycle.com` / `password123`.
- [ ] Test placing an order and reviewing tracking timeline.

