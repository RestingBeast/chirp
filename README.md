# Chirp

> AI-powered async standups for engineering teams.

## Overview

### Problem

Daily standup meetings are a coordination tax. For distributed or async-first teams, a 15-minute synchronous call to share three sentences is inefficient, it interrupts deep work, excludes team members in different timezones, and produces no persistent, searchable record of what was discussed.

### Outcome

Chirp is an invite-only standup board where team members post daily updates asynchronously. An admin can trigger an AI digest that synthesises all updates into a concise team health summary — replacing the standup meeting entirely.

- Team members post standups in under two minutes from any device.
- Admins receive a 3-sentence AI-generated digest covering yesterday's progress, today's focus, and active blockers.
- Historical standups are browsable by date via a calendar picker.
- Role-based access control separates admin capabilities (team management, digest generation) from member capabilities (posting and editing standups).

---

## Demo

**Admin flow:**

1. Admin registers and creates a team.
2. Admin generates an invite link for a specific email address and team.
3. Invitee receives the link, registers via `/join?token=...`, and is automatically assigned to the team.
4. Admin views the board at `/board?teamId=...`, sees all submitted standups, and clicks **Generate AI Digest**.
5. Admin can browse past dates via the calendar picker in the board header.
6. Admin can delete empty teams or remove members from the admin dashboard.

**Member flow:**

1. Member registers via invite link — no open signup.
2. Member posts their daily standup at `/standup/new` with three fields: Yesterday, Today, Blockers.
3. Member can edit their standup for the current day only.
4. Member views the team board showing all colleagues' updates with a green/pending indicator per member.

> Screenshots / GIFs to be added.

---

## Technology Stack

### Frontend

| Technology              | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| Next.js 15 (App Router) | Framework, server components, routing                     |
| TypeScript              | Type safety across all frontend code                      |
| Tailwind CSS            | Utility-first styling                                     |
| shadcn/ui (Base UI)     | Component library — forms, dialogs, cards, calendar       |
| Zustand                 | Client-side auth state (user profile only, not token)     |
| Next.js Server Actions  | All API calls from the frontend — token stays server-side |
| jose                    | JWT verification in Server Components and middleware      |
| react-day-picker        | Calendar date selection                                   |
| Sonner                  | Toast notifications                                       |

### Backend

| Technology                   | Purpose                                 |
| ---------------------------- | --------------------------------------- |
| Express.js                   | REST API server                         |
| Mongoose                     | MongoDB ODM                             |
| MongoDB Atlas                | Cloud database                          |
| jsonwebtoken                 | JWT signing and verification            |
| bcrypt                       | Password hashing (12 salt rounds)       |
| Zod                          | Request body validation                 |
| express-rate-limit           | Rate limiting (general + auth-specific) |
| nanoid                       | Invite token generation                 |
| Provider-agnostic AI adapter | Abstraction over Groq/Claude/Gemini     |
| Groq (Llama 3.3 70B)         | AI team digest generation               |

---

## Development Approach with AI

### AI Tools & Services

| Tool / Model         | Purpose                                                                |
| -------------------- | ---------------------------------------------------------------------- |
| Groq — Llama 3.3 70B | Generates team health digest from standup submissions                  |
| Claude (Anthropic)   | Development assistant — architecture, code generation, security review |
| Gemini (Google)      | Development assistant - code generation, debugging                     |

### AI Adapter Pattern

Identical to Sonic-Self — the AI provider is resolved from an environment variable, and all providers implement the same `generateNarrative(prompt)` interface.

```
services/ai/
├── index.js            ← resolves AI_PROVIDER from env
└── adapters/
    └── groqAdapter.js  ← Llama 3.3 via Groq SDK
```

### Key Review Points & Decisions

| Review Point                   | Decision                                                                                                                                                                                                     |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Auth strategy                  | JWT in httpOnly cookie, set by Next.js Server Action — token never exposed to client JS                                                                                                                      |
| JWT verification               | Replaced `jwt-decode` (no signature check) with `jose`'s `jwtVerify` in all server-side session reads                                                                                                        |
| Credential storage client-side | Zustand persists user profile (name, role, email) to localStorage — never the token                                                                                                                          |
| CORS and cookie flow           | Dropped `credentials: "include"` — Next.js Server Actions read the cookie and forward token as Bearer header to Express. No cross-origin cookie complexity.                                                  |
| User registration              | Invite-only — no open signup. Invite tokens are single-use and expire after 48 hours.                                                                                                                        |
| Timezone handling              | All dates stored as `YYYY-MM-DD` strings in Singapore Time (SGT/+08:00). Backend queries use explicit `+08:00` offset boundaries. Frontend date comparisons use string comparison on `en-CA` locale strings. |
| Standup submitting             | Members can only submit one standup per day and cannot modify it to protect integrity                                                                                                                        |
| Team deletion                  | Blocked at the API level if any members are still assigned to the team.                                                                                                                                      |
| Rate limiting                  | `authLimiter` (10 req/15 min) on login and register. `generalLimiter` (100 req/15 min) applied globally. `generateLimiter` (5 req/hr) on digest generation.                                                  |

---

## Installation

**Prerequisites:** Node.js 18+, MongoDB Atlas account and cluster, Groq API key.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/chirp.git chirp
cd chirp
```

**Backend setup:**

```bash
cd backend
# using pnmp
pnpm install
#using npm
npm install
```

Backend `.env.dev`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri

JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key
```

**Frontend setup:**

```bash
cd frontend
# using pnmp
pnpm install
#using npm
npm install
```

Frontend `.env.development.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

JWT_SECRET=your_long_random_secret   # same value as backend
COOKIE_MAX_DAYS=7
```

---

## Usage

```bash
# Start the backend
cd backend
pnpm run dev
#using npm
npm run dev

# Start the frontend (separate terminal)
cd frontend
pnpm run dev
#using npm
npm run dev
```

Visit `http://localhost:3000`.

**First-time setup:**

1. Seed the database by running `pnpm run seed` or `npm run seed` in /backend, an admin account and sample data will be generated
2. Log in and navigate to `/admin/dashboard`. { email: admin@test.com, password: Admin1234 }
3. Create a team, then use **Create Invite** to generate links for your team members.
4. Share the invite link — members register at `/join?token=...`.

**Browsing historical standups:**

1. Go to /board and click on the date for the calendar control
2. Admin will need to pick a team from /admin/dashboard
3. Pick any date and you will be directed to the page

```
/board?teamId=<id>&date=2026-05-10
```

---

## Project Structure

```
chirp/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                  # Landing page
│   │   │   ├── login/                    # Login page
│   │   │   ├── join/                     # Invite registration flow
│   │   │   ├── board/                    # Team standup board
│   │   │   │   ├── page.tsx              # Server component — fetches data
│   │   │   │   └── BoardClientUI.tsx     # Client component — calendar, edit, digest
│   │   │   ├── standup/new/              # Submit standup form
│   │   │   ├── admin/dashboard/          # Admin console — teams, invites, members
│   │   │   └── onboarding/               # Waiting room for unassigned members
│   │   ├── actions/                      # Server Actions (auth, standups, teams, invites)
│   │   ├── components/
│   │   │   ├── AuthGuard.tsx             # Server-side JWT-verified route guard
│   │   │   ├── NavBar.tsx
│   │   │   ├── CreateTeamForm.tsx
│   │   │   ├── CreateInviteForm.tsx
│   │   │   ├── AssignUserForm.tsx
│   │   │   └── ui/                       # shadcn/base-ui components
│   │   ├── store/
│   │   │   └── authStore.ts              # Zustand — user profile only
│   │   ├── lib/
│   │   │   ├── apiClient.server.ts       # Server-side fetch wrapper (reads cookie)
│   │   │   ├── session.ts               # JWT verification via jose
│   │   │   └── utils.ts
│   │   └── types/
│   │       ├── auth.types.ts
│   │       ├── team.types.ts
│   │       └── user.types.ts
│   └── .env.development.local
│
└── backend/
    ├── scripts/seed.js                   # For seeding the database
    ├── src/
    │   ├── models/
    │   │   ├── user.model.js             # bcrypt pre-save hook, toSafeObject()
    │   │   ├── invite.model.js           # nanoid token, TTL index for auto-expiry
    │   │   ├── team.model.js
    │   │   ├── standup.model.js          # Unique index: userId + date
    │   │   └── digest.model.js           # Unique index: teamId + date
    │   ├── routes/                       # auth, teams, invites, standups
    │   ├── controllers/                  # auth, team, invite, standup
    │   ├── middlewares/
    │   │   ├── auth.js                   # protect(), requireRole()
    │   │   ├── validate.js               # Zod validation middleware
    │   │   └── rateLimiter.js            # general, auth, generate limiters
    │   ├── schemas/                      # Zod schemas per domain
    │   └── services/
    │       └── ai/
    │           ├── ai.service.js         # Prompting the ai
    │           ├── index.js              #Provider resolver
    │           └── adapters/
    │               └── groqAdapter.js
    └── .env.dev
```

---

## Reflection

**What worked well:**

- The BFF (Backend for Frontend) pattern — having Next.js Server Actions sit between the browser and Express worked cleanly.
- The browser never holds the JWT, the cookie is httpOnly, and Express only ever sees a Bearer token forwarded from a trusted server layer.
- The invite-only registration flow with single-use, expiring tokens struck the right balance between security and usability for a small team tool.
- Zod validation as Express middleware kept controllers clean
- By the time a request reaches a handler, the input is already typed and sanitised due to zod's schema validation.

**What was challenging:**

- The initial JWT verification approach used `jwt-decode`, which only base64-decodes the token without checking the signature. This was caught during a security review and replaced with `jose`'s `jwtVerify` in all server-side session reads. A reminder that client-side JWT libraries should never be used server-side for access control.
- The shadcn `Select` component's display behaviour with Base UI required a manual label resolution workaround — rendering the display text explicitly inside `SelectValue` rather than relying on automatic label matching from `SelectItem` children.
- Timezone handling across the stack required careful attention. The frontend, backend, and database each needed to agree on SGT as the reference timezone, with explicit `+08:00` offset boundaries in MongoDB queries.

**Changes made during development:**

- Removed `credentials: "include"` from the client-side fetch wrapper after switching to a Server Action-mediated cookie flow. This eliminated cross-origin cookie complexity entirely.
- Moved role checks from client-side Zustand state (easily spoofed) to server-side `jose`-verified JWT payloads in `AuthGuard` and `session.ts`.
- Split `authLimiter` from `generalLimiter` to apply a much tighter rate limit specifically to login and register endpoints.

**What was failing**

- Some of the endpoints have ownership problems, a user could create standup in teams that they don't belong
- Security headers are missing and should be added, realized it too late
- Pages are bloated with similar components, should have made more shared components
- Timezones are still really confusing
