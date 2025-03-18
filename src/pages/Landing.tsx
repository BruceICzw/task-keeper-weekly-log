
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { BookOpen, CalendarDays, FileText } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Uni Log Book Creator
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create and manage your university log books with ease. Track your daily tasks,
            compile weekly reports, and generate professional PDFs.
          </p>
          <div className="mt-8">
            <Button
              size="lg"
              onClick={() => navigate(session ? "/" : "/auth")}
              className="text-lg"
            >
              {session ? "Go to Dashboard" : "Get Started"}
            </Button>
          </div>
        </header>

        <section className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4 text-primary">
              <FileText size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Daily Tasks</h3>
            <p className="text-muted-foreground">
              Record your daily activities and accomplishments with our intuitive interface.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4 text-primary">
              <CalendarDays size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Weekly Reports</h3>
            <p className="text-muted-foreground">
              Automatically compile your daily tasks into organized weekly summaries.
            </p>
          </div>

          <div className="bg-card p-6 rounded-lg shadow-lg">
            <div className="mb-4 text-primary">
              <BookOpen size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">PDF Export</h3>
            <p className="text-muted-foreground">
              Generate professional PDF log books with just one click.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Landing;
