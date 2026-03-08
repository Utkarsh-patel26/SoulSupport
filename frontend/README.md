# SoulSupport Frontend

## Overview

Frontend application for SoulSupport online therapy platform built with Next.js 14, React 18, and Tailwind CSS.

## Features

- User authentication and registration
- Therapist discovery and booking
- Community forum
- User and therapist dashboards
- Session management
- Real-time notifications
- Responsive design

## Prerequisites

- Node.js 18+
- Running backend API (see backend README)

## Installation

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.local.example .env.local
# Edit .env.local with your configuration
```

3. Start development server:

```bash
npm run dev
```

4. Open browser: http://localhost:3000

## Project Structure

```
src/
├── app/               # Next.js App Router pages
│   ├── layout.js      # Root layout
│   ├── page.js        # Home page
│   ├── login/         # Login page
│   ├── register/      # Registration page
│   └── ...
├── components/        # Reusable components
├── context/           # React Context providers
├── hooks/             # Custom React hooks
├── lib/               # Utilities and helpers
├── services/          # API service layer
└── styles/            # Additional styles
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

See `.env.local.example` for required environment variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=SoulSupport
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://127.0.0.1:27017/soulsupport
JWT_SECRET=replace-with-backend-jwt-secret
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxx
```

## AI Dashboard Assistant

The project includes a user-only AI assistant available at `/dashboard/assistant`.

### What it does

- Provides supportive mental wellness guidance (non-diagnostic)
- Answers platform usage questions (booking, cancelling, session flow)
- Uses user-specific context (upcoming/cancelled/completed sessions + recent forum activity)
- Supports smart intents like:
  - `Show my upcoming appointments`
  - `Who is my therapist tomorrow?`
  - `How do I cancel my session?`
  - `Give me stress relief tips`

### Backend route

- Path: `src/app/api/chat/route.js`
- Methods:
  - `GET /api/chat` - returns last 15 messages for authenticated user
  - `POST /api/chat` - sends message, injects context, streams assistant response
- Model: `stepfun/step-3.5-flash:free` via OpenRouter

### Security guarantees

- Chat route validates `Authorization: Bearer <token>` server-side
- JWT is verified with `JWT_SECRET`
- Access is restricted to users with `userType === 'user'`
- Chat history is isolated by `userId`
- OpenRouter API key is server-only and never exposed to the client bundle

### Chat storage

- Collection: `chat_messages`
- Schema fields:
  - `userId`
  - `role` (`user` or `assistant`)
  - `message`
  - `timestamp`

### Error handling

- Returns `401` for missing/invalid auth
- Returns `403` for therapist/admin access attempts
- Returns `400` for invalid message input
- Returns `502` for upstream provider errors

## Key Features Implementation

### Authentication

- JWT token-based authentication
- Protected routes
- Automatic token refresh
- Role-based access control

### State Management

- React Context API for global state
- React Query for server state (planned)
- Local storage for persistence

### Styling

- Tailwind CSS utility classes
- Custom component library
- Responsive design
- Dark mode support (planned)

## Development Guidelines

### Code Style

- Use functional components
- Follow React hooks best practices
- Use TypeScript types (when migrating to TS)
- Keep components small and focused

### File Naming

- Components: PascalCase (Button.jsx)
- Pages: lowercase (page.js)
- Services: camelCase (authService.js)
- Utilities: camelCase (utils.js)

## Building for Production

1. Create production build:

```bash
npm run build
```

2. Start production server:

```bash
npm start
```

## Deployment

### Vercel (Recommended)

```bash
vercel --prod
```

### Other Platforms

1. Build the application
2. Deploy the `.next` folder
3. Set environment variables
4. Start the server with `npm start`

## License

MIT
