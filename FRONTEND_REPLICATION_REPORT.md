# Soul Support Platform - Frontend Replication Report

**Date:** February 4, 2026  
**Project Name:** Soul Support Platform  
**Tech Stack:** Next.js 16 + React 19 + TypeScript + Tailwind CSS

---

## 📋 Executive Summary

This report contains all necessary information to replicate the Soul Support Platform frontend in another project. It includes complete dependency specifications, configuration details, folder structure, and technical setup requirements.

---

## 🏗️ Project Structure

```
soul-support-platform/
├── app/                          # Next.js App Router directory
│   ├── layout.tsx               # Root layout with ThemeProvider
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles with Tailwind & CSS variables
│   ├── about/
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── student/
│   │   │   └── page.tsx
│   │   └── therapist/
│   │       └── page.tsx
│   ├── forum/
│   │   └── page.tsx
│   ├── resources/
│   │   └── page.tsx
│   └── therapists/
│       └── page.tsx
│
├── components/                   # React components
│   ├── animated-background.tsx
│   ├── footer.tsx
│   ├── glass-card.tsx
│   ├── navbar.tsx
│   ├── scroll-animations.tsx
│   ├── theme-provider.tsx       # Next-themes wrapper
│   ├── theme-toggle.tsx         # Dark mode toggle
│   ├── dashboard/
│   │   └── sidebar.tsx
│   ├── landing/
│   │   ├── cta.tsx
│   │   ├── features.tsx
│   │   ├── hero.tsx
│   │   ├── how-it-works.tsx
│   │   ├── testimonials.tsx
│   │   └── therapist-spotlight.tsx
│   └── ui/                       # shadcn/ui component library
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button-group.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── empty.tsx
│       ├── field.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-group.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── item.tsx
│       ├── kbd.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── spinner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/                          # Utility functions
│   └── utils.ts                  # cn() function for class merging
│
├── public/                       # Static assets
│   └── [icons and images]
│
├── styles/                       # Additional styles
│   └── globals.css
│
├── Configuration Files
│   ├── components.json           # shadcn/ui configuration
│   ├── next.config.mjs           # Next.js configuration
│   ├── tsconfig.json             # TypeScript configuration
│   ├── postcss.config.mjs        # PostCSS configuration
│   ├── tailwind.config.ts        # Tailwind CSS configuration
│   ├── package.json              # Dependencies and scripts
│   └── pnpm-lock.yaml            # Package lock file
```

---

## 📦 Dependencies (Production)

### Core Framework

```json
{
  "next": "16.0.10",
  "react": "19.2.0",
  "react-dom": "19.2.0"
}
```

### UI Component Library (shadcn/ui + Radix UI)

```json
{
  "@radix-ui/react-accordion": "1.2.2",
  "@radix-ui/react-alert-dialog": "1.1.4",
  "@radix-ui/react-aspect-ratio": "1.1.1",
  "@radix-ui/react-avatar": "1.1.2",
  "@radix-ui/react-checkbox": "1.1.3",
  "@radix-ui/react-collapsible": "1.1.2",
  "@radix-ui/react-context-menu": "2.2.4",
  "@radix-ui/react-dialog": "1.1.4",
  "@radix-ui/react-dropdown-menu": "2.1.4",
  "@radix-ui/react-hover-card": "1.1.4",
  "@radix-ui/react-label": "2.1.1",
  "@radix-ui/react-menubar": "1.1.4",
  "@radix-ui/react-navigation-menu": "1.2.3",
  "@radix-ui/react-popover": "1.1.4",
  "@radix-ui/react-progress": "1.1.1",
  "@radix-ui/react-radio-group": "1.2.2",
  "@radix-ui/react-scroll-area": "1.2.2",
  "@radix-ui/react-select": "2.1.4",
  "@radix-ui/react-separator": "1.1.1",
  "@radix-ui/react-slider": "1.2.2",
  "@radix-ui/react-slot": "1.1.1",
  "@radix-ui/react-switch": "1.1.2",
  "@radix-ui/react-tabs": "1.1.2",
  "@radix-ui/react-toast": "1.2.4",
  "@radix-ui/react-toggle": "1.1.1",
  "@radix-ui/react-toggle-group": "1.1.1",
  "@radix-ui/react-tooltip": "1.1.6"
}
```

### Form & Validation

```json
{
  "@hookform/resolvers": "^3.10.0",
  "react-hook-form": "^7.60.0",
  "zod": "3.25.76"
}
```

### Styling & UI Utilities

```json
{
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.3.1",
  "tailwindcss-animate": "^1.0.7",
  "next-themes": "^0.4.6"
}
```

### Data Visualization & Charts

```json
{
  "recharts": "2.15.4",
  "embla-carousel-react": "8.5.1"
}
```

### Animations

```json
{
  "framer-motion": "12.31.0"
}
```

### Other Utilities

```json
{
  "@emotion/is-prop-valid": "latest",
  "@vercel/analytics": "1.3.1",
  "autoprefixer": "^10.4.20",
  "cmdk": "1.0.4",
  "date-fns": "4.1.0",
  "input-otp": "1.4.1",
  "lucide-react": "^0.454.0",
  "react-day-picker": "9.8.0",
  "react-resizable-panels": "^2.1.7",
  "sonner": "^1.7.4",
  "vaul": "^1.1.2"
}
```

---

## 🛠️ Dev Dependencies

```json
{
  "@tailwindcss/postcss": "^4.1.9",
  "@types/node": "^22",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "postcss": "^8.5",
  "tailwindcss": "^4.1.9",
  "tw-animate-css": "1.3.3",
  "typescript": "^5"
}
```

---

## ⚙️ Configuration Files

### 1. **package.json**

```json
{
  "name": "my-v0-project",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "build": "next build",
    "dev": "next dev",
    "lint": "eslint .",
    "start": "next start"
  }
}
```

**Scripts:**

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### 2. **tsconfig.json**

Key settings:

- **Target:** ES6
- **Module:** esnext
- **JSX:** preserve (for Next.js)
- **Paths:** `@/*` → `./*` (root alias)
- **Strict Mode:** enabled
- **Skip Lib Check:** true

### 3. **components.json** (shadcn/ui config)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Key Points:**

- **Style:** New York (shadcn style)
- **RSC:** True (React Server Components enabled)
- **CSS Handling:** Uses CSS variables for theming
- **Icon Library:** lucide-react

### 4. **next.config.mjs**

```javascript
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};
export default nextConfig;
```

**Settings:**

- Ignore TypeScript build errors (for development)
- Unoptimized images (for static export capability)

### 5. **postcss.config.mjs**

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### 6. **app/globals.css**

- Uses `@import 'tailwindcss'` for Tailwind CSS v4
- Defines CSS custom properties (variables) for theme colors
- Uses OKLch color space for better color accuracy
- Supports light and dark modes via `.dark` class selector
- Includes CSS variables for:
  - Background, foreground, cards, borders
  - Primary, secondary, accent colors
  - Chart colors (chart-1 through chart-5)
  - Sidebar styling
  - Component radius

**Theme Colors (Light Mode - OKLch format):**

- Primary: `oklch(0.6 0.15 180)` - Teal
- Accent: `oklch(0.7 0.12 280)` - Purple
- Secondary: `oklch(0.95 0.02 280)` - Light Purple
- Destructive: `oklch(0.577 0.245 27.325)` - Red

---

## 🎨 Styling System

### Technology Stack

- **Tailwind CSS v4.1.9** - Utility-first CSS framework
- **CSS Variables** - Dynamic theming with OKLch color space
- **tw-animate-css** - Additional animation utilities
- **PostCSS** - CSS processing

### Theme Features

- **Light Mode:** Light neutral backgrounds with teal primary color
- **Dark Mode:** Dark backgrounds (oklch(0.13 0.02 250)) with teal primary
- **OKLch Colors:** Modern perceptually uniform color space
- **CSS Variables:** All colors as CSS custom properties for easy overriding
- **Responsive:** Mobile-first Tailwind approach

### Key CSS Variables

```css
:root {
  --background: oklch(0.98 0.005 180);
  --foreground: oklch(0.2 0.02 250);
  --primary: oklch(0.6 0.15 180); /* Teal */
  --accent: oklch(0.7 0.12 280); /* Purple */
  --secondary: oklch(0.95 0.02 280); /* Light purple */
  --border: oklch(0.9 0.02 180);
  --radius: 1rem;
  --sidebar: oklch(0.99 0.005 180);
}

.dark {
  --background: oklch(0.13 0.02 250);
  --foreground: oklch(0.95 0.01 180);
  /* ... dark mode variables */
}
```

---

## 🔧 Utilities & Helpers

### cn() Function (lib/utils.ts)

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Purpose:** Merge Tailwind classes while handling class name conflicts
**Usage:** `className={cn("px-4", isActive && "bg-primary")}`

---

## 🎭 Theme Management

### Implementation (components/theme-provider.tsx)

- Uses **next-themes** for theme persistence
- Providers:
  - ThemeProvider wrapper in root layout
  - theme-toggle.tsx component for UI toggle
  - theme-provider.tsx component configures next-themes

### Features

- Supports light/dark mode
- Persists user preference
- Respects system preference
- CSS class-based theming (`.dark` class)

---

## 📱 Responsive Design

### Mobile Detection Hook (hooks/use-mobile.ts)

Custom hook for detecting mobile breakpoints

- Used in components like sidebars, navigation
- Enables responsive UI patterns

### Responsive Utilities

- Tailwind's responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Mobile-first approach

---

## 🚀 Build & Deployment

### Build Process

```bash
# Development
npm run dev          # http://localhost:3000

# Production
npm run build        # Builds Next.js app
npm run start        # Runs production server
```

### Next.js Configuration

- **App Router:** New Next.js 16 App Router (app/ directory)
- **Image Optimization:** Disabled (`unoptimized: true`)
- **TypeScript:** Strict mode with build error ignoring

### Static Export Capability

The `images.unoptimized: true` setting enables static export if needed

---

## 🔍 Component Categories

### Landing Components (components/landing/)

- **hero.tsx** - Hero section with CTA
- **features.tsx** - Feature list
- **how-it-works.tsx** - Process explanation
- **testimonials.tsx** - User testimonials
- **therapist-spotlight.tsx** - Featured therapists
- **cta.tsx** - Call-to-action section

### Layout Components

- **navbar.tsx** - Navigation bar
- **footer.tsx** - Footer
- **glass-card.tsx** - Glass-morphism card component
- **theme-toggle.tsx** - Dark mode toggle button

### Dashboard Components (components/dashboard/)

- **sidebar.tsx** - Dashboard sidebar navigation

### Animation Components

- **animated-background.tsx** - Background animations
- **scroll-animations.tsx** - Scroll-triggered animations
- Uses **framer-motion** for animations

### UI Component Library (components/ui/)

- Complete shadcn/ui component set (40+ components)
- Based on Radix UI primitives
- Styled with Tailwind CSS
- Includes:
  - Form components: Input, Textarea, Select, Checkbox, Radio, etc.
  - Display components: Card, Avatar, Badge, Alert, etc.
  - Complex components: Accordion, Tabs, Dialog, Drawer, etc.
  - Data components: Table, Chart, Carousel, Calendar, etc.

### Custom Hooks (hooks/)

- **use-toast.ts** - Toast notification hook
- **use-mobile.ts** - Mobile detection hook

---

## 📋 Page Routes (App Router)

```
/ (home)
/about
/dashboard/student
/dashboard/therapist
/forum
/resources
/therapists
```

---

## 🎯 Key Features to Replicate

1. **Modern Next.js 16 Setup** - Latest version with App Router
2. **React 19** - Latest React version
3. **Complete shadcn/ui Library** - 40+ pre-built components
4. **Dark Mode Support** - Full theme switching with next-themes
5. **Animation System** - Framer Motion with scroll animations
6. **Form Handling** - React Hook Form + Zod validation
7. **Data Visualization** - Recharts for charts
8. **Accessibility** - Radix UI primitives ensure WCAG compliance
9. **TypeScript** - Full type safety
10. **Responsive Design** - Mobile-first Tailwind approach

---

## 💾 Package Manager

**pnpm** is used (evidenced by pnpm-lock.yaml)

Install dependencies:

```bash
pnpm install
```

---

## ✅ Replication Checklist

When setting up the replica:

- [ ] Initialize new Next.js 16 project with TypeScript
- [ ] Install all dependencies from package.json
- [ ] Copy tsconfig.json configuration
- [ ] Copy next.config.mjs configuration
- [ ] Copy postcss.config.mjs configuration
- [ ] Copy components.json (shadcn/ui config)
- [ ] Copy app/globals.css with all CSS variables
- [ ] Copy all files from app/ directory (routes)
- [ ] Copy all files from components/ directory
- [ ] Copy all files from hooks/ directory
- [ ] Copy all files from lib/ directory
- [ ] Copy public/ assets folder
- [ ] Ensure pnpm is installed
- [ ] Run `pnpm install`
- [ ] Test with `pnpm dev`

---

## 🔗 Important Links & References

- **Next.js:** https://nextjs.org
- **React:** https://react.dev
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **next-themes:** https://github.com/pacocoursey/next-themes
- **Radix UI:** https://www.radix-ui.com
- **Framer Motion:** https://www.framer.com/motion/
- **React Hook Form:** https://react-hook-form.com
- **Zod:** https://zod.dev

---

## 📝 Notes

- The project uses CSS variables for theming, making it easy to customize colors
- OKLch color space provides better color accuracy than traditional RGB/HSL
- All components are styled with Tailwind CSS utilities
- The project is fully typed with TypeScript
- Uses newer React features (hooks, server components)
- Analytics tracking via Vercel Analytics

---

## 🚨 Important Reminders

1. **Icon Library:** All icons come from **lucide-react**
2. **Component Style:** Uses shadcn/ui "New York" style
3. **RSC:** React Server Components are enabled in next.config
4. **Tailwind v4:** Uses the newer Tailwind CSS v4.x syntax
5. **Import Paths:** All imports use `@/` alias pointing to project root
6. **Font:** Uses Google's **Inter** font

---

**End of Report**
