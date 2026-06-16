# UI Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the full app UI with an indigo/deep-blue palette, a dark icon sidebar, a full marketing landing page, and a split-panel auth page — all using lucide-react icons, no emojis.

**Architecture:** Update CSS tokens first so every `text-primary`/`bg-primary` class picks up the new palette instantly. Then create a shared `AppLayout` wrapper (sidebar + topbar) that replaces the per-page `<Header />` imports. Rewrite public pages (Landing, Auth) independently, then update authenticated pages one by one to use `AppLayout`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, shadcn/ui, lucide-react, Supabase, Vite

**Spec:** `docs/superpowers/specs/2026-06-16-ui-redesign-design.md`

---

## File Map

| File | Action |
|---|---|
| `.gitignore` | Add `.superpowers/` entry |
| `src/index.css` | Replace CSS variables with indigo palette |
| `src/components/Sidebar.tsx` | **Create** — fixed icon sidebar (replaces Header) |
| `src/components/AppLayout.tsx` | **Create** — shared layout wrapper (sidebar + topbar + main) |
| `src/pages/Landing.tsx` | **Rewrite** — full marketing page (7 sections) |
| `src/pages/Auth.tsx` | **Rewrite** — two-panel split layout |
| `src/utils/storageUtils.ts` | Add `getWeeklyLogsCount()` |
| `src/pages/Index.tsx` | Use `AppLayout`; add 3 stat cards |
| `src/components/TaskInput.tsx` | Restyle — white card, indigo focus border |
| `src/components/DailyTaskList.tsx` | Restyle — indigo dot, hover actions, skill badges |
| `src/pages/WeeklyLogView.tsx` | Swap `<Header/>` for `<AppLayout>` |
| `src/components/WeeklyLog.tsx` | Restyle only — indigo theme, keep all logic |
| `src/pages/LogBookView.tsx` | Add Cover Page / All Entries tabs; use `<AppLayout>` |
| `src/components/Header.tsx` | **Delete** after all pages migrated |

---

## Task 1: Gitignore — exclude brainstorm artifacts

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append:
```
# Superpowers brainstorm artifacts
.superpowers/
```

- [ ] **Step 2: Commit**

```bash
git add .gitignore
git commit -m "chore: ignore .superpowers brainstorm directory"
```

---

## Task 2: CSS Theme Tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Step 1: Replace `:root` CSS variables**

In `src/index.css`, replace the entire `:root { … }` block (lines 7–53) with:

```css
:root {
  --background: 240 20% 99%;
  --foreground: 243 75% 20%;

  --card: 0 0% 100%;
  --card-foreground: 243 75% 20%;

  --popover: 0 0% 100%;
  --popover-foreground: 243 75% 20%;

  --primary: 239 84% 60%;
  --primary-foreground: 0 0% 100%;

  --secondary: 238 100% 97%;
  --secondary-foreground: 243 75% 20%;

  --muted: 238 60% 96%;
  --muted-foreground: 220 14% 46%;

  --accent: 238 100% 97%;
  --accent-foreground: 239 84% 60%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;

  --border: 238 30% 92%;
  --input: 238 30% 92%;
  --ring: 239 84% 60%;

  --radius: 0.75rem;

  --sidebar-background: 243 75% 20%;
  --sidebar-foreground: 0 0% 100%;
  --sidebar-primary: 239 84% 60%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 243 60% 26%;
  --sidebar-accent-foreground: 0 0% 100%;
  --sidebar-border: 243 50% 28%;
  --sidebar-ring: 239 84% 60%;
}
```

- [ ] **Step 2: Replace `.dark` CSS variables**

Replace the entire `.dark { … }` block with:

```css
.dark {
  --background: 243 75% 8%;
  --foreground: 238 100% 97%;

  --card: 243 50% 12%;
  --card-foreground: 238 100% 97%;

  --popover: 243 50% 12%;
  --popover-foreground: 238 100% 97%;

  --primary: 239 84% 65%;
  --primary-foreground: 0 0% 100%;

  --secondary: 243 40% 16%;
  --secondary-foreground: 238 100% 97%;

  --muted: 243 40% 16%;
  --muted-foreground: 238 20% 65%;

  --accent: 243 40% 16%;
  --accent-foreground: 239 84% 65%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;

  --border: 243 30% 20%;
  --input: 243 30% 20%;
  --ring: 239 84% 65%;

  --sidebar-background: 243 75% 6%;
  --sidebar-foreground: 238 100% 97%;
  --sidebar-primary: 239 84% 65%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 243 50% 12%;
  --sidebar-accent-foreground: 238 100% 97%;
  --sidebar-border: 243 40% 14%;
  --sidebar-ring: 239 84% 65%;
}
```

- [ ] **Step 3: Verify dev server shows indigo primary color**

```bash
npm run dev
```

Open `http://localhost:8080` (or whichever port Vite picks). The existing landing page CTA button should now be indigo. If you see blue, hard-refresh the browser.

- [ ] **Step 4: Commit**

```bash
git add src/index.css
git commit -m "style: update theme tokens to indigo/deep-blue palette"
```

---

## Task 3: Create Sidebar component

**Files:**
- Create: `src/components/Sidebar.tsx`

The Sidebar replaces `Header.tsx` as the primary navigation. It is a 64px-wide fixed left column used by all authenticated pages. It uses lucide-react icons only.

- [ ] **Step 1: Create `src/components/Sidebar.tsx`**

```tsx
import { Link, useLocation } from "react-router-dom";
import { Home, Calendar, BookOpen, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ContactDeveloper } from "@/components/ContactDeveloper";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/weekly", icon: Calendar, label: "Weekly View" },
  { path: "/logbook", icon: BookOpen, label: "Log Book" },
] as const;

const Sidebar = () => {
  const { pathname } = useLocation();
  const { signOut, session } = useAuth();

  const userInitial =
    (session?.user?.user_metadata?.username as string | undefined)?.[0]?.toUpperCase() ??
    session?.user?.email?.[0]?.toUpperCase() ??
    "U";

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-16 flex-col items-center bg-[#1E1B4B] py-5">
      {/* Logo */}
      <Link
        to="/"
        className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-primary"
        title="UniLog"
      >
        <BookOpen className="h-5 w-5 text-white" />
      </Link>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col items-center gap-2">
        {NAV_LINKS.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            title={label}
            className={cn(
              "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
              pathname === path
                ? "bg-primary text-white"
                : "text-white/45 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5" />
            {/* Tooltip */}
            <span className="pointer-events-none absolute left-12 z-10 whitespace-nowrap rounded-md border border-white/10 bg-[#1E1B4B] px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {label}
            </span>
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col items-center gap-3">
        <div className="text-white/45 [&_button]:text-white/45 [&_button:hover]:text-white">
          <ContactDeveloper />
        </div>
        <div className="text-white/45 [&_button]:text-white/45 [&_button:hover]:text-white">
          <ThemeToggle />
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
          {userInitial}
        </div>
        <button
          onClick={signOut}
          title="Sign Out"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-white/45 transition-colors hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
```

- [ ] **Step 2: Verify it compiles (no runtime check yet — it will be wired up in Task 4)**

```bash
npx tsc --noEmit
```

Expected: no errors on the new file. (Ignore any pre-existing errors in the codebase.)

- [ ] **Step 3: Commit**

```bash
git add src/components/Sidebar.tsx
git commit -m "feat: add Sidebar component (icon nav, replaces Header)"
```

---

## Task 4: Create AppLayout component

**Files:**
- Create: `src/components/AppLayout.tsx`

`AppLayout` wraps every authenticated page. It renders `<Sidebar />` on the left and a topbar + main content area on the right.

- [ ] **Step 1: Create `src/components/AppLayout.tsx`**

```tsx
import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

const AppLayout = ({ children, title, subtitle, actions }: AppLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="ml-16 flex flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-6">
          <div>
            <h1 className="text-base font-bold text-foreground leading-tight">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2">{actions}</div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 bg-background p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/AppLayout.tsx
git commit -m "feat: add AppLayout shared wrapper (sidebar + topbar + main)"
```

---

## Task 5: Rewrite Landing page

**Files:**
- Modify: `src/pages/Landing.tsx`

Full rewrite. Sections: Navbar → Hero (with app preview) → Brands strip → Features → Stats → How It Works → CTA footer. No emojis — lucide-react icons throughout.

- [ ] **Step 1: Replace `src/pages/Landing.tsx` entirely**

```tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ClipboardList,
  CalendarCheck,
  FileText,
  Home,
  Calendar,
  CheckCircle2,
  FileDown,
} from "lucide-react";

const FEATURES = [
  {
    icon: ClipboardList,
    title: "Daily Task Logging",
    desc: "Record what you worked on each day with timestamps. Tag skills you applied or learned on the job.",
    badge: "With skills tagging",
    full: false,
  },
  {
    icon: CalendarCheck,
    title: "Auto Weekly Compilation",
    desc: "Every Friday, your week's tasks are automatically compiled into a structured weekly summary — no manual work.",
    badge: "Auto on Fridays",
    full: false,
  },
  {
    icon: FileText,
    title: "One-Click PDF Export",
    desc: "Generate a professional, print-ready PDF logbook from all your weekly entries instantly. Submit to your supervisor with confidence.",
    badge: "Professional format",
    full: true,
  },
];

const STATS = [
  ["500+", "Active students tracking their attachments"],
  ["3x", "Faster logbook completion vs. manual methods"],
  ["100%", "PDF-ready reports, every time"],
  ["5★", "Student satisfaction rating"],
];

const STEPS = [
  {
    n: "1",
    title: "Create Your Account",
    desc: "Sign up free with your email. Enter your name and attachment details on your cover page.",
  },
  {
    n: "2",
    title: "Log Tasks Daily",
    desc: "Each working day, add what you worked on. Tag skills you used — React, communication, data analysis, anything.",
  },
  {
    n: "3",
    title: "Export Your Logbook",
    desc: "When you're ready, generate a professional PDF logbook from all your entries with one click.",
  },
];

const PREVIEW_TASKS = [
  "Built authentication module",
  "Reviewed pull requests",
  "Updated documentation",
];

const SAMPLE_TASKS = ["Built REST API endpoints", "Attended team standup", "Wrote unit tests"];

const Landing = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const destination = session ? "/" : "/auth";

  return (
    <div className="min-h-screen bg-white font-sans text-[#1E1B4B]">
      {/* ── NAV ── */}
      <nav className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-[#e8e8f8] bg-white px-6 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold">UniLog</span>
        </div>
        <div className="hidden items-center gap-7 md:flex">
          <a href="#features" className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-gray-500 hover:text-[#4F46E5] transition-colors">
            How It Works
          </a>
        </div>
        <Button
          onClick={() => navigate(destination)}
          className="rounded-full bg-[#4F46E5] px-5 text-sm font-semibold text-white hover:bg-[#3730A3]"
        >
          {session ? "Go to Dashboard" : "Get Started Free"}
        </Button>
      </nav>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden px-6 pb-16 pt-20 text-center text-white md:px-12"
        style={{ background: "linear-gradient(160deg,#4F46E5 0%,#3730A3 55%,#1E1B4B 100%)" }}
      >
        <div className="pointer-events-none absolute -right-20 -top-16 h-96 w-96 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-white/[0.04]" />

        <span className="mb-6 inline-block rounded-full border border-white/25 bg-white/15 px-4 py-1.5 text-sm">
          Built for University Students
        </span>

        <h1 className="mx-auto mb-5 max-w-2xl text-4xl font-black leading-tight tracking-tight md:text-5xl">
          Simplify Your{" "}
          <span className="text-indigo-300">University Logbook</span>
        </h1>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
          Track daily tasks, compile weekly reports, and generate professional PDF logbooks — all in one place.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => navigate(destination)}
            className="rounded-xl bg-white px-7 py-3 text-sm font-bold text-[#4F46E5] shadow-lg hover:bg-gray-50"
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/auth")}
            className="rounded-xl border-2 border-white/40 bg-transparent px-7 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Sign In
          </Button>
        </div>

        {/* App preview card */}
        <div className="mx-auto mt-14 max-w-2xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.3)]">
          {/* Browser chrome */}
          <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 text-xs text-gray-400">UniLog — Dashboard</span>
          </div>
          <div className="flex text-left">
            {/* Mini sidebar */}
            <div className="flex w-14 flex-col items-center gap-3 bg-[#1E1B4B] py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F46E5]">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#4F46E5]">
                <Home className="h-4 w-4 text-white" />
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10">
                <Calendar className="h-4 w-4 text-white/50" />
              </div>
            </div>
            {/* Mini dashboard */}
            <div className="flex-1 bg-[#f8f8ff] p-4">
              <p className="mb-3 text-sm font-bold text-[#1E1B4B]">Good morning</p>
              <div className="mb-3 grid grid-cols-3 gap-2">
                {[["8", "Tasks Today"], ["W24", "Current Week"], ["12", "Logs Done"]].map(
                  ([val, label]) => (
                    <div key={label} className="rounded-lg bg-white p-2 shadow-sm">
                      <div className="text-base font-black text-[#4F46E5]">{val}</div>
                      <div className="text-[10px] text-gray-500">{label}</div>
                    </div>
                  )
                )}
              </div>
              {PREVIEW_TASKS.map((t) => (
                <div
                  key={t}
                  className="mb-1.5 flex items-center gap-2 rounded-lg bg-white px-3 py-2 shadow-sm"
                >
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#4F46E5]" />
                  <span className="text-xs text-gray-700">{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── BRANDS ── */}
      <div className="border-b border-[#f0f0f8] px-6 py-7 text-center">
        <p className="mb-4 text-xs text-gray-400">Trusted by students at leading universities</p>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {["UZ", "NUST", "MSU", "CUT"].map((u) => (
            <div
              key={u}
              className="rounded-lg bg-gray-100 px-5 py-2 text-sm font-semibold text-gray-500"
            >
              {u}
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="px-6 py-20 md:px-12">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
          Features
        </p>
        <h2 className="mb-3 text-center text-3xl font-black md:text-4xl">
          Everything You Need to
          <br />
          Ace Your Logbook
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-base text-gray-500">
          Purpose-built features for industrial attachment and internship reporting.
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-5 md:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, desc, badge, full }) => (
            <div
              key={title}
              className={`rounded-2xl border border-[#e8e8f8] bg-white p-7 shadow-sm ${
                full ? "md:col-span-2" : ""
              }`}
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF2FF]">
                <Icon className="h-5 w-5 text-[#4F46E5]" />
              </div>
              <h3 className="mb-2 text-base font-bold">{title}</h3>
              <p className="mb-3 text-sm leading-relaxed text-gray-500">{desc}</p>
              <span className="inline-block rounded-full bg-[#EEF2FF] px-3 py-1 text-xs font-semibold text-[#4F46E5]">
                {badge}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section
        className="px-6 py-16 md:px-12"
        style={{ background: "linear-gradient(135deg,#4F46E5 0%,#3730A3 100%)" }}
      >
        <h2 className="mb-2 text-center text-3xl font-black text-white md:text-4xl">
          Why Students Choose UniLog
        </h2>
        <p className="mb-12 text-center text-sm text-white/70">
          Numbers that speak for themselves.
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(([num, desc]) => (
            <div
              key={num}
              className="rounded-2xl border border-white/20 bg-white/10 p-6 text-center text-white"
            >
              <div className="mb-2 text-4xl font-black">{num}</div>
              <div className="text-xs leading-snug text-white/70">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="bg-[#f8f8ff] px-6 py-20 md:px-12">
        <p className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-[#4F46E5]">
          How It Works
        </p>
        <h2 className="mb-3 text-center text-3xl font-black md:text-4xl">
          Get Started in 3 Easy Steps
        </h2>
        <p className="mx-auto mb-12 max-w-md text-center text-base text-gray-500">
          From sign-up to a finished PDF logbook in minutes.
        </p>
        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-12 md:grid-cols-2 md:items-center">
          <div className="flex flex-col gap-6">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="flex gap-4">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#4F46E5] text-sm font-bold text-white">
                  {n}
                </div>
                <div>
                  <h4 className="mb-1 text-base font-bold">{title}</h4>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Step visual */}
          <div className="rounded-2xl border border-[#e8e8f8] bg-white p-6 shadow-md">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-[#1E1B4B]">
              <ClipboardList className="h-4 w-4 text-[#4F46E5]" />
              Today's Tasks
            </div>
            <div className="mb-3 flex items-center justify-between rounded-xl border-2 border-[#4F46E5] bg-[#EEF2FF] px-4 py-2.5 text-sm text-[#4F46E5]">
              <span>What did you work on today?</span>
              <span className="rounded-lg bg-[#4F46E5] px-3 py-1 text-xs font-semibold text-white">
                + Add
              </span>
            </div>
            {SAMPLE_TASKS.map((t) => (
              <div
                key={t}
                className="flex items-center gap-2 border-b border-gray-100 py-2.5 text-sm text-gray-700 last:border-0"
              >
                <span className="h-2 w-2 flex-shrink-0 rounded-full bg-[#4F46E5]" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <section className="px-6 py-20 text-center md:px-12">
        <h2 className="mb-3 text-3xl font-black md:text-4xl">
          Ready to Simplify Your Logbook?
        </h2>
        <p className="mx-auto mb-8 max-w-md text-base text-gray-500">
          Join hundreds of students already using UniLog for their industrial attachment.
        </p>
        <Button
          onClick={() => navigate(destination)}
          className="rounded-xl bg-[#4F46E5] px-9 py-3 text-base font-bold text-white shadow-[0_4px_20px_rgba(79,70,229,0.35)] hover:bg-[#3730A3]"
        >
          Get Started Free
        </Button>
      </section>
    </div>
  );
};

export default Landing;
```

- [ ] **Step 2: Run dev server and open the landing page (unauthenticated)**

```bash
npm run dev
```

Visit `http://localhost:8080` while NOT signed in. Scroll through: nav → hero with app preview → brands → features → stats → how-it-works → CTA footer. All icons should be lucide-react, no emoji visible.

- [ ] **Step 3: Commit**

```bash
git add src/pages/Landing.tsx
git commit -m "feat: rewrite Landing page — full marketing layout with indigo theme"
```

---

## Task 6: Rewrite Auth page

**Files:**
- Modify: `src/pages/Auth.tsx`

Two-panel layout: indigo gradient left panel (branding) + white right panel (auth card). Keep all existing form logic, state, and Supabase calls unchanged — only the JSX structure changes.

- [ ] **Step 1: Replace the JSX in `src/pages/Auth.tsx`**

Replace the entire `return (…)` block (line 143 to end) and add the `BookOpen` and `CheckCircle2` imports. The full file:

```tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { BookOpen, CheckCircle2 } from "lucide-react";

const FEATURES = [
  "Daily task logging with skill tagging",
  "Auto-compiled weekly summaries",
  "One-click professional PDF export",
  "Free for all students",
];

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loginIdentifier, setLoginIdentifier] = useState("");
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters long", variant: "destructive" });
      setLoading(false);
      return;
    }
    if (!username.trim()) {
      toast({ title: "Username required", description: "Please enter a username", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw error;
      toast({ title: "Success!", description: "Registration successful. Check your email for confirmation." });
      if (data.user && !data.user.email_confirmed_at) { setLoading(false); return; }
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred during sign up", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const isEmail = loginIdentifier.includes("@");
      if (isEmail) {
        const { error } = await supabase.auth.signInWithPassword({ email: loginIdentifier, password });
        if (error) throw error;
        navigate("/");
        return;
      }
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("email")
        .eq("username", loginIdentifier)
        .single();
      if (profileError) throw new Error("Username not found");
      const { error } = await supabase.auth.signInWithPassword({ email: profileData.email, password });
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "An error occurred during sign in", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ── */}
      <div
        className="hidden w-5/12 flex-col justify-center px-12 py-16 text-white md:flex"
        style={{ background: "linear-gradient(160deg,#4F46E5 0%,#3730A3 60%,#1E1B4B 100%)" }}
      >
        <div className="mb-14 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
            <BookOpen className="h-5 w-5 text-[#4F46E5]" />
          </div>
          <span className="text-xl font-extrabold">UniLog</span>
        </div>
        <h2 className="mb-4 text-3xl font-black leading-snug">
          Your Logbook,
          <br />
          <span className="text-indigo-300">Smarter.</span>
        </h2>
        <p className="mb-10 text-sm leading-relaxed text-white/75">
          Track daily tasks, compile weekly reports, and generate professional PDF logbooks for your industrial attachment.
        </p>
        <ul className="flex flex-col gap-4">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-indigo-300" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#f5f5ff] px-6 py-12 md:px-10">
        {/* Mobile logo */}
        <div className="mb-8 flex items-center gap-2 md:hidden">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#4F46E5]">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-base font-extrabold text-[#1E1B4B]">UniLog</span>
        </div>

        <div className="w-full max-w-sm rounded-2xl border border-[#e8e8f8] bg-white p-8 shadow-[0_4px_32px_rgba(79,70,229,0.1)]">
          <h3 className="mb-1 text-2xl font-extrabold text-[#1E1B4B]">
            {tab === "login" ? "Welcome back" : "Create account"}
          </h3>
          <p className="mb-6 text-sm text-gray-500">
            {tab === "login" ? "Sign in to your account" : "Start tracking your tasks for free"}
          </p>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl bg-gray-100 p-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all ${
                  tab === t
                    ? "bg-white text-[#4F46E5] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="loginIdentifier" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Email or Username
                </Label>
                <Input
                  id="loginIdentifier"
                  type="text"
                  placeholder="name@example.com or johndoe"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5] focus:ring-[#4F46E5]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-[#3730A3]"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="username" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="registerPassword" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Password
                </Label>
                <Input
                  id="registerPassword"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
                <p className="mt-1 text-xs text-gray-400">At least 6 characters</p>
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="mb-1.5 text-xs font-semibold text-gray-600">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-xl border-[#e5e7eb] bg-gray-50 focus:border-[#4F46E5]"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-xl bg-[#4F46E5] py-3 text-sm font-bold text-white shadow-[0_4px_14px_rgba(79,70,229,0.35)] hover:bg-[#3730A3]"
              >
                {loading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
```

- [ ] **Step 2: Run dev server, open `/auth` while signed out**

```bash
npm run dev
```

Visit `http://localhost:8080/auth`. Check:
- Left indigo panel visible on desktop (hidden on mobile < md breakpoint)
- Sign In / Register tab switcher works
- Both forms submit correctly (test with a real account if available)
- No emojis visible

- [ ] **Step 3: Commit**

```bash
git add src/pages/Auth.tsx
git commit -m "feat: rewrite Auth page — two-panel split layout with indigo branding"
```

---

## Task 7: Add `getWeeklyLogsCount` utility

**Files:**
- Modify: `src/utils/storageUtils.ts`

- [ ] **Step 1: Add `getWeeklyLogsCount` export at the end of `src/utils/storageUtils.ts`**

Append after the last export in the file:

```ts
export const getWeeklyLogsCount = async (): Promise<number> => {
  const { count, error } = await supabase
    .from('weekly_logs')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Error fetching weekly logs count:', error);
    return 0;
  }
  return count ?? 0;
};
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/storageUtils.ts
git commit -m "feat: add getWeeklyLogsCount utility for dashboard stat card"
```

---

## Task 8: Refactor Dashboard (Index.tsx)

**Files:**
- Modify: `src/pages/Index.tsx`

Replace `<Header />` + centered layout with `<AppLayout>` and add 3 stat cards above the task list.

- [ ] **Step 1: Replace `src/pages/Index.tsx` entirely**

```tsx
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import DailyTaskList from "@/components/DailyTaskList";
import {
  formatDate,
  isTodayFriday,
  getCurrentWeek,
  formatWeekRange,
} from "@/utils/dateUtils";
import {
  createWeeklyLog,
  getWeeklyLog,
  getTasksForWeek,
  getTasksForDay,
  getWeeklyLogsCount,
} from "@/utils/storageUtils";
import { useToast } from "@/hooks/use-toast";
import { ClipboardList, Calendar, FileText } from "lucide-react";

const Index = () => {
  const [currentDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [taskCount, setTaskCount] = useState<number>(0);
  const [logsCount, setLogsCount] = useState<number>(0);
  const { toast } = useToast();

  const weekData = getCurrentWeek();
  const weekRange = formatWeekRange(weekData.startDate, weekData.endDate);

  useEffect(() => {
    const init = async () => {
      try {
        if (isTodayFriday()) {
          const existingLog = await getWeeklyLog(weekData);
          if (!existingLog) {
            const weekTasks = await getTasksForWeek(weekData);
            if (weekTasks.length > 0) {
              await createWeeklyLog(weekData, weekTasks);
              toast({
                title: "Weekly Log Created",
                description: "Today is Friday! Your weekly tasks have been compiled into the logbook.",
                duration: 5000,
              });
            }
          }
        }

        const [todayTasks, total] = await Promise.all([
          getTasksForDay(currentDate),
          getWeeklyLogsCount(),
        ]);
        setTaskCount(todayTasks.length);
        setLogsCount(total);
      } catch (error) {
        console.error("Error initialising dashboard:", error);
        toast({
          title: "Error",
          description: "There was a problem loading your dashboard.",
          variant: "destructive",
          duration: 5000,
        });
      }
    };

    init();
  }, []);

  const handleTaskAdded = async () => {
    setRefreshKey((prev) => prev + 1);
    const todayTasks = await getTasksForDay(currentDate);
    setTaskCount(todayTasks.length);
  };

  const stats = [
    {
      label: "Tasks Today",
      value: taskCount,
      sub: formatDate(currentDate, "EEE, MMM d"),
      icon: ClipboardList,
    },
    {
      label: "Current Week",
      value: `W${weekData.weekNumber}`,
      sub: weekRange,
      icon: Calendar,
    },
    {
      label: "Logs Compiled",
      value: logsCount,
      sub: "All time",
      icon: FileText,
    },
  ];

  return (
    <AppLayout
      title="Daily Tasks"
      subtitle={formatDate(currentDate, "EEEE, MMMM d, yyyy")}
    >
      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map(({ label, value, sub, icon: Icon }) => (
          <div
            key={label}
            className="flex items-start justify-between rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
              <p className="text-3xl font-black text-foreground">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          </div>
        ))}
      </div>

      {/* Task list */}
      <div className="max-w-2xl">
        <DailyTaskList key={refreshKey} date={currentDate} onChange={handleTaskAdded} />
      </div>
    </AppLayout>
  );
};

export default Index;
```

- [ ] **Step 2: Run dev server and visit `/` while signed in**

```bash
npm run dev
```

Check:
- Dark sidebar visible on the left (Home icon active)
- Top bar shows "Daily Tasks" + today's date
- 3 stat cards render (counts may be 0 if no data yet)
- Task input and task list render below the stat cards

- [ ] **Step 3: Commit**

```bash
git add src/pages/Index.tsx
git commit -m "feat: refactor Dashboard — AppLayout, stat cards, getWeeklyLogsCount"
```

---

## Task 9: Restyle TaskInput

**Files:**
- Modify: `src/components/TaskInput.tsx`

Change from `glass/secondary` background to a white card with an indigo focus border. Keep all logic and the Alt+N shortcut.

- [ ] **Step 1: Update the form JSX in `src/components/TaskInput.tsx`**

Replace the `return (…)` block (line 63 onwards):

```tsx
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center gap-3 rounded-2xl border-2 border-border bg-card px-4 py-3 shadow-sm transition-colors focus-within:border-primary"
    >
      <Input
        ref={inputRef}
        type="text"
        placeholder="What did you accomplish today? (Alt+N)"
        value={taskContent}
        onChange={(e) => setTaskContent(e.target.value)}
        className="flex-1 border-none bg-transparent p-0 shadow-none focus-visible:ring-0"
        autoComplete="off"
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        size="sm"
        className="rounded-xl bg-primary px-4 font-semibold text-primary-foreground hover:bg-primary/90"
        disabled={!taskContent.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-1.5">
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </span>
        ) : (
          <>
            <PlusIcon className="h-4 w-4" />
            <span className="ml-1 hidden sm:inline">Add</span>
          </>
        )}
      </Button>
    </form>
  );
```

Also remove the unused `isInputFocused` state (lines 17 and 77–78) and the `setIsInputFocused` calls since the CSS now handles focus via `focus-within`:

Remove these two lines:
```tsx
const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
```
and:
```tsx
onFocus={() => setIsInputFocused(true)}
onBlur={() => setIsInputFocused(false)}
```

- [ ] **Step 2: Verify in browser — task input should be a white card with indigo border on focus**

```bash
npm run dev
```

Visit `/` signed in, click the task input field. Border should turn indigo.

- [ ] **Step 3: Commit**

```bash
git add src/components/TaskInput.tsx
git commit -m "style: restyle TaskInput — white card with indigo focus border"
```

---

## Task 10: Restyle DailyTaskList

**Files:**
- Modify: `src/components/DailyTaskList.tsx`

Restyle task cards: white card, indigo dot, skill badges in indigo-tint, action buttons visible on hover. Keep all delete/skill logic unchanged.

- [ ] **Step 1: Update imports — add `Sparkles` and `Trash2` from lucide-react**

At the top of `src/components/DailyTaskList.tsx`, change the lucide import line from:
```tsx
import { AlertTriangleIcon, TrashIcon, PlusCircleIcon, XIcon, WandSparklesIcon, RefreshCwIcon } from "lucide-react";
```
to:
```tsx
import { AlertTriangle, Trash2, PlusCircle, X, Sparkles, RefreshCw } from "lucide-react";
```

Then update every usage in the file:
- `AlertTriangleIcon` → `AlertTriangle`
- `TrashIcon` → `Trash2`
- `PlusCircleIcon` → `PlusCircle`
- `XIcon` → `X`
- `WandSparklesIcon` → `Sparkles`
- `RefreshCwIcon` → `RefreshCw`

- [ ] **Step 2: Restyle the weekend placeholder JSX**

Find the `return` inside `if (!isWeekday(date))` and replace it:
```tsx
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <AlertTriangle className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Weekend Day</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tasks are not tracked on weekends.
          <br />
          <small className="mt-1 block">Enable Saturday as a work day in Weekly settings.</small>
        </p>
      </div>
    );
```

- [ ] **Step 3: Restyle the section header + refresh button**

Find the `<div className="flex items-center justify-between mb-4">` block and replace it:
```tsx
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          {formatDate(date, "EEEE, MMMM d")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTasks}
            disabled={loading || isProcessing}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>
      </div>
```

- [ ] **Step 4: Restyle individual task cards**

Find the `{tasks.map((task) => (` block and replace the entire `<Card>…</Card>` inside the map with:

```tsx
            <div
              key={task.id}
              className="group flex items-start justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:translate-x-0.5"
            >
              <div className="flex flex-1 gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.content}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(new Date(task.createdAt), "h:mm a")}
                  </p>
                  {task.skills && task.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {task.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons — visible on hover */}
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
                      onClick={() => setSelectedTaskId(task.id)}
                      disabled={isProcessing}
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Skills</DialogTitle>
                      <DialogDescription>
                        Add skills you applied or learned while performing this task.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSkill} className="mt-4 flex items-center gap-2">
                      <Input
                        placeholder="Enter a skill (e.g., React, Time Management)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="flex-1"
                        disabled={isProcessing}
                      />
                      <Button type="submit" disabled={!skillInput.trim() || isProcessing}>
                        {isProcessing ? "Adding..." : "Add"}
                      </Button>
                    </form>
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium">Task Skills:</h4>
                      {task.skills && task.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {task.skills.map((skill) => (
                            <span
                              key={skill}
                              className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(task.id, skill)}
                                className="ml-1 text-muted-foreground hover:text-destructive"
                                disabled={isProcessing}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills added yet.</p>
                      )}
                    </div>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="mt-4">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
```

- [ ] **Step 5: Remove unused shadcn Card imports**

Remove `Card, CardContent` from the shadcn imports at the top since they are no longer used. Also remove `Badge` since skill badges are now plain `<span>` elements.

- [ ] **Step 6: Verify in browser — task cards should be white with indigo dots and hover actions**

```bash
npm run dev
```

Visit `/` signed in, add a task, hover over it — the Sparkles and Trash2 icons should appear.

- [ ] **Step 7: Commit**

```bash
git add src/components/DailyTaskList.tsx
git commit -m "style: restyle DailyTaskList — indigo dots, hover actions, skill badges"
```

---

## Task 11: Update WeeklyLogView and restyle WeeklyLog

**Files:**
- Modify: `src/pages/WeeklyLogView.tsx`
- Modify: `src/components/WeeklyLog.tsx`

### WeeklyLogView.tsx — swap layout wrapper

- [ ] **Step 1: Replace `src/pages/WeeklyLogView.tsx`**

```tsx
import AppLayout from "@/components/AppLayout";
import WeeklyLog from "@/components/WeeklyLog";

const WeeklyLogView = () => {
  return (
    <AppLayout
      title="Weekly Summary"
      subtitle="View and compile your weekly task summaries"
    >
      <WeeklyLog />
    </AppLayout>
  );
};

export default WeeklyLogView;
```

### WeeklyLog.tsx — restyle only (keep all logic)

- [ ] **Step 2: Update lucide-react imports in `src/components/WeeklyLog.tsx`**

WeeklyLog already imports `{ Calendar }` from `@/components/ui/calendar` (the shadcn date picker). To avoid a naming clash, alias the shadcn component and add the lucide icons:

```tsx
// Replace the existing calendar import:
import { Calendar as CalendarPicker } from "@/components/ui/calendar";

// Add lucide icons (new line):
import { CalendarDays, RefreshCw, ChevronLeft, ChevronRight, Settings2, Info, PlusCircle } from "lucide-react";
```

Then update every icon usage in the file:
- `CalendarIcon` → `CalendarDays` (the lucide nav icon — NOT the shadcn date picker)
- `<Calendar …/>` inside `<PopoverContent>` → `<CalendarPicker …/>` (the shadcn date picker)
- `RefreshCwIcon` → `RefreshCw`
- `ChevronLeftIcon` → `ChevronLeft`
- `ChevronRightIcon` → `ChevronRight`
- `Settings2Icon` → `Settings2`
- `InfoIcon` → `Info`
- `PlusCircleIcon` → `PlusCircle`

- [ ] **Step 3: Restyle the week navigation bar**

Find the outer `<div className="flex items-center justify-between mb-6 flex-wrap gap-2">` block (line 229 in the original file). Replace it with the block below. **Important:** the two `<DialogContent>` elements (Help and Settings) are NOT shown here — leave them exactly as they are in the original file, only the outer wrapper div and `<DialogTrigger>` buttons change.

```tsx
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Week {weekData.weekNumber}, {weekData.year}
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <span>{formatWeekRange(weekData.startDate, weekData.endDate)}</span>
            {isInPastWeek() && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Past Week</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Help dialog — only the trigger button changes; keep DialogContent from original */}
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary">
                <Info className="h-4 w-4" />
              </button>
            </DialogTrigger>
            {/* ← paste the original <DialogContent>…</DialogContent> block here unchanged */}
          </Dialog>

          {/* Settings dialog — only the trigger button changes; keep DialogContent from original */}
          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings2 className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            {/* ← paste the original <DialogContent>…</DialogContent> block here unchanged */}
          </Dialog>

          {/* Week navigation */}
          <div className="flex items-center rounded-xl border border-border bg-card">
            <button
              onClick={handlePreviousWeek}
              className="flex h-8 w-8 items-center justify-center rounded-l-xl text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-primary">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Change Week</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                {/* CalendarPicker is the aliased shadcn date picker (not the lucide icon) */}
                <CalendarPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <button
              onClick={handleNextWeek}
              className="flex h-8 w-8 items-center justify-center rounded-r-xl text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={compileWeeklyLog}
            disabled={isCompiling || tasks.length === 0 || isLoading}
            size="sm"
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isCompiling ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isCompiling ? "Compiling..." : "Compile"}</span>
          </Button>
        </div>
      </div>
```

- [ ] **Step 4: Restyle the "Skills This Week" card**

Find the `<Card className="bg-muted/20 border border-muted">` card and change its className:
```tsx
<Card className="border border-border bg-card">
```
Change Badge variant inside to use indigo accent:
```tsx
<span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">{skill}</span>
```
Remove the `<Badge>` component usage and replace with the `<span>` above.

- [ ] **Step 5: Restyle the day cards grid**

Find the `<Card key={dayStr} …>` inside the `.map((day) =>` loop and update its className:
```tsx
<Card
  key={dayStr}
  className={`cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 ${
    dayTasks.length === 0 ? "opacity-60 hover:opacity-100" : ""
  }`}
  onClick={() => handleDayClick(day)}
>
```

Inside the card, restyle task items:
```tsx
<li key={task.id} className="flex items-start gap-2 py-1 text-xs text-foreground">
  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
  <span>{task.content}</span>
</li>
```

Replace skill `<Badge>` inside the day cards with:
```tsx
<span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">{skill}</span>
```

Replace the `<PlusCircleIcon>` in `<CardFooter>` with:
```tsx
<PlusCircle className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
```

- [ ] **Step 6: Remove unused Badge import from WeeklyLog.tsx**

Remove `{ Badge }` from the shadcn/ui badge import since badges are now plain `<span>` elements.

- [ ] **Step 7: Verify in browser — visit `/weekly` signed in**

```bash
npm run dev
```

Check: sidebar shows Calendar icon as active, week navigation works, day cards are white with indigo accents, clicking a day opens the task dialog.

- [ ] **Step 8: Commit**

```bash
git add src/pages/WeeklyLogView.tsx src/components/WeeklyLog.tsx
git commit -m "style: update WeeklyLogView and WeeklyLog — AppLayout + indigo restyle"
```

---

## Task 12: Update LogBookView (tabs + AppLayout)

**Files:**
- Modify: `src/pages/LogBookView.tsx`

Add a Cover Page / All Entries tab strip and wire up `<AppLayout>`. The existing `<LogBook />` component goes into the "All Entries" tab unchanged.

- [ ] **Step 1: Replace `src/pages/LogBookView.tsx`**

```tsx
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import LogBook from "@/components/LogBook";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { CoverPageForm } from "@/components/CoverPageForm";

type Tab = "cover" | "entries";

const LogBookView = () => {
  const [activeTab, setActiveTab] = useState<Tab>("cover");

  const tabs: { id: Tab; label: string }[] = [
    { id: "cover", label: "Cover Page" },
    { id: "entries", label: "All Entries" },
  ];

  return (
    <AppLayout
      title="Log Book"
      subtitle="Your complete industrial attachment logbook"
      actions={
        <Button size="sm" className="gap-1.5">
          <FileDown className="h-4 w-4" />
          Export Full PDF
        </Button>
      }
    >
      {/* Tab strip */}
      <div className="-mx-6 -mt-6 mb-6 flex border-b border-border bg-card px-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
              activeTab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "cover" ? <CoverPageForm /> : <LogBook />}
    </AppLayout>
  );
};

export default LogBookView;
```

- [ ] **Step 2: Verify `CoverPageForm` is importable**

Check if `src/components/CoverPageForm.tsx` exists and exports a default or named `CoverPageForm`. Run:

```bash
npx tsc --noEmit
```

If `CoverPageForm` does not export that name, adjust the import to match its actual export. If the file doesn't exist, use a placeholder `<div>Cover page details coming soon</div>` in the cover tab for now.

- [ ] **Step 3: Verify in browser — visit `/logbook` signed in**

```bash
npm run dev
```

Check: sidebar shows BookOpen icon as active, tab strip switches between Cover Page and All Entries, Export PDF button visible in top bar.

- [ ] **Step 4: Commit**

```bash
git add src/pages/LogBookView.tsx
git commit -m "feat: add Cover/Entries tabs to LogBookView, use AppLayout"
```

---

## Task 13: Delete old Header and final cleanup

**Files:**
- Delete: `src/components/Header.tsx`

- [ ] **Step 1: Confirm no remaining imports of Header.tsx**

```bash
grep -r "from.*components/Header" src/
```

Expected: no output. If any file still imports Header, fix it first by switching it to AppLayout.

- [ ] **Step 2: Delete Header.tsx**

```bash
rm src/components/Header.tsx
```

- [ ] **Step 3: Run type check to confirm nothing is broken**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run dev server and test all routes**

```bash
npm run dev
```

Manually visit these routes:
- `/` (unauthenticated) → Landing page
- `/auth` → Auth page (two panels)
- `/` (authenticated) → Dashboard with sidebar
- `/weekly` (authenticated) → Weekly view with sidebar
- `/logbook` (authenticated) → Logbook with tabs and sidebar

- [ ] **Step 5: Final commit**

```bash
git rm src/components/Header.tsx
git add -A
git commit -m "chore: remove old Header component — fully replaced by Sidebar + AppLayout"
```

---

## Summary of all commits

1. `chore: ignore .superpowers brainstorm directory`
2. `style: update theme tokens to indigo/deep-blue palette`
3. `feat: add Sidebar component (icon nav, replaces Header)`
4. `feat: add AppLayout shared wrapper (sidebar + topbar + main)`
5. `feat: rewrite Landing page — full marketing layout with indigo theme`
6. `feat: rewrite Auth page — two-panel split layout with indigo branding`
7. `feat: add getWeeklyLogsCount utility for dashboard stat card`
8. `feat: refactor Dashboard — AppLayout, stat cards, getWeeklyLogsCount`
9. `style: restyle TaskInput — white card with indigo focus border`
10. `style: restyle DailyTaskList — indigo dots, hover actions, skill badges`
11. `style: update WeeklyLogView and WeeklyLog — AppLayout + indigo restyle`
12. `feat: add Cover/Entries tabs to LogBookView, use AppLayout`
13. `chore: remove old Header component — fully replaced by Sidebar + AppLayout`
