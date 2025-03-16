
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import TaskInput from "@/components/TaskInput";
import DailyTaskList from "@/components/DailyTaskList";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate, isTodayFriday, getCurrentWeek } from "@/utils/dateUtils";
import { createWeeklyLog, getWeeklyLog, getTasksForWeek } from "@/utils/storageUtils";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [currentDate] = useState<Date>(new Date());
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Check if today is Friday and we need to compile the weekly log
  useEffect(() => {
    const checkForFridayCompilation = async () => {
      if (isTodayFriday()) {
        const weekData = getCurrentWeek();
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
    };
    
    checkForFridayCompilation();
  }, []);

  const handleTaskAdded = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-28 pb-20 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-light tracking-tight mb-2">Daily Tasks</h1>
          <p className="text-muted-foreground">
            {formatDate(currentDate, "EEEE, MMMM d, yyyy")}
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-light mb-4">Add a New Task</h2>
            <TaskInput date={currentDate} onTaskAdded={handleTaskAdded} />
          </CardContent>
        </Card>

        <div className="mb-4">
          <h2 className="text-xl font-light mb-4">Today's Tasks</h2>
          <DailyTaskList key={refreshKey} date={currentDate} onChange={handleTaskAdded} />
        </div>
      </main>
    </div>
  );
};

export default Index;
