
import Header from "@/components/Header";
import WeeklyLog from "@/components/WeeklyLog";

const WeeklyLogView = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-6xl mx-auto px-4 pt-28 pb-20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Weekly Summary</h1>
          <p className="text-muted-foreground">
            View and compile your weekly task summaries
          </p>
        </div>

        <WeeklyLog />
      </main>
    </div>
  );
};

export default WeeklyLogView;
