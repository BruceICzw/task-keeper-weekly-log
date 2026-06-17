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

  const displayName =
    (session?.user?.user_metadata?.username as string | undefined) ??
    session?.user?.email?.split("@")[0] ??
    "User";

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-52 flex-col bg-[#1E1B4B] px-3 py-5">
      {/* Logo */}
      <Link to="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
          <BookOpen className="h-4 w-4 text-white" />
        </div>
        <span className="text-base font-extrabold text-white">UniLog</span>
      </Link>

      {/* Nav links */}
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_LINKS.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === path
                ? "bg-primary text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            )}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="flex flex-col gap-1">
        {/* Utility icon buttons */}
        <div className="flex items-center gap-1 px-2 pb-1">
          <div className="text-white/45 [&_button]:text-white/45 [&_button:hover]:text-white">
            <ContactDeveloper />
          </div>
          <div className="text-white/45 [&_button]:text-white/45 [&_button:hover]:text-white">
            <ThemeToggle />
          </div>
        </div>

        {/* Divider */}
        <div className="mx-2 h-px bg-white/10" />

        {/* User row */}
        <div className="mt-1 flex items-center justify-between rounded-xl px-3 py-2">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {userInitial}
            </div>
            <span className="truncate text-sm font-medium text-white/70">
              {displayName}
            </span>
          </div>
          <button
            onClick={signOut}
            title="Sign Out"
            className="ml-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-white/45 transition-colors hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
