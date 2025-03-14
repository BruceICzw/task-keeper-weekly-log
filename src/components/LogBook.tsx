
import { useState, useEffect } from "react";
import { getAllWeeklyLogs, WeeklyLog, deleteWeeklyLog } from "@/utils/storageUtils";
import { formatWeekRange, formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { BookIcon, TrashIcon, FileTextIcon, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LogBook = () => {
  const [logs, setLogs] = useState<WeeklyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    setLoading(true);
    const allLogs = getAllWeeklyLogs();
    // Sort logs by date, most recent first
    const sortedLogs = allLogs.sort((a, b) => {
      return new Date(b.compiledAt).getTime() - new Date(a.compiledAt).getTime();
    });
    setLogs(sortedLogs);
    setLoading(false);
  };

  const handleDeleteLog = (logId: string) => {
    deleteWeeklyLog(logId);
    loadLogs();
    
    toast({
      title: "Log deleted",
      description: "The weekly log has been removed from your logbook.",
      duration: 3000,
    });
  };

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <BookIcon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-light">Weekly Logbook</h2>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading your logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <BookIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-light mb-2">Your Logbook is Empty</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            You don't have any weekly logs yet. Add tasks during the week and they will be automatically compiled every Friday.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "/"}>
            <FileTextIcon className="h-4 w-4 mr-2" />
            Add Some Tasks
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {logs.map((log) => (
            <Card key={log.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center justify-between">
                  <span>Week {log.weekNumber}, {log.year}</span>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Weekly Log</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this weekly log? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteLog(log.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardTitle>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="h-3.5 w-3.5 mr-1.5" />
                  <span>
                    {formatWeekRange(new Date(log.startDate), new Date(log.endDate))}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm mb-3">
                  <span className="text-muted-foreground">
                    {log.tasks.length} {log.tasks.length === 1 ? "task" : "tasks"} • Compiled on {formatDate(new Date(log.compiledAt), "MMMM d, yyyy")}
                  </span>
                </div>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <FileTextIcon className="h-4 w-4 mr-2" />
                      View Log
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Weekly Log</DialogTitle>
                      <DialogDescription>
                        Week {log.weekNumber}, {log.year} • {formatWeekRange(new Date(log.startDate), new Date(log.endDate))}
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="mt-4 space-y-4">
                      {log.tasks.length > 0 ? (
                        Object.entries(
                          log.tasks.reduce<Record<string, typeof log.tasks>>((acc, task) => {
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
                                  {task.content}
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
                    
                    <div className="mt-6">
                      <Separator className="mb-4" />
                      <div className="text-xs text-muted-foreground">
                        Compiled on {formatDate(new Date(log.compiledAt), "MMMM d, yyyy 'at' h:mm a")}
                      </div>
                    </div>
                    
                    <DialogClose asChild>
                      <Button className="mt-4" variant="outline">Close</Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogBook;
