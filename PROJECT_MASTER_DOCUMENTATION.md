# SoulSupport Master Project Documentation

Generated on: 2026-03-07
Repository root: `d:\SoulSupport`

## 1. Project Summary

SoulSupport is a full-stack online therapy and mental wellness platform built with a Next.js frontend and an Express + MongoDB backend.

Core purpose:

- Connect users seeking support with therapists.
- Provide structured online session booking and management.
- Offer a community forum for peer support.
- Provide curated mental health resources.
- Support therapist growth through profile, reviews, and dashboard analytics.

Primary user roles:

- `user`: client/seeker who books sessions, posts in community, and leaves reviews.
- `therapist`: provider who manages profile and session status.
- `admin`: included in role system; explicitly used for resource-management authorization parity with therapist in current implementation.

## 2. System Architecture

### 2.1 High-Level Layers

- Client layer: browser-based web application (mobile-responsive UI).
- Frontend layer: Next.js 14 App Router + React 18 + Tailwind CSS.
- API layer: Express REST API under `/api`.
- Data layer: MongoDB (Mongoose ODM).
- External integrations:
  - Cloudinary for image upload/CDN.
  - SMTP (Nodemailer) for transactional emails.
  - Optional Redis in Docker Compose.
  - Optional Nginx reverse proxy in Docker Compose.

### 2.2 Project Structure

- `backend/`: Node.js + Express API.
- `frontend/`: Next.js web application.
- `docker-compose.yml`: local container orchestration (MongoDB, Redis, backend, frontend, nginx).
- `nginx.conf`: reverse proxy config.
- `scripts/`: helper scripts.

## 3. Technology Stack

### 3.1 Backend Stack

- Node.js (Docker image uses Node 18 Alpine)
- Express 4.18.x
- MongoDB + Mongoose 8.x
- JWT auth (`jsonwebtoken`)
- Password hashing (`bcrypt`, 12 rounds)
- Validation (`Joi`)
- Security middleware (`helmet`, `cors`, `express-mongo-sanitize`, `express-rate-limit`)
- Upload pipeline (`multer` memory storage + Cloudinary)
- Email service (`nodemailer`)
- Logging (`morgan`, `winston`)
- Testing (`jest`, `supertest`)

### 3.2 Frontend Stack

- Next.js 14 App Router
- React 18
- Tailwind CSS + PostCSS + Autoprefixer
- TanStack React Query (server state)
- Axios (HTTP client)
- React Hot Toast (notifications)
- Framer Motion (animations in selected components)
- Lucide React icons
- Optional graphics libraries present: `ogl`, `three`
- Testing: Jest configured (`next/jest`)

## 4. Complete Feature Inventory

This section consolidates implemented or wired features based on actual routes, controllers, models, and frontend pages/components.

### 4.1 Authentication and Account Lifecycle

Implemented:

- Register account (`user`, `therapist`, `admin` accepted by schema).
- Login with email/password.
- Current user fetch (`/auth/me`).
- Logout endpoint and client logout flow.
- Forgot-password request with token email.
- Reset-password by token.
- Email verification by token.
- JWT-protected backend routes via Bearer token.
- Frontend auth context with route redirects:
  - Therapist -> `/therapist-dashboard`
  - User -> `/dashboard`

Therapist onboarding behavior:

- During therapist registration, a default `TherapistProfile` is auto-created with placeholder qualification and default values.

### 4.2 User Features (Client/Seeker)

Implemented:

- Browse therapists listing (`/therapists`).
- View therapist detail page (`/therapists/[id]`).
- Book session from therapist detail (opens booking modal).
- Session listing in dashboard and dedicated sessions page.
- Cancel own sessions.
- View/update own profile (full name, bio).
- Upload avatar.
- View own stats (session and review counts).
- Create, update, delete own forum posts.
- Anonymous posting and anonymous comments (default true).
- Like/unlike forum posts.
- Add/delete own forum comments.
- Read mental wellness resources page with curated links, embedded audio/video.
- Leave review for completed sessions only.

### 4.3 Therapist Features

Implemented:

- Therapist dashboard with:
  - upcoming/pending/completed session counts
  - derived revenue estimate (`completed * hourlyRate`)
  - profile summary snippets
- Fetch own therapist profile (`/therapists/profile`).
- Edit therapist profile:
  - qualifications
  - years of experience
  - hourly rate
  - specializations
  - availability days/time range
- Upload therapist photo (also syncs to user avatar).
- View therapist reviews.
- View and manage therapist session list.
- Confirm session status from therapist session management page.
- Access therapist-only profile route on backend.

### 4.4 Session Booking and Lifecycle

Implemented business rules:

- Only `user` can create sessions.
- Session booking window constrained to 9:00 to 17:00 hour slots.
- Conflict prevention checks existing `pending`/`confirmed` sessions for same hour.
- DB-level partial unique index also protects against double-booking for active states.
- Session statuses: `pending`, `confirmed`, `completed`, `cancelled`.
- Session details can be updated by either participant if not completed/cancelled.
- Session status update is therapist-only.
- Session cancellation allowed by either participant.
- Upcoming endpoint returns next pending/confirmed sessions.
- Available slot endpoint returns booked hours for date + therapist.

### 4.5 Forum and Community

Implemented:

- Public post feed with category filtering, sorting, pagination.
- Categories endpoint.
- Create, update, delete posts (owner-only updates/deletes).
- Like/unlike with duplicate-like protection.
- Comment creation and owner-only comment deletion.
- Post detail page with comment thread.

Forum categories:

- `general`, `anxiety`, `depression`, `relationships`, `stress`, `success`

### 4.6 Reviews and Ratings

Implemented:

- Review creation by `user` only.
- Review is restricted to completed sessions.
- Review is unique per session.
- Therapist review listing endpoint (paginated).
- Session review fetch endpoint (participant-authorized).
- User review listing endpoint (owner-only).
- Therapist aggregate rating recalculation after new review:
  - average rating
  - total review count
  - last 5 review snapshots in therapist profile
- Therapist total session count increment on session completion.

### 4.7 Notifications

Implemented:

- Notification document creation service.
- Notification list by user with pagination and unread count.
- Mark one notification as read.
- Delete one notification.

Notification types:

- `session_booked`
- `session_confirmed`
- `session_cancelled`
- `new_review`

### 4.8 Resource Library

Implemented backend resource domain:

- List published resources with filtering:
  - type
  - category
  - text search across title/description/tags
  - pagination
- Get single resource (+ viewCount increment).
- Create/update/delete resource restricted to `therapist` or `admin`.

Resource types:

- `guide`, `video`, `podcast`, `article`

Resource categories:

- `anxiety`, `depression`, `stress`, `relationships`, `general`

Frontend currently has:

- A curated static resources page with external links and embedded media.
- Resource service for API-backed resources is present, enabling dynamic expansion.

### 4.9 File Upload and Media

Implemented:

- Multipart upload with `multer` memory storage.
- MIME and extension filtering to image formats (`jpeg/jpg/png/gif/webp`).
- 2MB limit in current upload middleware.
- Cloudinary upload transformations (size cap, auto quality, auto format).

Upload endpoints in current API usage:

- User avatar update (`PUT /api/users/:id/avatar`).
- Therapist photo upload (`POST /api/therapists/:id/photo`).

### 4.10 Email Workflows

Implemented transactional email methods:

- Verification email.
- Password reset email.
- New session booking email to therapist.
- Session confirmation email to user.

Behavior:

- Email sending is best-effort in key flows (errors logged, request continues).
- Email service auto-disables if required SMTP env vars are absent or `EMAIL_DISABLE=true`.

### 4.11 Dashboard and UX Features

User dashboard includes:

- Welcome banner.
- Stats: upcoming sessions, completed sessions, forum comments, therapist count.
- Quick actions.
- Upcoming session preview.

Therapist dashboard includes:

- Stats cards (upcoming/pending/completed/revenue).
- Profile summary block.
- Recent sessions list with status chips.

General UX features:

- Protected route wrapper for auth gating.
- Toast notifications for key actions.
- Loading and error components.
- Reusable UI primitives (`Button`, `Card`, `Input`, `Modal`, `Avatar`, etc.).

## 5. Frontend Routes and Pages

Detected page routes:

- `/`
- `/about`
- `/login`
- `/register`
- `/forgot-password`
- `/reset-password`
- `/resources`
- `/forum`
- `/forum/[id]`
- `/therapists`
- `/therapists/[id]`
- `/dashboard`
- `/dashboard/profile`
- `/dashboard/sessions`
- `/dashboard/settings`
- `/therapist-dashboard`
- `/therapist-dashboard/profile`
- `/therapist-dashboard/reviews`
- `/therapist-dashboard/sessions`

State and data flow:

- Global providers in root layout:
  - React Query provider
  - Auth context provider
  - Notification context provider
- Axios instance injects JWT from `localStorage`.
- 401 interceptor clears token and routes to `/login`.

## 6. Backend API Surface

Base API prefix: `/api`
Health endpoint: `GET /health`

### 6.1 Auth (`/api/auth`)

- `POST /register`
- `POST /login`
- `GET /me`
- `POST /logout`
- `POST /forgot-password`
- `POST /reset-password`
- `POST /verify-email`

### 6.2 Forum (`/api/forum`)

- `GET /posts`
- `GET /categories`
- `POST /posts`
- `PUT /posts/:id`
- `GET /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/like`
- `DELETE /posts/:id/like`
- `POST /posts/:id/comments`
- `DELETE /posts/:postId/comments/:commentId`

### 6.3 Therapists (`/api/therapists`)

- `GET /`
- `GET /search`
- `GET /profile`
- `GET /:id`
- `PUT /:id`
- `POST /:id/photo`
- `GET /:id/reviews`
- `GET /:id/availability`

### 6.4 Sessions (`/api/sessions`)

- `GET /`
- `GET /upcoming`
- `GET /available-slots/:therapistId`
- `POST /`
- `GET /:id`
- `PUT /:id`
- `PUT /:id/status`
- `DELETE /:id`

### 6.5 Reviews (`/api/reviews`)

- `POST /`
- `GET /therapist/:therapistId`
- `GET /session/:sessionId`
- `GET /user/:userId`

### 6.6 Notifications (`/api/notifications`)

- `GET /`
- `PUT /:id/read`
- `DELETE /:id`

### 6.7 Resources (`/api/resources`)

- `GET /`
- `GET /:id`
- `POST /`
- `PUT /:id`
- `DELETE /:id`

### 6.8 Users (`/api/users`)

- `GET /:id`
- `PUT /:id`
- `DELETE /:id`
- `PUT /:id/avatar`
- `GET /:id/stats`

## 7. Access Control and Security

### 7.1 Authentication and Authorization

- JWT required for protected endpoints.
- Middleware `protect` validates token and active user.
- Middleware `restrictTo` enforces role checks.
- Middleware `checkOwnership` restricts user routes to self.

### 7.2 Validation and Hardening

- Joi validation at route level for major domains.
- Global security middleware:
  - `helmet`
  - CORS allowlist based on `FRONTEND_URL`
  - `express-mongo-sanitize`
- Rate limiting:
  - global API limiter: 100 requests / 15 min
  - auth limiter: 5 attempts / 15 min
  - post creation limiter: 10 / hour

### 7.3 Data Protection

- Passwords hashed via bcrypt before save.
- Sensitive token fields stripped from user JSON serialization.
- Reset and verification tokens stored hashed.

## 8. Data Models and Schema Details

### 8.1 `User`

Fields include:

- identity/auth: `email`, `password`, `userType`, `isEmailVerified`, `isActive`
- profile: `fullName`, `avatarUrl`, `bio`
- lifecycle: `lastLogin`, reset + verification token metadata

Key behaviors:

- pre-save password hashing
- `comparePassword` instance method
- `generateAuthToken` instance method

### 8.2 `TherapistProfile`

Fields include:

- relation: `userId`
- professional: `specializations`, `qualifications`, `experienceYears`, `hourlyRate`
- media: `photoUrl`
- schedule: `availability.days`, `availability.timeStart`, `availability.timeEnd`
- quality metrics: `isVerified`, `rating`, `totalSessions`, `totalReviews`, `recentReviews`

### 8.3 `Session`

Fields include:

- relations: `therapistId`, `userId`
- denormalized snapshots: `therapist{...}`, `user{...}`
- scheduling: `sessionDate`, `durationMinutes`
- lifecycle: `status`, `meetingLink`, `cancelReason`, `notes`

Important index:

- partial unique index to prevent duplicate active bookings.

### 8.4 `Review`

Fields include:

- relation keys: `sessionId` (unique), `therapistId`, `userId`
- display: `reviewer{name, avatarUrl}`
- content: `rating`, `reviewText`, `isVisible`

### 8.5 `ForumPost`

Fields include:

- relation: `userId`
- author snapshot: `author{name, avatarUrl}`
- content metadata: `category`, `content`, `isAnonymous`
- engagement: `likesCount`, `commentsCount`, `likedBy[]`, `comments[]`

Comment subdocument includes:

- `userId`, `author`, `content`, `isAnonymous`, `createdAt`

### 8.6 `Notification`

Fields include:

- recipient: `userId`
- metadata: `type`, `title`, `message`
- links: `relatedEntityId`, `relatedEntityType`
- state: `isRead`

### 8.7 `Resource`

Fields include:

- core content: `title`, `description`, `type`, `category`, `url`
- optional display: `thumbnailUrl`, `author`, `duration`, `tags`
- publication: `isPublished`, `viewCount`

## 9. Frontend Component and Service Layers

### 9.1 Notable Component Domains

- `components/auth`: login/register forms, protected route.
- `components/forum`: post card/form, comments, category filter.
- `components/therapist`: cards, booking modal, reviews.
- `components/session`: list/card/details/status badge.
- `components/layout`: header/navigation/sidebar/footer.
- `components/home`: marketing sections.
- `components/common`: loading/error/empty/pagination/animations.
- `components/ui`: reusable primitives.

### 9.2 Frontend Service Modules

- `authService`
- `forumService`
- `therapistService`
- `sessionService`
- `notificationService`
- `resourceService`
- `userService`
- `uploadService` (contains `/upload/avatar` helper; backend route not present in current route map)

### 9.3 Hook Modules

- `useAuth`
- `useUser`
- `useForum`
- `useTherapists`
- `useSessions`
- `useNotifications`
- `useDebounce`

## 10. Environment and Configuration

### 10.1 Backend Environment Variables (`backend/.env.example`)

Core:

- `NODE_ENV`
- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`

Email:

- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`
- `EMAIL_FROM`, `EMAIL_FROM_NAME`
- `EMAIL_DISABLE`

Cloudinary:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Optional:

- Redis, Sentry, Stripe, Twilio placeholders

### 10.2 Frontend Environment Variables (`frontend/.env.local.example`)

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`

## 11. Deployment and Runtime Topology

`docker-compose.yml` defines:

- `mongodb` service
- `redis` service
- `backend` service
- `frontend` service
- `nginx` service

Behavior:

- backend depends on healthy MongoDB and Redis.
- frontend depends on backend.
- nginx depends on frontend + backend.
- health checks configured for core services.

Typical local ports in compose:

- MongoDB: `27017`
- Redis: `6379`
- Backend: `5007`
- Frontend: `3000`
- Nginx: `80`, `443`

## 12. Scripts and Developer Workflow

### 12.1 Backend scripts (`backend/package.json`)

- `npm run dev`
- `npm run start`
- `npm test`
- `npm run test:ci`

### 12.2 Frontend scripts (`frontend/package.json`)

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`
- `npm run analyze`

## 13. Testing Status

- Backend Jest setup exists and includes auth/protected-route test files.
- Frontend Jest setup exists and includes sample component tests.
- Overall test maturity appears mixed (some scaffold-level tests likely remain).

## 14. Current Known Inconsistencies and Notes

These are not blockers for this documentation, but are important to understand the current state:

- Port drift across docs/config:
  - Some docs and compose use backend `5007`.
  - Frontend `.env.local.example` default points to `5000`.
- `ProtectedRoute` currently supports `allowTherapistOnly`; some therapist pages pass `requiredRole` prop (not consumed by component).
- `uploadService` frontend helper references `/upload/avatar`, while current backend route map updates avatar through `/users/:id/avatar`.
- Docs mention some files/features (for example Theme context) not present in current source structure.
- Resource frontend page is static curated content; API-backed resource service exists and can be expanded.

## 15. End-to-End Core User Flows

### 15.1 New User to Session Booking

1. User registers.
2. User logs in and lands on dashboard.
3. User browses therapists.
4. User opens therapist profile.
5. User books slot/date/time.
6. Session created as `pending`.
7. Therapist receives notification + booking email.
8. Therapist confirms session.
9. User receives confirmation notification + email.

### 15.2 Session Completion to Review

1. Therapist marks session `completed`.
2. Therapist total session count increments.
3. User submits rating + review.
4. System updates therapist aggregate rating and recent reviews.
5. Therapist receives new-review notification.

### 15.3 Community Support Flow

1. User enters forum and filters by category.
2. User creates anonymous (or named) post.
3. Other users like and comment.
4. Post owner can edit/delete own post.
5. Comment owners can delete own comments.

## 16. Product Positioning Snapshot

SoulSupport combines:

- Clinical support marketplace features (therapist discovery + booking).
- Ongoing care management (dashboards, sessions, reviews).
- Community and educational support (forum + resources).

This creates a three-pillar wellness product:

- one-to-one care,
- peer support,
- self-help content.

## 17. Suggested Next Documentation Files (Optional)

If deeper documentation is desired, create these follow-ups:

- `API_OPENAPI_SPEC.yaml` for machine-readable API contracts.
- `DATA_DICTIONARY.md` for full field-level constraints and examples.
- `QA_TEST_PLAN.md` for scenario-based manual and automated test matrix.
- `SECURITY_RUNBOOK.md` for incident handling and hardening checklist.

---

This document is intended to be a single, detailed source of truth for the current codebase state, including both implemented capabilities and notable mismatches across code and documentation.
