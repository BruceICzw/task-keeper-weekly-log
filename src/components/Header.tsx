
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookIcon, ListIcon } from "lucide-react";
import { formatDate } from "@/utils/dateUtils";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const today = new Date();

  return (
    <header className="w-full px-6 py-4 glass shadow-sm mb-8 backdrop-blur-lg fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 
              className="text-2xl font-light tracking-tight cursor-pointer transition-all duration-300 hover:text-primary"
              onClick={() => navigate("/")}
            >
              Task Keeper
            </h1>
            <div className="hidden md:flex items-center space-x-1 text-muted-foreground">
              <span className="text-xs px-2 py-1 bg-secondary rounded-full">
                {formatDate(today, "EEEE, MMMM d")}
              </span>
            </div>
          </div>
          
          <nav className="flex items-center space-x-1">
            <Button
              variant={location.pathname === "/" ? "default" : "ghost"}
              size="sm"
              className="text-sm transition-all duration-300"
              onClick={() => navigate("/")}
            >
              <ListIcon className="h-4 w-4 mr-1" />
              Tasks
            </Button>
            
            <Button
              variant={location.pathname === "/weekly" ? "default" : "ghost"}
              size="sm"
              className="text-sm transition-all duration-300"
              onClick={() => navigate("/weekly")}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Weekly
            </Button>
            
            <Button
              variant={location.pathname === "/logbook" ? "default" : "ghost"}
              size="sm"
              className="text-sm transition-all duration-300"
              onClick={() => navigate("/logbook")}
            >
              <BookIcon className="h-4 w-4 mr-1" />
              Logbook
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
