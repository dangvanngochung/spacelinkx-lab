# MASTER SPEC - lab.spacelinkx.com

## PROJECT NAME
- lab.spacelinkx.com

## PURPOSE
- Private personal AI workspace using OpenAI API.
- ChatGPT-style interface but premium custom branded.

## STACK
- **Next.js v16.2.4** (App Router)
- TypeScript
- Tailwind CSS
- Vercel deploy
- OpenAI API
- localStorage (current storage)
- No DB yet

## ENV
- `OPENAI_API_KEY=...`
- `APP_PASSWORD=...`

## CURRENT STATUS
- PHASE 1 completed
- Premium UI Pack A completed

## WORKING FEATURES
- ✔ Password gate before access
- ✔ OpenAI streaming chat response
- ✔ Multi thread chat history
- ✔ Save threads localStorage
- ✔ Sidebar thread list
- ✔ Create new chat
- ✔ Delete chat
- ✔ Search chats in sidebar
- ✔ Model selector
- ✔ Default model = gpt-4.1-mini
- ✔ Responsive desktop usable
- ✔ Premium UI better than base version
- ✔ Branded as SPACE LINK X / Lab

## CURRENT UI DIRECTION
- Inspired by ChatGPT
- Cleaner / premium / enterprise feel
- Sidebar dark graphite
- Main content white clean
- Rounded premium controls
- Minimal colors only

## CURRENT FILE TREE
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
  Sidebar.tsx
  Topbar.tsx
  PasswordGate.tsx
lib/
  storage.ts
types/
  chat.ts
```

## CURRENT IMPORTANT LOGIC

### AUTH
- Password checked via `/api/auth`
- If success -> localStorage `slx_unlock=1`

### CHAT
- `/api/chat` streams OpenAI responses
- Uses selected model
- Threads stored localStorage

### THREAD OBJECT
```json
{
 "id": "string",
 "title": "string",
 "messages": [
   { "role":"user", "content":"..." },
   { "role":"assistant", "content":"..." }
 ]
}
```

## BRANDING
- SPACE LINK X
- Lab

## DEFAULT MODEL
- gpt-4.1-mini

## NEXT BEST PRIORITY = PHASE 2 ULTRA

### PHASE 2A (Core UX + Rendering)
1. Markdown render
2. Code blocks + copy button
3. Better message spacing polish
4. Typing cursor animation
5. Auto scroll smooth
6. Mobile sidebar drawer

### PHASE 2B (Thread Management)
7. Rename chat
8. Folder chats
9. Stronger search

### PHASE 2C (Files + AI Multimodal)
10. Drag-drop upload UI
11. Upload PDF
12. Vision image upload ask image

### PHASE 2D (Metrics)
13. Token usage meter

## AFTER PHASE 2 => PHASE 3
1. Voice input
2. Voice output
3. Memory per thread
4. Supabase sync cloud
5. Multi-device login
6. Usage analytics
7. Production hardening

## IMPORTANT RULES
- Always give full version copy-paste first
- Then step-by-step deploy/update
- No partial snippets unless requested
- Keep premium UI direction
- Avoid ugly colors / amateur UI
- Keep ChatGPT-inspired UX

## REQUEST TO CONTINUE
- Continue building lab.spacelinkx.com from this MASTER SPEC.
- Start PHASE 2 ULTRA production-grade now.
