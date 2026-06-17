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
