# ☕ brewCoffee — Typeform-style Form Builder SaaS

> A production-ready, full-stack form builder SaaS built on a Turborepo monorepo with tRPC, Zod, Drizzle ORM and Scalar API docs.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-brewcoffee--web.onrender.com-orange?style=for-the-badge)](https://brewcoffee-web.onrender.com)
[![API Docs](https://img.shields.io/badge/API%20Docs-Scalar-blue?style=for-the-badge)](https://brewcoffee-api.onrender.com/docs)
[![GitHub](https://img.shields.io/badge/GitHub-GagansharmaGit%2FbreCoffee--forms-black?style=for-the-badge&logo=github)](https://github.com/GagansharmaGit/breCoffee-forms)

---

## 🎯 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Demo Creator | `demo@brewcoffee.com` | `demo1234` |

> **Note:** The demo account has 3 pre-seeded themed forms with sample submissions ready to explore.

---

## 🚀 Live Links

| Service | URL |
|---------|-----|
| 🌐 Frontend (Web App) | https://brewcoffee-web.onrender.com |
| 🔧 Backend (API) | https://brewcoffee-api.onrender.com |
| 📖 API Documentation (Scalar) | https://brewcoffee-api.onrender.com/docs |
| 📄 OpenAPI JSON | https://brewcoffee-api.onrender.com/openapi.json |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo + pnpm workspaces |
| **Frontend** | Next.js 15, React 19, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express, tRPC v11 |
| **API Schema** | Zod v4 |
| **ORM** | Drizzle ORM |
| **Database** | PostgreSQL (Render managed) |
| **Auth** | JWT (HttpOnly cookies) |
| **API Docs** | Scalar + OpenAPI via `trpc-to-openapi` |
| **Email** | Resend (OTP + Password Reset) |

---

## 📁 Monorepo Structure

```
trpc-monorepo/
├── apps/
│   ├── api/          # Express + tRPC backend server
│   └── web/          # Next.js 15 frontend app
├── packages/
│   ├── database/     # Drizzle ORM schema, models, migrations & seed
│   ├── trpc/         # All tRPC routers, procedures & Zod models
│   ├── services/     # Business logic (UserService, FormService, etc.)
│   ├── logger/       # Winston logger
│   ├── eslint-config/
│   └── typescript-config/
├── turbo.json
└── pnpm-workspace.yaml
```

---

## ✨ Features

### 🔐 Authentication & Creator Access
- Email + Password sign up / sign in
- HttpOnly cookie-based JWT sessions
- OTP email verification flow (via Resend)
- Forgot password / Reset password via email token
- Protected dashboard routes — unauthenticated users redirected to `/signin`

### 📝 Dynamic Form Builder
- Create forms with **title**, **description**, **visibility** and **status**
- Add unlimited fields per form
- **11 field types supported:**
  - `TEXT` — Short text input
  - `LONG_TEXT` — Multi-line textarea
  - `EMAIL` — Email input with validation
  - `NUMBER` — Numeric input
  - `YES_NO` — Boolean toggle
  - `PASSWORD` — Password input
  - `CHECKBOX` — Single checkbox
  - `DROPDOWN` — Single select dropdown
  - `MULTI_SELECT` — Multiple selection
  - `RATING` — Star rating (1–5)
  - `DATE` — Date picker
- Per-field: label, description, placeholder, required/optional toggle, options (for dropdowns/selects)
- Publish / Draft toggle — only PUBLISHED forms accept responses
- **Public** vs **Unlisted** visibility modes

### 🌍 Form Visibility
| Mode | Behavior |
|------|----------|
| `PUBLIC` | Appears on `/explore` page. Anyone can find and submit. |
| `UNLISTED` | Not listed publicly. Only accessible via direct link. |
| `DRAFT` | Not accessible to anyone (not published). |

### 📥 Public Form Submission
- No login required to submit a form
- Zod-validated input on submission
- Graceful 404 for invalid/draft/unpublished forms
- Thank-you confirmation screen after submission

### 📊 Response Analytics & Management
- View all submissions per form in the creator dashboard
- Per-submission detail view with all field values
- Submission count visible on form cards

### 🎨 Themed Sample Forms (Pre-seeded)
| Form | Theme | Type |
|------|-------|------|
| Coffee Shop Feedback | Coffee | PUBLIC |
| Developer Survey 2026 | Dark | PUBLIC |
| Event Registration | Modern | PUBLIC |

### 🌐 Explore Page
- Browse all PUBLIC + PUBLISHED forms
- Direct link to fill any form
- No login required

### 📖 API Documentation
- Full OpenAPI 3.0 spec auto-generated from tRPC routes
- Interactive Scalar UI at `/docs`
- All endpoints grouped by tag: `Authentication`, `Form`, `FormField`, `FormSubmission`

---

## 🚦 What's Built vs What's Pending

### ✅ Implemented
- [x] Full monorepo with Turborepo + pnpm
- [x] tRPC backend with Express
- [x] Zod schema validation for all inputs/outputs
- [x] Drizzle ORM + PostgreSQL
- [x] JWT auth with HttpOnly cookies
- [x] OTP login + password reset flows
- [x] Create / Edit / Publish / Draft forms
- [x] 11 field types with options support
- [x] Public + Unlisted visibility
- [x] Public form submission (no auth)
- [x] Creator response viewer
- [x] Explore page (public forms)
- [x] Landing page with pricing section
- [x] Scalar API docs at `/docs`
- [x] 3 themed seeded forms with submissions
- [x] Demo credentials
- [x] Deployed on Render (separate API + Web services)

### 🔲 Bonus / Pending
- [ ] Rate limiting on submission API (express-rate-limit)
- [ ] CSV export of responses
- [ ] Charts / analytics dashboard
- [ ] Form preview before publishing
- [ ] Conditional field logic
- [ ] Form response limits / expiry
- [ ] Custom form slugs / QR code sharing
- [ ] Password-protected forms
- [ ] Admin dashboard

---

## 🏁 Local Setup

### Prerequisites
- Node.js ≥ 18
- pnpm ≥ 9
- PostgreSQL database (or use the hosted one)

### 1. Clone the repository
```bash
git clone https://github.com/GagansharmaGit/breCoffee-forms.git
cd breCoffee-forms
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables

Create `.env` at the root:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your-super-secret-jwt-key
RESEND_API_KEY=your-resend-api-key   # optional — OTP emails
```

Create `packages/database/.env`:
```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### 4. Run database migrations
```bash
pnpm --filter=@repo/database run db:generate
pnpm --filter=@repo/database run db:migrate
```

### 5. Seed demo data
```bash
pnpm --filter=@repo/database run db:seed
```

This creates:
- Demo user (`demo@brewcoffee.com` / `demo1234`)
- 3 themed forms (Coffee, Dark, Modern) with fields and submissions

### 6. Start the development server
```bash
pnpm dev
```

| App | URL |
|-----|-----|
| Frontend | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

---

## 🔌 API Overview

> Full interactive docs available at: https://brewcoffee-api.onrender.com/docs

### Authentication
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/authentication/createUserWithEmailAndPassword` | ❌ | Register |
| POST | `/api/authentication/signInUserWithEmailAndPassword` | ❌ | Sign in |
| GET | `/api/authentication/getLoggedInUserInfo` | ✅ | Get current user |
| POST | `/api/authentication/generateOTP` | ❌ | Send OTP |
| POST | `/api/authentication/verifyOTP` | ❌ | Verify OTP |
| POST | `/api/authentication/forgetPassword` | ❌ | Request password reset |
| POST | `/api/authentication/resetPassword` | ❌ | Reset password |
| POST | `/api/authentication/logout` | ❌ | Clear session cookie |

### Forms
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/form/createForm` | ✅ | Create a new form |
| PUT | `/api/form/updateForm` | ✅ | Update form (title, status, visibility) |
| GET | `/api/form/listForms` | ✅ | List creator's own forms |
| GET | `/api/form/listPublicForms` | ❌ | List all public forms (explore) |
| GET | `/api/form/getForm?formId=<uuid>` | ❌ | Get form with all fields |

### Form Fields
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/form-field/createField` | ✅ | Add a field to a form |
| GET | `/api/form-field/getFields?formId=<uuid>` | ✅ | Get fields for a form |

### Submissions
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/form-submission/createSubmission` | ❌ | Submit a form response |
| GET | `/api/form-submission/getSubmissionsByFormId?formId=<uuid>` | ✅ | Get all responses for a form |

---

## 🗄️ Database Schema

```
users
  id, fullName, email, passwordHash, createdAt

forms
  id, title, description, visibility (PUBLIC|UNLISTED), status (PUBLISHED|DRAFT),
  createdBy → users.id, createdAt, updatedAt

form_fields
  id, formId → forms.id, label, labelKey, description, placeholder,
  isRequired, index, type (TEXT|LONG_TEXT|EMAIL|NUMBER|YES_NO|PASSWORD|CHECKBOX|DROPDOWN|RATING|DATE|MULTI_SELECT),
  options (text[]), createdAt, updatedAt

form_submissions
  id, formId → forms.id, values (jsonb), createdAt, updatedAt

otps
  id, userId → users.id, code, expiresAt, createdAt

password_reset_tokens
  id, userId → users.id, token, expiresAt, createdAt
```

---

## 🧑‍⚖️ Hackathon Scoring

| Category | Max | Status |
|----------|-----|--------|
| Monorepo Structure & Starter Usage | 10 | ✅ Turborepo + pnpm + separate apps + shared packages |
| Authentication & Creator Access | 10 | ✅ JWT, OTP, password reset, protected routes |
| Dynamic Form Builder | 15 | ✅ 11 field types, publish/draft, visibility modes |
| Zod Schema Design & Validation | 15 | ✅ All I/O validated with Zod v4 |
| Type-Safe APIs With tRPC | 10 | ✅ Full tRPC v11 with OpenAPI adapter |
| Database Design With Drizzle | 10 | ✅ Drizzle ORM, PostgreSQL, migrations |
| Public Form Submission & Response Ingestion | 12 | ✅ No-auth submission, response viewer |
| Analytics & Response Management | 8 | ⚠️ List view done; charts pending |
| Product Experience & Demo Readiness | 7 | ✅ Landing page, explore, seeded demo |
| API Documentation With Scalar | 3 | ✅ Scalar UI at `/docs` |

---

## 👤 Author

**Gagandeep Sharma** — Solo Submission

---

*Built with ☕ and lots of tRPC*
