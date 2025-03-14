
import Header from "@/components/Header";
import LogBook from "@/components/LogBook";

const LogBookView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Weekly Logbook</h1>
          <p className="text-muted-foreground">
            Your compiled weekly task summaries
          </p>
        </div>

        <LogBook />
      </main>
    </div>
  );
};

export default LogBookView;
