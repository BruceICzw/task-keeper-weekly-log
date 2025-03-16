
import { useState, useEffect } from "react";
import { 
  formatDate, 
  getWeekForDate, 
  getWeekDaysOnly, 
  formatWeekRange, 
  getWeekIdentifier,
  WeekData
} from "@/utils/dateUtils";
import { 
  getTasksForWeek, 
  createWeeklyLog, 
  getWeeklyLog, 
  Task, 
  WeeklyLog as WeeklyLogType 
} from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { CalendarIcon, RefreshCwIcon } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

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

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-light mb-1">Weekly Summary</h2>
          <div className="text-sm text-muted-foreground flex items-center">
            <span>Week {weekData.weekNumber}, {weekData.year}</span>
            <span className="mx-2">•</span>
            <span>{formatWeekRange(weekData.startDate, weekData.endDate)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="transition-all duration-300">
                <CalendarIcon className="h-4 w-4 mr-2" />
                <span>Change Week</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Button 
            onClick={compileWeeklyLog} 
            disabled={isCompiling || tasks.length === 0 || isLoading}
            className="transition-all duration-300 hover:scale-105"
          >
            {isCompiling ? (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2 animate-spin" />
                Compiling...
              </>
            ) : (
              <>
                <RefreshCwIcon className="h-4 w-4 mr-2" />
                Compile Now
              </>
            )}
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <RefreshCwIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
          <p className="text-muted-foreground">Loading week data...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-xl font-light mb-2">No Tasks This Week</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            There are no tasks for this week yet. Add some tasks to your daily log to see them here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {allSkills.length > 0 && (
            <Card className="bg-muted/20 border border-muted">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Skills This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="px-3 py-1">
                      {skill}
                    </Badge>
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
                                          <Badge key={skill} variant="outline" className="text-xs">
                                            {skill}
                                          </Badge>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {weekDays.map((day) => {
              const dayStr = formatDate(day, "yyyy-MM-dd");
              const dayTasks = tasksByDay[dayStr] || [];
              
              return (
                <Card key={dayStr} className={`overflow-hidden transition-all duration-300 hover:shadow-md ${dayTasks.length === 0 ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <CardTitle className="text-sm font-medium">
                      {formatDate(day, "EEEE")}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">{formatDate(day, "MMMM d")}</p>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 pt-0">
                    {dayTasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic">No tasks</p>
                    ) : (
                      <ul className="space-y-2 text-sm">
                        {dayTasks.map((task) => (
                          <li key={task.id} className="task-item">
                            <div>{task.content}</div>
                            {task.skills && task.skills.length > 0 && (
                              <div className="mt-1 flex flex-wrap gap-1">
                                {task.skills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeeklyLog;
