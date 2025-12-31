# SoulSupport System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │  Browser   │  │   Mobile   │  │   Tablet   │                │
│  │  (Chrome,  │  │  (Future)  │  │  (Future)  │                │
│  │  Firefox)  │  │            │  │            │                │
│  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘                │
│         │                │                │                      │
│         └────────────────┴────────────────┘                      │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                           │ HTTPS
                           │
┌──────────────────────────▼───────────────────────────────────────┐
│                    FRONTEND LAYER (Next.js 14)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Pages (App Router)                       │  │
│  │  - Home, Login, Register, Dashboard                       │  │
│  │  - Forum, Therapists, Sessions, Profile                   │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │              React Components                             │  │
│  │  - UI Components (Button, Card, Modal, etc.)             │  │
│  │  - Feature Components (Forum, Therapist, Session)        │  │
│  │  - Layout Components (Header, Footer, Sidebar)           │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │              State Management                             │  │
│  │  - React Context (Auth, User)                            │  │
│  │  - Custom Hooks (useAuth, useUser)                       │  │
│  │  - Local Storage (Token persistence)                     │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │              API Service Layer                            │  │
│  │  - Axios Instance (with interceptors)                    │  │
│  │  - Service Modules (auth, forum, therapist, session)     │  │
│  │  - Error Handling                                         │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        │ HTTP/REST API
                        │ (JSON)
┌───────────────────────▼──────────────────────────────────────────┐
│                  BACKEND LAYER (Express.js)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   API Routes                               │  │
│  │  - /api/auth       - /api/therapists                      │  │
│  │  - /api/forum      - /api/sessions                        │  │
│  │  - /api/reviews    - /api/notifications                   │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                  Middleware Layer                          │  │
│  │  - Authentication (JWT verification)                      │  │
│  │  - Validation (Joi schemas)                               │  │
│  │  - Error Handling                                         │  │
│  │  - Rate Limiting                                          │  │
│  │  - Security (Helmet, CORS, XSS)                          │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                   Controllers                              │  │
│  │  - Business Logic                                         │  │
│  │  - Request/Response Handling                              │  │
│  │  - Service Integration                                    │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                   Services Layer                           │  │
│  │  - Email Service (Nodemailer)                            │  │
│  │  - Upload Service (Cloudinary)                           │  │
│  │  - Notification Service                                   │  │
│  │  - Rating Service                                         │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
│  ┌────────────────────▼──────────────────────────────────────┐  │
│  │                 Data Access Layer                          │  │
│  │  - Mongoose Models                                        │  │
│  │  - Query Builders                                         │  │
│  │  - Validators                                             │  │
│  └────────────────────┬──────────────────────────────────────┘  │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        │ MongoDB Wire Protocol
                        │
┌───────────────────────▼──────────────────────────────────────────┐
│                    DATABASE LAYER (MongoDB)                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Users     │  │   Forum     │  │  Sessions   │             │
│  │ Collection  │  │  Posts      │  │ Collection  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ Therapist   │  │  Reviews    │  │Notifications│             │
│  │  Profiles   │  │ Collection  │  │ Collection  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                   │
│  ┌─────────────┐                                                 │
│  │ Resources   │                                                 │
│  │ Collection  │                                                 │
│  └─────────────┘                                                 │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  Cloudinary  │  │    Gmail     │  │   SendGrid   │          │
│  │ (Image CDN)  │  │   (Email)    │  │   (Email)    │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### User Authentication Flow

```
┌─────────┐                ┌──────────┐              ┌──────────┐
│ Browser │                │ Frontend │              │ Backend  │
└────┬────┘                └────┬─────┘              └────┬─────┘
     │                          │                         │
     │ 1. Enter credentials     │                         │
     ├─────────────────────────>│                         │
     │                          │                         │
     │                          │ 2. POST /api/auth/login │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │                         │ 3. Verify
     │                          │                         │    password
     │                          │                         │
     │                          │ 4. JWT token + user     │
     │                          │<────────────────────────┤
     │                          │                         │
     │                          │ 5. Save token           │
     │                          │    (localStorage)       │
     │                          │                         │
     │ 6. Redirect to dashboard │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
     │ 7. GET /api/auth/me      │                         │
     │                          ├────────────────────────>│
     │                          │                         │
     │                          │                         │ 8. Verify
     │                          │                         │    JWT
     │                          │                         │
     │                          │ 9. User data            │
     │                          │<────────────────────────┤
     │                          │                         │
     │ 10. Display dashboard    │                         │
     │<─────────────────────────┤                         │
     │                          │                         │
```

### Session Booking Flow

```
┌──────┐      ┌─────────┐      ┌────────┐      ┌──────────┐
│ User │      │Frontend │      │Backend │      │ Database │
└──┬───┘      └────┬────┘      └───┬────┘      └────┬─────┘
   │               │                │                │
   │ 1. Browse     │                │                │
   │   therapists  │                │                │
   ├──────────────>│                │                │
   │               │ 2. GET         │                │
   │               │   /therapists  │                │
   │               ├───────────────>│                │
   │               │                │ 3. Find        │
   │               │                │   therapists   │
   │               │                ├───────────────>│
   │               │                │<───────────────┤
   │               │<───────────────┤                │
   │ 4. Select     │                │                │
   │   therapist   │                │                │
   │   and time    │                │                │
   ├──────────────>│                │                │
   │               │ 5. POST        │                │
   │               │   /sessions    │                │
   │               ├───────────────>│                │
   │               │                │ 6. Check       │
   │               │                │   availability │
   │               │                ├───────────────>│
   │               │                │<───────────────┤
   │               │                │                │
   │               │                │ 7. Create      │
   │               │                │   session      │
   │               │                ├───────────────>│
   │               │                │<───────────────┤
   │               │                │                │
   │               │                │ 8. Send email  │
   │               │                │   notification │
   │               │                │                │
   │               │<───────────────┤                │
   │               │                │                │
   │ 9. Booking    │                │                │
   │   confirmed   │                │                │
   │<──────────────┤                │                │
   │               │                │                │
```

### Forum Post Creation Flow

```
┌──────┐      ┌─────────┐      ┌────────┐      ┌──────────┐
│ User │      │Frontend │      │Backend │      │ Database │
└──┬───┘      └────┬────┘      └───┬────┘      └────┬─────┘
   │               │                │                │
   │ 1. Create     │                │                │
   │   new post    │                │                │
   ├──────────────>│                │                │
   │               │                │                │
   │ 2. Fill form  │                │                │
   │   (title,     │                │                │
   │   content,    │                │                │
   │   category)   │                │                │
   ├──────────────>│                │                │
   │               │                │                │
   │               │ 3. POST        │                │
   │               │   /forum/posts │                │
   │               ├───────────────>│                │
   │               │                │                │
   │               │                │ 4. Validate    │
   │               │                │   input        │
   │               │                │                │
   │               │                │ 5. Create post │
   │               │                ├───────────────>│
   │               │                │<───────────────┤
   │               │                │                │
   │               │                │ 6. Notify      │
   │               │                │   followers    │
   │               │                │                │
   │               │<───────────────┤                │
   │               │                │                │
   │ 7. Show       │                │                │
   │   success     │                │                │
   │   & redirect  │                │                │
   │<──────────────┤                │                │
   │               │                │                │
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Network Security                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - HTTPS/TLS encryption                                 │ │
│  │ - CORS (origin validation)                             │ │
│  │ - Helmet (HTTP headers)                                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 2: Authentication                                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - JWT tokens (7-day expiration)                        │ │
│  │ - Bcrypt password hashing (12 rounds)                  │ │
│  │ - Token verification middleware                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 3: Authorization                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - Role-based access control (user/therapist)           │ │
│  │ - Resource ownership validation                        │ │
│  │ - Protected routes                                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 4: Input Validation                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - Joi schema validation                                │ │
│  │ - MongoDB injection prevention                         │ │
│  │ - XSS protection                                       │ │
│  │ - Request sanitization                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 5: Rate Limiting                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - Auth endpoints: 5 requests/15 min                    │ │
│  │ - Post creation: 10 requests/hour                      │ │
│  │ - Global: 100 requests/15 min                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
│  Layer 6: Data Protection                                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ - Environment variables for secrets                    │ │
│  │ - Password reset tokens (1-hour expiration)            │ │
│  │ - Secure session handling                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Production Setup                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              CDN (Cloudflare/CloudFront)             │   │
│  │              - Static assets caching                 │   │
│  │              - DDoS protection                       │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │           Frontend (Vercel/Netlify)                  │   │
│  │           - Next.js application                      │   │
│  │           - Auto-scaling                             │   │
│  │           - Edge deployment                          │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│                          │ API Calls                         │
│                          │                                   │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │        Load Balancer (optional)                      │   │
│  └───────────────────────┬──────────────────────────────┘   │
│                          │                                   │
│         ┌────────────────┼────────────────┐                 │
│         │                │                │                 │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐         │
│  │  Backend    │  │  Backend    │  │  Backend    │         │
│  │  Instance 1 │  │  Instance 2 │  │  Instance 3 │         │
│  │  (Railway/  │  │  (Railway/  │  │  (Railway/  │         │
│  │  Heroku/    │  │  Heroku/    │  │  Heroku/    │         │
│  │  DigitalOcn)│  │  DigitalOcn)│  │  DigitalOcn)│         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘         │
│         │                │                │                 │
│         └────────────────┼────────────────┘                 │
│                          │                                   │
│  ┌───────────────────────▼──────────────────────────────┐   │
│  │         MongoDB Atlas (Replica Set)                  │   │
│  │         - Primary + 2 Secondaries                    │   │
│  │         - Auto-backup                                │   │
│  │         - Point-in-time recovery                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              External Services                       │   │
│  │  - Cloudinary (Image CDN)                           │   │
│  │  - SendGrid/Gmail (Email)                           │   │
│  │  - Sentry (Error tracking)                          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Summary

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Stack                        │
├─────────────────────────────────────────────────────────┤
│ Framework:      Next.js 14 (App Router)                 │
│ UI Library:     React 18                                │
│ Styling:        Tailwind CSS 3.3+                       │
│ HTTP Client:    Axios                                   │
│ State:          React Context API                       │
│ Forms:          React Hook Form + Zod (planned)         │
│ Notifications:  React Hot Toast                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    Backend Stack                         │
├─────────────────────────────────────────────────────────┤
│ Runtime:        Node.js 18+                             │
│ Framework:      Express.js 4.18+                        │
│ Database:       MongoDB 6.0+ (Mongoose ODM)             │
│ Auth:           JWT + Bcrypt                            │
│ Validation:     Joi                                     │
│ Upload:         Multer + Cloudinary                     │
│ Email:          Nodemailer                              │
│ Security:       Helmet, CORS, Rate Limiting             │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                   Database Schema                        │
├─────────────────────────────────────────────────────────┤
│ Collections:    7 main collections                      │
│ - users (authentication, profiles)                      │
│ - therapistProfiles (therapist info)                    │
│ - forumPosts (with embedded comments)                   │
│ - sessions (booking records)                            │
│ - reviews (ratings and feedback)                        │
│ - notifications (user alerts)                           │
│ - resources (mental health content)                     │
└─────────────────────────────────────────────────────────┘
```

---

This architecture provides:

- ✅ Scalability through horizontal scaling
- ✅ Security through multi-layer protection
- ✅ Performance through caching and CDN
- ✅ Reliability through replication
- ✅ Maintainability through clean separation of concerns
