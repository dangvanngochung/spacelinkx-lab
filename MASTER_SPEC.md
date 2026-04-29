# MASTER SPEC — lab.spacelinkx.com

## 1) Project Overview
- **Project**: `lab.spacelinkx.com`
- **Goal**: private personal AI workspace using OpenAI API, ChatGPT-style but premium SPACE LINK X branding.
- **Primary users**: owner/admin internal use (private password-gated app).

## 2) Product Positioning
- Chat-first AI cockpit, clean enterprise/premium visual language.
- Fast, reliable, multi-thread daily AI workspace.
- Phase-by-phase rollout with production hardening.

## 3) Tech Stack (Current)
- Next.js `16.2.4` (App Router)
- React `19.2.4`
- TypeScript
- Tailwind CSS v4
- OpenAI SDK (`openai`)
- Local persistence: `localStorage` (no DB yet)
- Deployment target: Vercel

## 4) Environment Variables
- `OPENAI_API_KEY=...`
- `APP_PASSWORD=...`

## 5) Current Feature State (After latest update)
### Authentication
- Password gate before entering app.
- Unlock token stored in localStorage key `slx_unlock=1`.

### Chat Core
- Streaming chat response via `/api/chat`.
- Model selector with default `gpt-4.1-mini`.
- Multi-thread chat saved to localStorage.
- Create thread, delete thread.

### UX / UI (Phase 2A + part 2B)
- Markdown-like message rendering (headings/list/inline code/bold).
- Fenced code blocks with language label + copy button.
- Streaming typing cursor indicator.
- Smooth auto-scroll on updates.
- Mobile sidebar drawer UX.
- Thread rename inline.
- Folder-based thread grouping/filtering in sidebar.
- Stronger search: match title + message content.

## 6) Current Data Model
```ts
Msg = {
  role: "user" | "assistant" | "system";
  content: string;
}

Thread = {
  id: string;
  title: string;
  createdAt: number;
  folder?: string;
  messages: Msg[];
}
```

## 7) Current File State (source of truth)
```text
app/
  api/
    auth/route.ts
    chat/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  ChatApp.tsx
  PasswordGate.tsx
  Sidebar.tsx
  Topbar.tsx
lib/
  storage.ts
types/
  chat.ts
MASTER_SPEC.md
README.md
```

## 8) Design Direction (Locked)
- ChatGPT-inspired information architecture.
- Sidebar: dark graphite.
- Content area: clean white.
- Premium rounded controls.
- Minimal color system, no amateur palette.

## 9) Phase 2 Completion Plan (Pro)

## Phase 2A (Core UX + Rendering) — status: **80%**
- [x] Markdown render baseline
- [x] Code blocks + copy
- [x] Spacing polish
- [x] Typing cursor animation
- [x] Smooth auto-scroll
- [x] Mobile sidebar drawer
- [ ] Upgrade markdown engine to production-safe parser (remark/rehype stack)
- [ ] Syntax highlighting theme consistency

## Phase 2B (Thread Management) — status: **70%**
- [x] Rename chat
- [x] Folder chats (labels/groups)
- [x] Stronger search (title + message)
- [ ] Pin/recent sorting + keyboard shortcuts

## Phase 2C (Files + Multimodal) — status: **0%**
- [ ] Drag-drop upload zone
- [ ] PDF upload and extraction flow
- [ ] Image upload + vision prompt flow
- [ ] File preview + per-thread attachment list

## Phase 2D (Metrics) — status: **0%**
- [ ] Token usage meter (per response/thread/day)
- [ ] Cost estimation panel

## 10) ChatGPT-platform Pro Roadmap (post-Phase 2)

### Foundation hardening
1. Add persistent DB (Supabase/Postgres) with row-level ownership.
2. Move auth from password-only to account login (magic link/OAuth).
3. Add server-side thread storage and sync across devices.

### Reliability & security
4. Add rate limiting, structured logging, error boundaries.
5. Add secret rotation policy + env validation.
6. Add audit events for sign-in/chat actions.

### Product depth
7. Memory modes (thread memory / project memory).
8. Tool calling workflow (web/file/calculation connectors).
9. Voice input/output pipeline.
10. Usage analytics dashboard.

### Engineering excellence
11. Add test layers: unit + integration + e2e.
12. CI pipeline: lint/typecheck/test/build.
13. Performance budgets + monitoring.

## 11) Next Implementation Targets (for next deployment)
1. Upgrade markdown renderer to **production parser** with robust safety.
2. Add file upload UI shell (Phase 2C starter).
3. Add token usage tracking in response metadata (Phase 2D starter).
4. Add pin/recent sorting + keyboard shortcuts (Phase 2B finish).

## 12) Build/Deployment Notes
- Keep premium SPACE LINK X branding strict.
- Always update this `MASTER_SPEC.md` after each significant rollout.
- No partial direction drift away from ChatGPT-like UX.
