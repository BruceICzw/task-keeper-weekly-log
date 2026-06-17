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
