
import { Link, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X, BookOpen, Calendar, Home, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { ContactDeveloper } from "./ContactDeveloper";

const Header = () => {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setOpen(false);
  };

  const links = [
    { name: "Home", path: "/", icon: <Home className="size-5" /> },
    { name: "Weekly View", path: "/weekly", icon: <Calendar className="size-5" /> },
    { name: "Log Book", path: "/logbook", icon: <BookOpen className="size-5" /> },
  ];

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary ${
                    pathname === link.path ? "text-primary" : "text-muted-foreground"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <Button
                variant="ghost"
                className="flex items-center justify-start gap-2 px-2 text-lg font-medium text-muted-foreground transition-colors hover:text-primary"
                onClick={handleSignOut}
              >
                <LogOut className="size-5" />
                Sign Out
              </Button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link to="/" className="flex items-center gap-2">
          <span className="text-lg font-bold">Uni Log Book Creator</span>
        </Link>
      </div>
      <nav className="hidden md:flex md:items-center md:gap-6">
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
              pathname === link.path ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
        <ContactDeveloper />
        <ThemeToggle />
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          onClick={handleSignOut}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </nav>
    </header>
  );
};

export default Header;
