# Chirp

> AI-powered async standups for engineering teams.

## Overview

### Problem

Daily standup meetings are a coordination tax. For distributed or async-first teams, a 15-minute synchronous call to share three sentences is inefficient — it interrupts deep work, excludes team members in different timezones, and produces no persistent, searchable record of what was discussed.

### Outcome

Chirp is an invite-only standup board where team members post daily updates asynchronously. An admin can trigger an AI digest that synthesises all updates into a concise team health summary — replacing the standup meeting entirely.

- Team members post standups in under two minutes from any device.
- Admins can generate a 3-sentence AI-generated digest covering yesterday's progress, today's focus, and active blockers.
- Historical standups are browsable by date via a calendar picker.
- Role-based access control separates admin capabilities (team management, digest generation, user management) from member capabilities (posting and editing standups).
- Admin console includes team CRUD, invite management, user assignment, and user management (edit, reassign, soft-delete).

---

## Demo

**Admin flow:**

1. Admin signs in and creates a team.
   <img width="1920" height="1465" alt="landing" src="https://github.com/user-attachments/assets/e094a61c-80f8-4ce7-a342-9db0eddbc4b1" />
   <img width="1920" height="985" alt="login" src="https://github.com/user-attachments/assets/3cae49c2-e93f-4bc5-b4c2-47afb788572c" />
   <img width="1920" height="913" alt="create-team" src="https://github.com/user-attachments/assets/0550da6f-7810-4078-8398-c4fa4202dbb2" />
2. Admin generates an invite link for a specific email address and team.
3. Invitee receives the link, registers via `/join?token=...`, and is automatically assigned to the team.
   <img width="1920" height="913" alt="create-invite" src="https://github.com/user-attachments/assets/369fb351-97bf-49d7-a03a-16c4ffff08d2" />
   <img width="1920" height="913" alt="success-invite" src="https://github.com/user-attachments/assets/d07252dc-02fd-4ec9-871e-5beec14a540b" />
4. Admin can assign a member to a team.
   <img width="1920" height="913" alt="assign-user" src="https://github.com/user-attachments/assets/80305c18-12e0-4b66-bbbb-ef4d418c158d" />
5. Admin sees all managed teams at the dashboard.
   <img width="1920" height="913" alt="admin-dashboard" src="https://github.com/user-attachments/assets/d2d5c98b-bf15-45c7-a246-f1311672b204" />
6. Admin views the board at `/board?teamId=...`, sees all submitted standups, and clicks **Generate AI Digest**.
   <img width="1920" height="1235" alt="admin-view-board" src="https://github.com/user-attachments/assets/af014f38-fb33-4586-b178-5f1b5c9980ac" />
7. Admin browses past dates via the calendar picker. (Members can browse too.)
   <img width="1920" height="1167" alt="view-calendar" src="https://github.com/user-attachments/assets/ca117d59-7168-4011-9929-bc6491e2c0b5" />
8. Admin generates a digest for the day; members can only view it after generation.
   <img width="1920" height="1235" alt="create-digest" src="https://github.com/user-attachments/assets/d675fdd0-1c2e-4226-9f01-de63ad290e9f" />
9. Admin can rename or delete empty teams from the dashboard.
   <img width="1920" height="913" alt="delete-team1" src="https://github.com/user-attachments/assets/4c0f7672-16d4-4d51-8f94-4593560d6f0c" />
   <img width="1920" height="913" alt="delete-team2" src="https://github.com/user-attachments/assets/d85f3fe7-04ec-4e7b-9e95-48fdd60f072b" />
10. Admin manages all users at `/admin/users` — paginated table, edit name/team/password, soft-delete.
11. Any user can change their password at `/account/change-password`.

**Member flow:**

1. Member registers via invite link — no open signup.
   <img width="1920" height="985" alt="register" src="https://github.com/user-attachments/assets/911e7d8e-a8a3-46b8-b4cc-7a9b4bc3fe6f" />
2. Member sees onboarding page if no team is assigned.
   <img width="1920" height="985" alt="onboarding" src="https://github.com/user-attachments/assets/a206208c-dbdd-4f0d-b80b-937ad5953b14" />
3. Member sees the team board after admin assigns a team.
   <img width="1920" height="942" alt="user-view-board" src="https://github.com/user-attachments/assets/f4ecdbf1-b00e-4c5f-b393-815c7cc4c636" />
4. Member posts daily standup at `/standup/new` with three fields: Yesterday, Today, Blockers.
   <img width="1920" height="985" alt="create-standup" src="https://github.com/user-attachments/assets/b840383a-d9cf-455e-8307-a2db45f2a899" />
   <img width="1920" height="985" alt="user-standup-warn" src="https://github.com/user-attachments/assets/27f6c823-e3f0-4c0f-8b16-379a84a9b521" />
5. Member views the team board showing all colleagues' updates with a green/pending indicator per member.
   <img width="1920" height="1107" alt="finish-board" src="https://github.com/user-attachments/assets/6e514c02-e630-4e18-a078-bffc8bef6285" />

---

## Technology Stack

### Frontend components

| Technology | Purpose |
|---|---|
| Next.js 16 (App Router) | Framework, server components, routing |
| TypeScript | Type safety across all frontend code |
| Tailwind CSS v4 | Utility-first styling with CSS-based config |
| shadcn/ui (Base UI) | Component library — forms, dialogs, cards, calendar, select |
| Zustand | Client-side auth state (user profile only, not token) |
| Next.js Server Actions | All API calls from the frontend — token stays server-side |
| jose | JWT verification in Server Components and middleware |
| react-day-picker | Calendar date selection |
| date-fns | Date formatting and manipulation |
| lucide-react | Icon library |
| sonner | Toast notifications |
| next-themes | Theme switching support |
| class-variance-authority | Component variant management |
| cmdk | Command menu for searchable comboboxes |

### Backend components

| Technology | Purpose |
|---|---|
| Express.js 5 | REST API server |
| Mongoose 9 | MongoDB ODM |
| MongoDB Atlas | Cloud database |
| jsonwebtoken | JWT signing and verification |
| jose | Server-side JWT verification (frontend) |
| bcrypt | Password hashing (12 salt rounds) |
| Zod | Request body validation |
| express-rate-limit | Rate limiting (general + auth-specific) |
| nanoid | Invite token generation |
| cors | Cross-origin resource sharing configuration |
| helmet | Security headers |
| Provider-agnostic AI adapter | Abstraction over Groq/Claude/Gemini |
| Groq (Llama 3.3 70B) | AI team digest generation |

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
pnpm install
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
pnpm install
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

# Start the frontend (separate terminal)
cd frontend
pnpm run dev
```

Visit `http://localhost:3000`.

**First-time setup:**

1. Seed the database by running `pnpm run seed` in `/backend` — creates an admin account and sample data.
2. Log in at `/login` with `{ email: admin@test.com, password: Admin1234 }`.
3. Navigate to `/admin/dashboard`, create a team, then use **Create Invite** to generate invite links.
4. Share the invite link — members register at `/join?token=...`.
5. Assign users to teams from the admin dashboard.
6. Visit `/board` to view standups; admins can generate AI digests.

**Browsing historical standups:**

1. Go to `/board` and click the date control in the header.
2. Admins pick a team from `/admin/dashboard` first.
3. Navigate to any date via the calendar.

```
/board?teamId=<id>&date=2026-05-10
```

**Admin user management:**

1. Go to `/admin/users` to view all users in a paginated table.
2. Click the pencil icon to edit a user's name, team assignment, or password.
3. Click the trash icon to soft-delete a user.

**Change password:**

1. Any authenticated user can visit `/account/change-password` to update their password.

---

## Project Structure

```
chirp/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx                     # Landing page
│   │   │   ├── layout.tsx                   # Root layout — NavBar, Toaster, session
│   │   │   ├── login/                       # Login page
│   │   │   ├── join/                        # Invite registration flow
│   │   │   ├── board/                       # Team standup board
│   │   │   │   ├── page.tsx                 # Server component — fetches data
│   │   │   │   └── BoardClientUI.tsx        # Client component — calendar, edit, digest
│   │   │   ├── standup/new/                 # Submit standup form
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/               # Admin console — teams, invites, members
│   │   │   │   └── users/                   # Admin user management — CRUD table
│   │   │   ├── account/
│   │   │   │   └── change-password/         # Change current password
│   │   │   └── onboarding/                  # Waiting room for unassigned members
│   │   ├── actions/                         # Server Actions
│   │   │   ├── auth.ts                      #   login, register, logout, changePassword
│   │   │   ├── standups.ts                  #   fetch board, submit/edit standups
│   │   │   ├── teams.ts                     #   fetch members, assign user
│   │   │   ├── invites.ts                   #   create invite
│   │   │   ├── users.ts                     #   fetch users
│   │   │   └── admin.ts                     #   admin data, create/rename/delete team, digests
│   │   ├── components/
│   │   │   ├── AuthGuard.tsx                # Server-side JWT-verified route guard
│   │   │   ├── NavBar.tsx                   # Navigation — Dashboard, Settings, Sign Out
│   │   │   ├── CreateTeamForm.tsx
│   │   │   ├── CreateInviteForm.tsx
│   │   │   ├── AssignUserForm.tsx
│   │   │   └── ui/                          # shadcn/base-ui components
│   │   ├── store/
│   │   │   └── authStore.ts                 # Zustand — user profile only
│   │   ├── lib/
│   │   │   ├── apiClient.server.ts          # Server-side fetch wrapper (reads cookie)
│   │   │   ├── session.ts                   # JWT verification via jose
│   │   │   └── utils.ts                     # cn() utility
│   │   └── types/
│   │       ├── auth.types.ts
│   │       ├── team.types.ts
│   │       └── user.types.ts
│   └── .env.development.local
│
└── backend/
    ├── scripts/seed.js                      # Database seeder
    ├── src/
    │   ├── app.js                           # Express entry — CORS, helmet, routes, 404
    │   ├── config/
    │   │   └── db.js                        # Mongoose connection
    │   ├── models/
    │   │   ├── user.model.js                # bcrypt pre-save hook, toSafeObject()
    │   │   ├── invite.model.js              # nanoid token, TTL index for auto-expiry
    │   │   ├── team.model.js
    │   │   ├── standup.model.js             # Unique index: userId + date
    │   │   └── digest.model.js              # Unique index: teamId + date
    │   ├── routes/                          # auth, teams, invites, standups, users
    │   ├── controllers/                     # auth, team, invite, standup, user
    │   ├── middlewares/
    │   │   ├── auth.js                      # protect(), requireRole()
    │   │   ├── validate.js                  # Zod validation middleware
    │   │   └── rateLimiter.js               # general, auth, generate limiters
    │   ├── schemas/                         # Zod schemas per domain
    │   └── services/
    │       ├── ai.service.js                # Formats standups into prompt, calls AI
    │       └── ai/
    │           ├── index.js                 # Provider resolver (AI_PROVIDER env)
    │           └── adapters/
    │               └── groqAdapter.js       # Llama 3.3 via Groq SDK
    └── .env.dev
```
