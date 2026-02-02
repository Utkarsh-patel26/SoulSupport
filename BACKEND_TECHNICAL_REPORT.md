# SoulSupport Backend (Node.js + Express + MongoDB) — Technical Report

Date: 2026-02-02

## 1) Executive Summary

- This backend is an **Express REST API** backed by **MongoDB via Mongoose**.
- Authentication is **JWT Bearer tokens** (stored client-side; sent as `Authorization: Bearer <token>`).
- Core domains: **Auth**, **Therapists**, **Sessions**, **Reviews**, **Forum**, **Resources**, **Notifications**, **Users**.
- The project has some **duplicated/unused modules** and **port/config drift** (5007 vs 5000) that can cause confusion in Docker/Compose.

## 2) Tech Stack

- **Runtime:** Node.js
- **Web framework:** Express
- **Database:** MongoDB
- **ODM:** Mongoose
- **Auth:** JWT (`jsonwebtoken`)
- **Password hashing:** bcrypt
- **Validation:** Joi
- **Security hardening:** helmet, express-rate-limit, express-mongo-sanitize, CORS
- **Logging:** morgan (dev), winston (structured logs)
- **Email:** nodemailer
- **Uploads:** multer (memory) + Cloudinary
- **Tests:** Jest + Supertest

### Versions

From `backend/package.json`:

- Express: `^4.18.2`
- Mongoose: `^8.0.0`
- jsonwebtoken: `^9.0.2`
- Node: not pinned in `package.json`, but Dockerfile uses **node:18-alpine** and docs say **Node 18+**.

### Package manager

- **npm** (`backend/package-lock.json` present)

### Language

- **JavaScript (CommonJS)**

## 3) Build System

- No compilation step (plain Node + Express).
- **Prod run:** `node src/server.js`
- **Dev run:** `nodemon src/server.js`

## 4) Entry Points

- `src/server.js`
  - loads env (`dotenv`), connects DB, starts HTTP server
- `src/app.js`
  - configures middleware + mounts `/api` routes + error handlers

## 5) Environment Variables

Reference template: `backend/.env.example`.

### High-signal env vars (do not commit secrets)

- **Server:** `NODE_ENV`, `PORT`
- **DB:** `MONGODB_URI`
- **JWT:** `JWT_SECRET`, `JWT_EXPIRES_IN`
- **Email:** `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_DISABLE`
- **Cloudinary:** `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **Frontend origin:** `FRONTEND_URL`
- **Rate limiting:** `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`
- **Logging:** `LOG_LEVEL`, `LOG_DIR`

Code usage notes:

- `MONGODB_URI` is required at startup (`src/config/db.js`).
- The template contains refresh-token variables (e.g., `JWT_REFRESH_SECRET`) but **refresh tokens are not implemented** in the currently scanned code.

## 6) Dependencies (with purpose)

From `backend/package.json`:

### dependencies

- `express`: HTTP server + routing
- `mongoose`: MongoDB ODM
- `dotenv`: load environment variables
- `cors`: cross-origin controls
- `helmet`: security headers
- `morgan`: request logging (dev)
- `express-rate-limit`: rate limiting
- `express-mongo-sanitize`: NoSQL injection sanitization
- `bcrypt`: password hashing
- `jsonwebtoken`: JWT signing/verification
- `joi`: request validation schemas
- `nodemailer`: SMTP email sending
- `cloudinary`: media hosting upload SDK
- `multer`: multipart/form-data upload handling
- `winston`: app logging
- `date-fns`: **currently not referenced in `src/`** (candidate removal)

### devDependencies

- `nodemon`: dev server reload
- `jest`: unit/integration test runner
- `supertest`: HTTP testing against Express

### Heavy / attention packages

- `mongoose`: ensure indexes & query patterns are intentional
- `cloudinary` + `multer`: memory uploads can spike RAM for large files
- `nodemailer`: can become a latency bottleneck if used synchronously (this code mostly sends “best effort”)

### Likely unused/duplicated code (flag)

Observed by inspection and require/import usage:

- Duplicate email implementations:
  - `src/services/email.service.js` (used)
  - `src/services/emailService.js` (appears unused)
- Duplicate notification implementations:
  - `src/services/notification.service.js` (used)
  - `src/services/notificationService.js` (appears unused)
- Duplicate error handling utilities:
  - `src/middlewares/error.middleware.js` (used)
  - `src/middlewares/errorHandler.js` (appears unused)
- `src/utils/jwt.utils.js` (appears unused; User model signs tokens directly)
- `src/config/security.js` (appears unused and requires packages not in `package.json`: `xss-clean`, `mongo-sanitize`)

Recommendation:

- Confirm with `npx depcheck` in `backend/`, then delete unused files and remove unused packages.

## 7) Project Structure

`backend/src/`

- `app.js`: Express app wiring
- `server.js`: process startup + DB connect + listen
- `config/`: DB, logger, cloudinary
- `routes/`: route modules mounted under `/api/*`
- `controllers/`: request handlers per domain
- `models/`: Mongoose schemas
- `middlewares/`: auth, validation, upload, rate limiting, error handling
- `services/`: cross-cutting services (email, notifications, uploads, rating)
- `utils/`: shared helpers (ApiError/ApiResponse/asyncHandler, pagination, etc.)
- `validators/`: Joi schemas for body validation

## 8) Routing System (REST)

Mounted in `src/app.js`:

- `GET /health` (health check)
- `/api/*` routes from `src/routes/index.js`

### Route map (high level)

Auth (`/api/auth`):

- `POST /register` (rate-limited + validated)
- `POST /login` (rate-limited + validated)
- `GET /me` (protected)
- `POST /logout` (protected)
- `POST /forgot-password` (validated)
- `POST /reset-password` (validated)
- `POST /verify-email` (validated)

Forum (`/api/forum`):

- `GET /posts` (public)
- `GET /categories` (public)
- `POST /posts` (protected + post limiter + validated)
- `PUT /posts/:id` (protected + validated)
- `GET /posts/:id` (public)
- `DELETE /posts/:id` (protected)
- `POST /posts/:id/like` (protected)
- `DELETE /posts/:id/like` (protected)
- `POST /posts/:id/comments` (protected + validated)
- `DELETE /posts/:postId/comments/:commentId` (protected)

Therapists (`/api/therapists`):

- `GET /` (public)
- `GET /search` (public; same handler as list)
- `GET /profile` (protected therapist-only)
- `GET /:id` (public)
- `PUT /:id` (protected therapist-only + validated)
- `POST /:id/photo` (protected therapist-only + upload)
- `GET /:id/reviews` (public)
- `GET /:id/availability` (public)

Sessions (`/api/sessions`):

- `GET /` (protected)
- `GET /upcoming` (protected)
- `GET /available-slots/:therapistId` (public)
- `POST /` (protected user-only + validated)
- `GET /:id` (protected)
- `PUT /:id` (protected + validated)
- `PUT /:id/status` (protected therapist-only + validated)
- `DELETE /:id` (protected)

Reviews (`/api/reviews`):

- `POST /` (protected user-only)
- `GET /therapist/:therapistId` (public)
- `GET /session/:sessionId` (protected)
- `GET /user/:userId` (protected)

Notifications (`/api/notifications`):

- `GET /` (protected)
- `PUT /:id/read` (protected)
- `DELETE /:id` (protected)

Users (`/api/users`):

- `GET /:id` (protected)
- `PUT /:id` (protected)
- `DELETE /:id` (protected)
- `PUT /:id/avatar` (protected + upload)
- `GET /:id/stats` (protected)

## 9) Middleware

Global middleware in `src/app.js`:

- `helmet()`
- `cors({ origin: FRONTEND_URL || http://localhost:3000, credentials: true })`
- `express-mongo-sanitize()`
- `apiLimiter` on `/api/`
- `express.json()` / `express.urlencoded()`
- `morgan('dev')` only in development
- 404 handler
- `error.middleware.js` as last

Domain middleware:

- `protect`: validates JWT, loads user, checks `isActive`
- `restrictTo(...)`: role-based authorization
- `validate(schema)`: Joi body validation
- `multer` memory upload via `uploadSingle()`

## 10) Authentication & Authorization

- **Auth tokens:** JWT signed with `JWT_SECRET`.
- Token contains `{ id, email, userType }`.
- API expects `Authorization: Bearer <token>`.

Role rules (examples):

- `sessions POST` user-only
- `sessions status update` therapist-only
- `therapists /profile` therapist-only
- `resources` create/update/delete therapist/admin

Verification flow:

- Registration generates an email verification token stored hashed in the user document.
- `POST /api/auth/verify-email` flips `isEmailVerified` to true.

## 11) Data Model Overview (MongoDB)

Key models (high level):

- `User`: email/password/userType/fullName/bio + verification + reset tokens
  - Index: `{ userType: 1 }`
- `TherapistProfile`: therapist metadata and rating aggregates
  - Indexes: `{ isVerified: 1, rating: -1 }`, `{ specializations: 1 }`
- `Session`: therapistId/userId, sessionDate, status, meetingLink
  - Multiple indexes, including a **partial unique** to prevent double-booking for pending/confirmed
- `Review`: unique per session (`sessionId` unique)
- `ForumPost`: embedded comments; likes; counters
- `Notification`: per-user read status
- `Resource`: published content with viewCount

## 12) Performance & Scalability Notes

- Pagination is implemented in many list endpoints with `skip/limit`.
  - For large collections, deep pagination via `skip` gets slower. Consider cursor-based pagination later.
- Indexes are generally good (sessions/therapists/forum/resources/notifications).
- Uploads use in-memory buffers; keep strict file-size limits and consider streaming for large files.
- `Resource.getResource` increments `viewCount` by fetching + saving; for hot resources prefer `findByIdAndUpdate({ $inc: { viewCount: 1 } })`.

## 13) Testing

- Jest is configured via `backend/jest.config.js`.
- `tests/setup.js` sets env vars and connects to MongoDB test DB.

Important: `tests/auth.test.js` is currently a **template** (asserts `expect(true).toBe(true)`), so test coverage does not validate real behavior yet.

Recommended:

- Convert to real Supertest tests that hit `app` routes and assert actual responses.

## 14) Scripts (npm)

From `backend/package.json`:

- `npm run start`: starts server via `node src/server.js`
- `npm run dev`: starts with nodemon
- `npm test`: runs `jest --watchAll --verbose` (good for local dev; not good for CI)

Suggested additions:

- `test:ci`: `jest --runInBand --coverage` for automation

## 15) How to Run / Verify

Install:

- `cd backend`
- `npm install`

Configure env:

- `cp .env.example .env`
- Set `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, and (optionally) email + cloudinary.

Run dev:

- `npm run dev`

Sanity checks:

- `GET http://localhost:<PORT>/health`
- `POST /api/auth/register` then `POST /api/auth/login` then `GET /api/auth/me`

## 16) Issues / Bottlenecks / Anti-patterns

1. **Port/config drift (5007 vs 5000)**
   - `.env.example` uses `PORT=5007` while `src/server.js` defaults to `5000`.
   - `backend/Dockerfile` contains conflicting `EXPOSE`/healthchecks/CMD blocks (5007 and 5000).
2. **Duplicate service implementations**
   - Email + Notification services exist in two versions each; only one is used.
3. **Unused or mismatched security config**
   - `src/config/security.js` appears unused and imports packages not declared.
4. **User privacy risk**
   - `GET /api/users/:id` is protected but does not restrict access to self/admin (any authenticated user could fetch any user by id).
5. **Refresh token settings unused**
   - Env template includes refresh token vars but code uses only access token.

## 17) Recommended Improvements (Actionable)

- Fix Dockerfile to a single consistent port and single `CMD`/`HEALTHCHECK` block.
- Standardize on the “.service.js” services and delete unused duplicates.
- Either wire `config/security.js` into `app.js` (and add missing deps) or delete it.
- Lock down `GET /api/users/:id` and `GET /api/users/:id/stats` to self/admin.
- Replace placeholder tests with real integration tests for auth + core flows.
- Remove unused dependency `date-fns` if confirmed unused.

---

Appendix: Key files

- `src/app.js` — middleware and routing
- `src/server.js` — startup and DB connection
- `src/routes/index.js` — route mounting
