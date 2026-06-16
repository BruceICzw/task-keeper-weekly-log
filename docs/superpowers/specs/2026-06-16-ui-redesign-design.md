# UI Redesign — Uni Log Book Creator

**Date:** 2026-06-16  
**Scope:** Full app — Landing, Auth, Dashboard, Weekly view, Log Book view  
**Approach:** CSS variable token update first, then page-by-page JSX restructuring  
**Icon rule:** Use `lucide-react` icons exclusively throughout — no emoji characters anywhere in the UI

---

## 1. Design Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Color palette | Indigo/Deep Blue | Professional, academic feel; richer than current blue |
| Landing structure | Full marketing page | Hero + features + stats + steps — matches TaskGo reference |
| App interior | Icon sidebar + stat cards | Rich product feel; dark sidebar with indigo accents |

---

## 2. Theme Tokens (`src/index.css`)

Replace the existing CSS variables with an indigo-first palette:

```css
:root {
  --primary: 239 84% 60%;           /* #4F46E5 */
  --primary-foreground: 0 0% 100%;

  --background: 240 20% 99%;        /* #f8f8ff — very soft blue-white */
  --foreground: 243 75% 20%;        /* #1E1B4B — deep indigo for text */

  --card: 0 0% 100%;
  --card-foreground: 243 75% 20%;

  --secondary: 238 100% 97%;        /* #EEF2FF — indigo tint */
  --secondary-foreground: 243 75% 20%;

  --muted: 238 60% 96%;
  --muted-foreground: 220 14% 46%;

  --accent: 238 100% 97%;           /* #EEF2FF */
  --accent-foreground: 239 84% 60%; /* #4F46E5 */

  --border: 238 30% 92%;
  --input: 238 30% 92%;
  --ring: 239 84% 60%;

  --radius: 0.75rem;
}

.dark {
  --primary: 239 84% 65%;
  --background: 243 75% 8%;         /* #0d0c1d */
  --foreground: 238 100% 97%;

  --card: 243 50% 12%;
  --secondary: 243 40% 16%;
  --muted: 243 40% 16%;
  --muted-foreground: 238 20% 65%;

  --border: 243 30% 20%;
  --input: 243 30% 20%;
}
```

Also add a `sidebar` CSS custom property group:

```css
--sidebar-bg: 243 75% 20%;       /* #1E1B4B — very dark indigo */
--sidebar-active: 239 84% 60%;   /* #4F46E5 */
--sidebar-icon: rgba(255,255,255,0.45);
--sidebar-icon-active: #ffffff;
```

---

## 3. Landing Page (`src/pages/Landing.tsx`)

Full rewrite. Sections in order:

### 3a. Navbar
- Logo: `<BookOpen />` lucide icon in an indigo rounded square + "UniLog" wordmark
- Nav links: Home, Features, How It Works (desktop only)
- Right CTA: "Get Started Free" pill button (indigo filled)
- Sticky, white background, 1px bottom border

### 3b. Hero Section
- Full-width indigo gradient background (`#4F46E5 → #3730A3 → #1E1B4B`)
- Two decorative blurred circles (pseudo-elements) for depth
- Badge: `✦ Built for University Students`
- H1: "Simplify Your University Logbook" — 52px, 900 weight
- Subtext: single sentence description, max-w-540
- Two CTA buttons: "Get Started Free" (white filled) + "Sign In" (outline)
- App preview card below buttons: browser chrome mockup showing the sidebar + task dashboard

### 3c. Brands Strip
- "Trusted by students at leading universities"
- Pills for university abbreviations (UZ, NUST, MSU, CUT)

### 3d. Features Section
- Label: "FEATURES"
- Title: "Everything You Need to Ace Your Logbook"
- 2-column grid of 3 feature cards (third card spans full width)
- Cards: Daily Task Logging, Auto Weekly Compilation, One-Click PDF Export
- Each card: lucide icon (`<ClipboardList />`, `<CalendarCheck />`, `<FileText />`) in an `#EEF2FF` rounded box, h3, description, feature badge pill

### 3e. Stats Section
- Indigo gradient background
- 4-column grid: 500+ students, 3x faster, 100% PDF-ready, 5★ rated
- Each stat: large number + descriptor

### 3f. How It Works
- 2-column layout: numbered steps (left) + app UI preview (right)
- Steps: 1. Create account, 2. Log tasks daily, 3. Export logbook
- Right panel: mini mockup of the task input + task list

### 3g. CTA Footer
- White background, centered
- "Ready to Simplify Your Logbook?"
- Single indigo CTA button with shadow

---

## 4. Auth Page (`src/pages/Auth.tsx`)

Full rewrite. Split two-panel layout:

### Left Panel (45% width)
- Indigo gradient background (same as hero)
- Logo at top
- H2: "Your Logbook, Smarter."
- Short description paragraph
- Feature checklist (4 items with checkmark circles)

### Right Panel (55% width)
- Light `#f5f5ff` background
- Centered white card (max-w-420, rounded-20, shadow)
- Card contains:
  - H3: "Welcome back" + subtitle
  - Tab switcher: Sign In / Register (pill style, not underline)
  - **Sign In form**: Email or Username input + Password input + "Sign In →" button
  - **Register form**: Username + Email + Password + Confirm Password + "Create Account →" button
  - Divider "or" + toggle link below
- Fine print: terms/privacy note

---

## 5. App Shell — Shared Layout

All authenticated pages (Dashboard, Weekly, Logbook) share this shell via a new `AppLayout` wrapper component.

### New: `src/components/AppLayout.tsx`
Create a new layout component that wraps every authenticated page:
```tsx
<div className="flex min-h-screen">
  <Sidebar />
  <div className="flex-1 flex flex-col ml-16"> {/* ml-16 = sidebar width */}
    <TopBar title={...} subtitle={...} actions={...} />
    <main className="flex-1 bg-[#f8f8ff] p-6">{children}</main>
  </div>
</div>
```
Each authenticated page (`Index.tsx`, `WeeklyLogView.tsx`, `LogBookView.tsx`) removes its own `<Header />` and `<main>` wrapper and instead renders inside `<AppLayout>`.

### Sidebar (`src/components/Header.tsx` → renamed to `Sidebar.tsx`)
- Fixed left, 64px wide, `#1E1B4B` background, `position: fixed`, `top-0 left-0 h-screen z-50`
- Top: square indigo logo — `BookOpen` lucide icon inside an indigo rounded square
- Nav icons (vertically stacked, 40×40 rounded-10) — all from `lucide-react`:
  - `<Home />` → `/`
  - `<Calendar />` → `/weekly`
  - `<BookOpen />` → `/logbook`
- Bottom section: `<Moon />` / `<Sun />` theme toggle + avatar circle (user initial) + `<LogOut />` sign-out
- Active item: `#4F46E5` background, white icon; inactive: `rgba(255,255,255,0.45)`
- Tooltip on hover (absolute positioned label) showing page name
- Keep existing `useAuth` / `signOut` / `useLocation` logic; remove Sheet/mobile-drawer (sidebar is always visible at 64px)

### TopBar (accept props per page)
- White background, 1px bottom border, `h-14`
- Left: page `title` (bold, 16px) + `subtitle` (muted, 13px) below
- Right: slot for per-page action buttons passed as `actions` prop

---

## 6. Dashboard (`src/pages/Index.tsx`)

### Stat Cards Row (3 cards)
- **Tasks Today**: count from `getTasksForDay(currentDate)` — already called in `DailyTaskList`, hoist the count to `Index.tsx`. Icon: `<ClipboardList />`
- **Current Week**: week number + date range from `getCurrentWeek()` → `weekData.weekNumber` + `formatWeekRange(...)`. Icon: `<Calendar />`
- **Logs Compiled**: count of all weekly logs from Supabase `weekly_logs` table — add a `getWeeklyLogsCount()` helper to `storageUtils.ts`. Icon: `<FileText />`
- Each card: label + large number + sub-label + lucide icon in `#EEF2FF` rounded box

### Task Input
- Full-width white card with 2px border (indigo on focus)
- Placeholder: "What did you work on today?"
- "＋ Add Task" button (indigo, right side)

### Task List
- Section header: "Today's Tasks" + task count badge
- Each task card (white, rounded-12, subtle shadow):
  - Small indigo dot + task text + timestamp
  - Skill badges in indigo-tint pills
  - Action buttons visible on hover: `<Sparkles />` (add skills) + `<Trash2 />` (delete) — from `lucide-react`

---

## 7. Weekly View (`src/pages/WeeklyLogView.tsx` + `src/components/WeeklyLog.tsx`)

The `WeeklyLog` component has significant existing logic (week navigation, day-click to add tasks, compile button, settings dialog, compiled log preview). This is a **restyle only** — no logic changes.

- `WeeklyLogView.tsx`: replace `<Header />` + `<main>` with `<AppLayout title="Weekly Summary" subtitle="View and compile your weekly task summaries" actions={<CompileButton />} />`. Compile button uses `<RefreshCw />` lucide icon; Export button uses `<FileDown />`
- `WeeklyLog.tsx` restyling:
  - **Week navigation bar** (prev/next/calendar/compile): restyle buttons to indigo theme; keep all existing click handlers
  - **Skills card**: restyle with `#EEF2FF` background, indigo badge pills
  - **Compiled log card**: restyle with indigo accent background; keep "View Compiled Log" dialog unchanged
  - **Day cards grid** (Mon–Fri, clickable to add tasks): restyle each `Card` with white background, indigo left border on the active/filled day, task count badge, indigo skill badges; keep all `onClick → showDayDialog` logic
  - **Settings dialog**: restyle buttons only; keep all form logic unchanged
  - **Day task dialog**: restyle dialog header; `DailyTaskList` inside is already restyled

---

## 8. Log Book View (`src/pages/LogBookView.tsx`)

- Top bar: "Log Book" + Export Full PDF button with `<FileDown />` lucide icon
- Tab strip: Cover Page | All Entries
- **Cover Page tab**: 2-column grid of cover page fields (student name, ID, company, period) + summary banner (weeks compiled, tasks logged, export status)
- **All Entries tab**: scrollable list of all weekly entries (existing `LogBook` component restyled)

---

## 9. Files to Change

| File | Change |
|---|---|
| `src/index.css` | Replace all CSS variables with indigo palette; add sidebar vars; keep existing utility classes |
| `src/pages/Landing.tsx` | Full rewrite — all 7 sections as described |
| `src/pages/Auth.tsx` | Full rewrite — two-panel split layout |
| `src/components/Header.tsx` | Rename to `Sidebar.tsx`; restructure into fixed vertical icon nav |
| `src/components/AppLayout.tsx` | **New file** — shared layout wrapper (sidebar + topbar + main slot) |
| `src/pages/Index.tsx` | Replace `<Header/>` with `<AppLayout>`; add stat cards row; fetch stats data |
| `src/pages/WeeklyLogView.tsx` | Replace `<Header/>` with `<AppLayout>` |
| `src/pages/LogBookView.tsx` | Replace `<Header/>` with `<AppLayout>`; add Cover Page / All Entries tabs |
| `src/components/DailyTaskList.tsx` | Restyle task cards — indigo dot, hover actions, skill badges |
| `src/components/TaskInput.tsx` | Restyle input + button to match new design |
| `src/components/WeeklyLog.tsx` | Restyle only — indigo theme on cards, badges, buttons; no logic changes |
| `src/utils/storageUtils.ts` | Add `getWeeklyLogsCount()` helper for dashboard stat card |
| `tailwind.config.ts` | No structural changes needed (tokens via CSS vars) |

---

## 10. Out of Scope

- No new routes or pages
- No changes to Supabase schema or data logic
- No changes to PDF generation logic (`src/utils/pdfGenerator.ts`)
- No new dependencies beyond what already exists (shadcn/ui, Tailwind, lucide-react)
