# SoulSupport Tech Stack and Versions

This file lists the technologies/frameworks currently configured in the workspace, using exact pinned versions where defined.

## Runtime and Platform

| Technology                             | Version                         | Source                  |
| -------------------------------------- | ------------------------------- | ----------------------- |
| Node.js                                | 22 LTS (recommended)            | `backend/README.md`     |
| Node.js (backend container base image) | 18-alpine                       | `backend/Dockerfile`    |
| JavaScript (frontend)                  | ES Modules (`"type": "module"`) | `frontend/package.json` |
| JavaScript (backend)                   | CommonJS (`"type": "commonjs"`) | `backend/package.json`  |

## Frontend Framework and Core

| Technology | Version | Source                  |
| ---------- | ------- | ----------------------- |
| Next.js    | 16.1.6  | `frontend/package.json` |
| React      | 19.2.4  | `frontend/package.json` |
| React DOM  | 19.2.4  | `frontend/package.json` |
| TypeScript | 5.9.3   | `frontend/package.json` |

## Frontend UI, State, and Utility Libraries

| Technology            | Version | Source                  |
| --------------------- | ------- | ----------------------- |
| @tanstack/react-query | 5.90.21 | `frontend/package.json` |
| axios                 | 1.13.6  | `frontend/package.json` |
| clsx                  | 2.1.1   | `frontend/package.json` |
| date-fns              | 4.1.0   | `frontend/package.json` |
| framer-motion         | 12.35.2 | `frontend/package.json` |
| lucide-react          | 0.577.0 | `frontend/package.json` |
| ogl                   | 1.0.11  | `frontend/package.json` |
| react-hot-toast       | 2.6.0   | `frontend/package.json` |
| tailwind-merge        | 3.5.0   | `frontend/package.json` |
| three                 | 0.183.2 | `frontend/package.json` |

## Frontend Styling and Tooling

| Technology              | Version | Source                  |
| ----------------------- | ------- | ----------------------- |
| tailwindcss             | 4.2.1   | `frontend/package.json` |
| @tailwindcss/forms      | 0.5.11  | `frontend/package.json` |
| @tailwindcss/postcss    | 4.2.1   | `frontend/package.json` |
| @tailwindcss/typography | 0.5.19  | `frontend/package.json` |
| postcss                 | 8.5.8   | `frontend/package.json` |
| eslint                  | 9.39.4  | `frontend/package.json` |
| eslint-config-next      | 16.1.6  | `frontend/package.json` |
| @next/bundle-analyzer   | 16.1.6  | `frontend/package.json` |
| @types/node             | 25.4.0  | `frontend/package.json` |
| @types/react            | 19.2.14 | `frontend/package.json` |

## Backend Framework and Core Libraries

| Technology         | Version | Source                 |
| ------------------ | ------- | ---------------------- |
| express            | 5.2.1   | `backend/package.json` |
| mongoose           | 9.3.0   | `backend/package.json` |
| dotenv             | 17.3.1  | `backend/package.json` |
| cors               | 2.8.6   | `backend/package.json` |
| helmet             | 8.1.0   | `backend/package.json` |
| morgan             | 1.10.1  | `backend/package.json` |
| winston            | 3.19.0  | `backend/package.json` |
| joi                | 18.0.2  | `backend/package.json` |
| jsonwebtoken       | 9.0.3   | `backend/package.json` |
| bcrypt             | 6.0.0   | `backend/package.json` |
| multer             | 2.1.1   | `backend/package.json` |
| nodemailer         | 8.0.2   | `backend/package.json` |
| cloudinary         | 2.9.0   | `backend/package.json` |
| express-rate-limit | 8.3.1   | `backend/package.json` |
| date-fns           | 4.1.0   | `backend/package.json` |

## Testing and Dev Tools

| Technology     | Version | Source                 |
| -------------- | ------- | ---------------------- |
| jest (backend) | 30.3.0  | `backend/package.json` |
| supertest      | 7.2.2   | `backend/package.json` |
| nodemon        | 3.1.14  | `backend/package.json` |

## Notes

- Frontend `mongoose` dead code has been removed.
- Frontend scripts currently use webpack mode (`next dev --webpack`, `next build --webpack`) for stable builds.
- Tailwind CSS v4 plugins are loaded via CSS `@plugin` directives in `src/app/globals.css`.
