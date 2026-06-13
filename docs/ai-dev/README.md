## AI Tools

- opencode (big-pickle model) — code generation, debugging, codebase analysis, and testing strategy consultation.

- opencode subagents: `explore` for codebase exploration, `general` for multi-step tasks. Skill: `customize-opencode` for opencode config.

---

## Development Approach with AI

### Workflow

Tasks were broken into severity-based batches (Critical → High → Medium → Low). Each batch was verified with `pnpm run build` before proceeding. Parallel reads and edits were used where possible. Decisions were documented in AGENTS.md as they were made.

### Key prompts used

1. **Codebase scan**: "Scan the codebase for potential issues, bugs, and improvements" — uncovered ~25 issues across Critical, High, Medium, Low.
2. **Issue triage**: "Fix the Critical and High issues" / "Fix the Medium and Low issues" — applied in severity order with build verification after each.
3. **Testing strategy**: "Tell me if I should write integration tests and which parts should I test" — compared Vitest vs Jest vs Mocha vs Node test runner, recommended Vitest + supertest + mongodb-memory-server.
4. **Component question**: "Is AuthGuard a server component? Should I add 'use server'?" — clarified Server Components are the default in Next.js App Router and need no directive.
5. **Scoping fix**: "Fix updateUser and deleteUser to be able to edit and delete by the invited admin" — migrated authorization from team-ownership (`teamId.adminId`) to invited-by (`invitedBy`).

Reusable templates:
- "Scan the codebase for potential issues, bugs, and improvements. Categorize findings by severity."
- "Fix [Critical/High/Medium/Low] issues found in the scan."
- "Fix [controller name] to scope operations by [criterion] instead of [old criterion]."
- "Can you take a look at the structure of [file] and fill accordingly again?"

### Key decisions

| Decision | Rationale |
|---|---|
| Soft-delete (deletedAt) instead of cascade delete | Preserves standup references to deleted users |
| No pre-find middleware on User model | Explicit deletedAt: null in queries is safer |
| Revive on re-register | Soft-deleted user re-registering clears deletedAt |
| Team names not globally unique | Removed 11000 error handlers — no unique index existed |
| getAllUsers returns only invited users | Admin scoping — each admin sees only their invitees |
| updateUser/deleteUser scoped by invitedBy | Consistent with getAllUsers, works for unassigned users |
| Backend integration tests with Vitest | Native ESM, fast, Jest-compatible API |
| Skip frontend Server Action tests | Thin wrappers — low ROI; logic is in backend |
| ApiError class in apiClient.server.ts | throw data broke error instanceof checks everywhere |
| AbortController timeout in API client | Prevents hanging requests (30s) |
| Startup env validation in app.js | Fail-fast on missing MONGO_URI / JWT_SECRET |
| Removed unused isLoading/error from Zustand | Dead state — consumers used local useState |
| Removed redundant createdAt filter | Query already filtered by date string |

---

## Reflection

### What worked well

- Batch-by-severity fixes with build verification after each batch kept progress measurable and safe.
- Parallel reads and edits reduced latency significantly.
- Codebase scan upfront gave clear direction and a concrete list of tasks.
- AGENTS.md progress log maintained context across the session and made it easy to resume work.
- Fixing the API client to throw an Error subclass (ApiError) fixed instanceof checks across all Server Actions.

### What was challenging

- Edit tool case-sensitive matching caused one failed rename (TeamBoardPage → AdminDashboardPage) — oldString didn't match due to a missing `{` in the function signature. Required re-reading the file and retrying.
- 11000 error handlers were dead code — no unique index on team name existed. The code appeared functional but was unreachable.

### Changes made during development

- Added ApiError class and AbortController timeout (30s) to apiClient.server.ts (originally a Medium issue from the scan).
- Added startup environment variable validation in app.js for MONGO_URI and JWT_SECRET (Medium issue).
- Removed unused isLoading and error fields from Zustand auth store (Low issue).
- Changed updateUser and deleteUser authorization from team-ownership to invited-by scoping (correctness fix discovered mid-session).
- Enabled delete button for all invited users on the frontend (previously disabled for users assigned to a team).

### What was failing

- apiClient.server.ts threw raw response objects instead of Error instances, breaking `error instanceof Error` checks in every Server Action.
- No request timeout existed — API calls could hang indefinitely.
- Backend started without validating required environment variables, causing cryptic runtime failures.
- Zustand auth store held unused isLoading/error state that was never consumed.
- updateUser and deleteUser checked team ownership instead of invitedBy, blocking admins from managing unassigned users they invited.
- Frontend delete button was disabled for team-assigned users as a workaround for the backend's team-ownership check.
