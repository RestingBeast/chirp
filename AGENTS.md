# AGENTS.md — Chirp

AI-powered async standup board. Express 5 (ESM) backend, Next.js 16 App Router frontend.

## Repo structure

- `backend/` — Express REST API (Mongoose, JWT, Zod, Groq AI). Entry: `src/app.js`
- `frontend/` — Next.js 16 (App Router, Server Actions as BFF, TypeScript strict). Entry: `src/app/layout.tsx`
- No root monorepo tool. Each dir is independent — run `pnpm install` separately in each.

## Commands

### Backend
| Purpose | Command |
|---|---|
| Dev server | `pnpm run dev` (uses `.env.dev`) |
| Seed DB | `pnpm run seed` (admin@test.com / Admin1234, sample team + members) |
| Tests | **none** — `pnpm run test` is a placeholder that exits 1 |

### Frontend
| Purpose | Command |
|---|---|
| Dev server | `pnpm run dev` |
| Build (typecheck + bundle) | `pnpm run build` |
| Lint | `pnpm run lint` (Biome check) |
| Format | `pnpm run format` (Biome format --write) |
| Pre-PR verification | `pnpm run lint && pnpm run build` |

## Architecture rules

- **Frontend never calls backend directly** — Server Actions call REST API; browser only talks to Next.js.
- **JWT in httpOnly cookie only** — never exposed to client JS. Zustand stores only user profile (no token).
- **JWT_SECRET must match** between backend and frontend `.env` files. Backend signs with `jsonwebtoken`, frontend verifies with `jose`.
- **No open signup** — invite-only via invite links.
- **API response format**: `{ success: boolean, data?, message?, errors? }` — consistently.
- **All dates in SGT (+08:00)** — stored as `YYYY-MM-DD` strings, query boundaries use explicit `+08:00` offset.

## Conventions

- **Backend is ESM** (`"type": "module"`) — use `import`/`export`, no `require`.
- **Tailwind v4** — CSS-based config via `@theme inline` in `globals.css`. No `tailwind.config`. Uses `@tailwindcss/postcss`.
- **shadcn/ui** uses style `"base-nova"` (not default). Components in `src/components/ui/`.
- **Biome** uses VCS ignore, organizes imports on assist. `biome.json` in `frontend/`.
- **Zod validation** runs as Express middleware in routes, not in controllers.
- **Rate limiting**: 100/15min general, 15/15min auth, 5/hr digest generation.
- **Team deletion** blocked if members remain.
- **No DB migrations** — Mongoose schema indexes sync on model creation.
- **No CI/CD** — no GitHub Actions, Docker, or deployment config.

## Environment files

- Backend: `.env.dev` (loaded via `--env-file=.env.dev`)
- Frontend: `.env.development.local` (Next.js convention). Rename from `.env.example`.
- Required external services: MongoDB Atlas, Groq API key.
