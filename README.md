# LMS CR

A full-stack Learning Management System (LMS) built with Next.js App Router.

It supports two primary workflows:
- **Learners** can browse courses, enroll, watch chapter videos, and track completion progress.
- **Instructors** can create courses, manage chapters/content, publish or unpublish courses, and review sales analytics.

## Project Overview

This repository contains a monolithic Next.js app with:
- UI routes under `app/` for authentication, learner dashboard/search/player, and teacher course management.
- API routes under `app/api/` for course/chapter CRUD, progress, uploads, checkout, and Stripe webhook handling.
- MongoDB (Mongoose) models in `database/`.
- Server-side data actions in `lib/actions/`.

## Key Features

### Learner-facing
- Clerk sign-in/sign-up flows (`/sign-in`, `/sign-up`)
- Dashboard with in-progress and completed course counts (`/`)
- Course browsing with text and category filtering (`/search`)
- Course player experience (`/courses/[courseId]/chapters/[chapterId]`)
- Paid enrollment via Stripe Checkout
- Chapter completion tracking and progress bar
- Locked chapter handling for non-purchased paid content

### Instructor-facing
- Create new courses (`/teacher/create`)
- Manage owned courses in a table (`/teacher/courses`)
- Course setup page with:
  - title, description, cover image, category, price
  - chapter list and drag-drop reordering
  - attachment uploads
  - publish/unpublish actions
- Chapter editor with title/description/access/video/publish controls
- Revenue and sales analytics page (`/teacher/analytics`)

## Routes / Pages

### Auth
- `/sign-in/[[...sign-in]]`
- `/sign-up/[[...sign-up]]`

### Dashboard & discovery
- `/` – learner dashboard
- `/search` – published course listing and filtering

### Teacher area
- `/teacher/create`
- `/teacher/courses`
- `/teacher/courses/[courseId]`
- `/teacher/courses/[courseId]/chapters/[chapterId]`
- `/teacher/analytics`

### Course consumption
- `/courses/[courseId]` (redirects to first published chapter)
- `/courses/[courseId]/chapters/[chapterId]`

## API Surface (App Router)

Under `app/api`:
- `POST /api/courses`
- `PATCH, DELETE /api/courses/[courseId]`
- `PATCH /api/courses/[courseId]/publish`
- `PATCH /api/courses/[courseId]/unpublish`
- `POST /api/courses/[courseId]/checkout`
- `POST /api/courses/[courseId]/attachments`
- `DELETE /api/courses/[courseId]/attachments/[attachmentId]`
- `POST /api/courses/[courseId]/chapters`
- `PUT /api/courses/[courseId]/chapters/reorder`
- `PATCH, DELETE /api/courses/[courseId]/chapters/[chapterId]`
- `PATCH /api/courses/[courseId]/chapters/[chapterId]/publish`
- `PATCH /api/courses/[courseId]/chapters/[chapterId]/unpublish`
- `PUT /api/courses/[courseId]/chapters/[chapterId]/progress`
- `GET, POST /api/uploadthing`
- `POST /api/webhook` (Stripe webhook)

## Tech Stack

### Core
- **Next.js** `14.2.3` (App Router)
- **React** `18`
- **TypeScript** `^5`
- **Node.js** `24.x` (from `package.json` engines)

### Auth & user management
- **Clerk** (`@clerk/nextjs`)

### Database / persistence
- **MongoDB** + **Mongoose**
- Models: `Profile`, `Course`, `Chapter`, `Category`, `Attachment`, `Purchase`, `UserProgress`, `MuxData`, `StripeCustomer`

### Payments
- **Stripe** (`stripe` + custom webhook handling)

### Media & uploads
- **Mux** (`@mux/mux-node`, `@mux/mux-player-react`) for chapter video assets/playback
- **UploadThing** (`uploadthing`, `@uploadthing/react`) for file/image/video uploads

### UI / styling
- **Tailwind CSS** + `tailwindcss-animate`
- **Radix UI** primitives
- **shadcn/ui** style configuration (`components.json`)
- **Recharts** for analytics charts
- **react-hook-form + zod** for form handling/validation
- **Zustand** for confetti state

## Authentication & Authorization Notes

- Clerk middleware is configured in `middleware.ts`.
- App pages and API handlers also perform server-side auth checks (`auth()` / `currentUser()`).
- Teacher operations are guarded mainly by **course ownership checks** (`course.userId === auth user`) in API routes.
- `Profile.role` supports `STUDENT | TEACHER | ADMIN` in the schema.

## Environment Variables

Copy `.env.example` to `.env.local` and set all required values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=

MONGODB_URL=

UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

NEXT_PUBLIC_APP_URL=

STRIPE_API_KEY=
STRIPE_WEBHOOK_SECRET=
```

## Getting Started

### Prerequisites
- Node.js `24.x` (as declared in `package.json`)
- npm
- MongoDB instance
- Clerk, Stripe, UploadThing, and Mux accounts/credentials

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

From `package.json`:

- `npm run dev` – start development server
- `npm run build` – create production build
- `npm run start` – run production server
- `npm run lint` – run Next.js ESLint checks
- `npm run type` – currently maps to `module` (as defined in repository)

## Linting / Testing / Build

- Linting: `npm run lint`
- Build: `npm run build`
- Tests: **No automated test script is currently defined in `package.json`.**

## Deployment

No deployment configuration (for example, Dockerfile or CI deployment workflow) is included in this repository.

Recommended deployment approach:
1. Set all environment variables in your hosting provider.
2. Run `npm run build`.
3. Start with `npm run start` (or provider-equivalent Next.js runtime command).
4. Configure Stripe webhook delivery to `POST /api/webhook` on your deployed domain.

## Data & Content Notes

- Categories are stored in MongoDB (`Category` model).
- `database/category.modal.ts` includes sample category seed objects in comments for manual insertion.
- Course chapter videos are processed through Mux when chapter `videoUrl` is updated.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make focused changes
4. Run lint/build checks
5. Open a pull request

---
