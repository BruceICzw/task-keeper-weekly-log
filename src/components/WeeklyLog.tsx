import { useState, useEffect } from "react";
import { 
  formatDate, 
  getWeekForDate, 
  getWeekDaysOnly, 
  formatWeekRange, 
  getWeekIdentifier,
  getPreviousWeek,
  getNextWeek,
  setInternshipStartDate,
  getInternshipStartDate,
  setSaturdayWorkDay,
  isSaturdayWorkDay,
  WeekData,
  getDayIdentifier
} from "@/utils/dateUtils";
import { 
  getTasksForWeek, 
  createWeeklyLog, 
  getWeeklyLog,
  getTasksForDay,
  Task, 
  WeeklyLog as WeeklyLogType 
} from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { CalendarDays, RefreshCw, ChevronLeft, ChevronRight, Settings2, Info, PlusCircle } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import DailyTaskList from "@/components/DailyTaskList";

interface WeeklyLogProps {
  selectedDate?: Date;
  onCompile?: (log: WeeklyLogType) => void;
}

const WeeklyLog = ({ selectedDate = new Date(), onCompile }: WeeklyLogProps) => {
  const [weekData, setWeekData] = useState<WeekData>(getWeekForDate(selectedDate));
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [compiledLog, setCompiledLog] = useState<WeeklyLogType | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date>(selectedDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [internshipStartDate, setInternshipStartDateState] = useState<Date | null>(getInternshipStartDate());
  const [saturdayWorkDay, setSaturdayWorkDayState] = useState<boolean>(isSaturdayWorkDay());
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showDayDialog, setShowDayDialog] = useState<boolean>(false);
  const [dailyTaskListKey, setDailyTaskListKey] = useState<number>(0);
  const [dayTasks, setDayTasks] = useState<Task[]>([]);
  const [isDayTasksLoading, setIsDayTasksLoading] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWeekData();
  }, [date]);

  const loadWeekData = async () => {
    setIsLoading(true);
    try {
      const newWeekData = getWeekForDate(date);
      setWeekData(newWeekData);
      
      const days = getWeekDaysOnly(newWeekData.startDate, newWeekData.endDate);
      setWeekDays(days);
      
      const weekTasks = await getTasksForWeek(newWeekData);
      setTasks(weekTasks);
      
      const existingLog = await getWeeklyLog(newWeekData);
      setCompiledLog(existingLog);
    } catch (error) {
      console.error('Error loading week data:', error);
      toast({
        title: "Error",
        description: "Failed to load weekly data. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDayTasks = async (day: Date) => {
    setIsDayTasksLoading(true);
    try {
      const loadedTasks = await getTasksForDay(day);
      setDayTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading day tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks for this day.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDayTasksLoading(false);
    }
  };

  const compileWeeklyLog = async () => {
    if (isCompiling) return;
    
    setIsCompiling(true);
    try {
      const log = await createWeeklyLog(weekData, tasks);
      setCompiledLog(log);
      
      if (onCompile) {
        onCompile(log);
      }
      
      toast({
        title: "Weekly log compiled",
        description: "Your tasks have been compiled into a weekly log.",
        duration: 4000,
      });
    } catch (error) {
      console.error('Error compiling weekly log:', error);
      toast({
        title: "Error",
        description: "Failed to compile weekly log. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsCompiling(false);
    }
  };

  const handlePreviousWeek = () => {
    const previousWeek = getPreviousWeek(weekData);
    setDate(previousWeek.startDate);
  };

  const handleNextWeek = () => {
    const nextWeek = getNextWeek(weekData);
    setDate(nextWeek.startDate);
  };

  const handleSaveSettings = () => {
    if (internshipStartDate) {
      setInternshipStartDate(internshipStartDate);
    }
    
    setSaturdayWorkDay(saturdayWorkDay);
    setShowSettings(false);
    
    loadWeekData();
    
    toast({
      title: "Settings saved",
      description: "Your logbook settings have been updated.",
      duration: 3000,
    });
  };

  const handleTaskAdded = () => {
    loadWeekData();
    if (selectedDay) {
      loadDayTasks(selectedDay); 
    }
  };

  const handleDayClick = (day: Date) => {
    const selectedDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());
    
    console.log('Selected day:', selectedDate, 'Formatted ID:', getDayIdentifier(selectedDate));
    
    setSelectedDay(selectedDate);
    setDailyTaskListKey(prevKey => prevKey + 1);
    loadDayTasks(selectedDate);
    setShowDayDialog(true);
  };

  const groupTasksByDay = () => {
    const groupedTasks: Record<string, Task[]> = {};
    
    weekDays.forEach(day => {
      const dayStr = formatDate(day, "yyyy-MM-dd");
      groupedTasks[dayStr] = tasks.filter(task => 
        task.date.startsWith(dayStr)
      );
    });
    
    return groupedTasks;
  };

  const getAllSkills = (tasksList: Task[]): string[] => {
    const skillsSet = new Set<string>();
    
    tasksList.forEach(task => {
      if (task.skills && task.skills.length > 0) {
        task.skills.forEach(skill => skillsSet.add(skill));
      }
    });
    
    return Array.from(skillsSet);
  };

  const tasksByDay = groupTasksByDay();
  const allSkills = getAllSkills(tasks);

  const isInPastWeek = (): boolean => {
    const today = new Date();
    return weekData.endDate < today;
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            Week {weekData.weekNumber}, {weekData.year}
          </h2>
          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
            <span>{formatWeekRange(weekData.startDate, weekData.endDate)}</span>
            {isInPastWeek() && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">Past Week</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={showHelp} onOpenChange={setShowHelp}>
            <DialogTrigger asChild>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary">
                <Info className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Weekly Log Navigation</DialogTitle>
                <DialogDescription>
                  How to work with different weeks
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <p className="text-sm">
                  You can navigate to <strong>past weeks</strong> using the following methods:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Click the <strong>left arrow button</strong> to go to the previous week</li>
                  <li>Use the <strong>calendar</strong> icon to pick any date and view its week</li>
                  <li>Once you've selected a week, you can click on any day to add tasks</li>
                </ul>
                <div className="bg-muted p-3 rounded-md mt-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Tip:</strong> To modify which days are considered work days,
                    use the Settings button to configure your preferences.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showSettings} onOpenChange={setShowSettings}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings2 className="h-4 w-4" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Logbook Settings</DialogTitle>
                <DialogDescription>
                  Configure your logbook preferences and internship details.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label>Internship Start Date</Label>
                  <div className="border rounded-md p-1">
                    <CalendarPicker
                      mode="single"
                      selected={internshipStartDate || undefined}
                      onSelect={(newDate) => newDate && setInternshipStartDateState(newDate)}
                      className="w-full"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This date will be used to calculate week numbers for your logbook.
                  </p>
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="saturday-work">Include Saturday as Work Day</Label>
                  <Switch
                    id="saturday-work"
                    checked={saturdayWorkDay}
                    onCheckedChange={setSaturdayWorkDayState}
                  />
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleSaveSettings}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex items-center rounded-xl border border-border bg-card">
            <button
              onClick={handlePreviousWeek}
              className="flex h-8 w-8 items-center justify-center rounded-l-xl text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-1.5 px-3 text-xs font-medium text-muted-foreground hover:text-primary">
                  <CalendarDays className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Change Week</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <CalendarPicker
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <button
              onClick={handleNextWeek}
              className="flex h-8 w-8 items-center justify-center rounded-r-xl text-muted-foreground hover:bg-accent hover:text-primary"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={compileWeeklyLog}
            disabled={isCompiling || tasks.length === 0 || isLoading}
            size="sm"
            className="gap-1.5"
          >
            <RefreshCw className={`h-4 w-4 ${isCompiling ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">{isCompiling ? "Compiling..." : "Compile"}</span>
          </Button>
        </div>
      </div>
      
      {isInPastWeek() && (
        <div className="mb-4 p-3 bg-muted/30 border border-muted rounded-md text-sm flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <p>
            You are viewing a past week. Click on any day to add or edit tasks for this day.
          </p>
        </div>
      )}
      
      {isLoading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading week data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {allSkills.length > 0 && (
            <Card className="border border-border bg-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Skills This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <span key={skill} className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">{skill}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {compiledLog && (
            <Card className="bg-accent border border-accent animate-scale-in">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full mr-2">Compiled</span>
                  Weekly Log Compiled
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This week's tasks have been compiled into your logbook on{" "}
                  {formatDate(new Date(compiledLog.compiledAt), "MMMM d, yyyy 'at' h:mm a")}.
                </p>
                <div className="mt-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">View Compiled Log</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Weekly Log</DialogTitle>
                        <DialogDescription>
                          Week {compiledLog.weekNumber}, {compiledLog.year} • {formatWeekRange(new Date(compiledLog.startDate), new Date(compiledLog.endDate))}
                        </DialogDescription>
                      </DialogHeader>
                      
                      <div className="mt-4 space-y-4">
                        {compiledLog.tasks.length > 0 ? (
                          Object.entries(
                            compiledLog.tasks.reduce<Record<string, Task[]>>((acc, task) => {
                              const dayStr = task.date.split('T')[0];
                              if (!acc[dayStr]) acc[dayStr] = [];
                              acc[dayStr].push(task);
                              return acc;
                            }, {})
                          ).map(([dayStr, dayTasks]) => (
                            <div key={dayStr} className="bg-muted/40 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">
                                {formatDate(new Date(dayStr), "EEEE, MMMM d")}
                              </h4>
                              <ul className="space-y-2">
                                {dayTasks.map(task => (
                                  <li key={task.id} className="text-sm pb-2 border-b border-border last:border-0 last:pb-0">
                                    <div>{task.content}</div>
                                    {task.skills && task.skills.length > 0 && (
                                      <div className="mt-1 flex flex-wrap gap-1">
                                        {task.skills.map(skill => (
                                          <span key={skill} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">{skill}</span>
                                        ))}
                                      </div>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6">
                            <p className="text-muted-foreground">No tasks found in this log.</p>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {weekDays.map((day) => {
              const dayStr = formatDate(day, "yyyy-MM-dd");
              const dayTasks = tasksByDay[dayStr] || [];
              
              return (
                <Card 
                  key={dayStr} 
                  className={`cursor-pointer overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/30 ${
                  dayTasks.length === 0 ? "opacity-60 hover:opacity-100" : ""
                }`}
                  onClick={() => handleDayClick(day)}
                >
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm font-medium">
                      {formatDate(day, "EEEE")}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{formatDate(day, "MMMM d")}</p>
                  </CardHeader>
                  <CardContent className="px-4 pb-2 pt-0">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No tasks</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {dayTasks.map((task) => (
                          <li key={task.id} className="flex items-start gap-2 py-1 text-xs text-foreground">
                            <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                            <span>{task.content}</span>
                            {task.skills && task.skills.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {task.skills.map(skill => (
                                  <span key={skill} className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-primary">{skill}</span>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0 pb-3 px-4">
                    <div className="w-full flex justify-center">
                      <PlusCircle className="h-4 w-4 text-muted-foreground transition-colors hover:text-primary" />
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedDay ? formatDate(selectedDay, "EEEE, MMMM d") : "Add Tasks"}
            </DialogTitle>
            <DialogDescription>
              Add or manage tasks for this day
            </DialogDescription>
          </DialogHeader>
          
          {selectedDay && (
            <div className="mt-4">
              {isDayTasksLoading ? (
                <div className="flex justify-center p-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <DailyTaskList 
                  key={dailyTaskListKey} 
                  date={selectedDay} 
                  onChange={handleTaskAdded} 
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WeeklyLog;
