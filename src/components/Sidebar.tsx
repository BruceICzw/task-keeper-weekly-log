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
