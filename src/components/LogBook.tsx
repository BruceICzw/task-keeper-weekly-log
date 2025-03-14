
import { useState, useEffect } from "react";
import { getAllWeeklyLogs, WeeklyLog, deleteWeeklyLog } from "@/utils/storageUtils";
import { formatWeekRange, formatDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
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
import { BookIcon, TrashIcon, FileTextIcon, Calendar, PlusCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

interface TasksBySKill {
  [day: string]: string[];
}

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
        <div className="overflow-x-auto">
          <Table className="border-collapse w-full">
            <TableCaption>Your weekly task log records</TableCaption>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[250px] border border-border">Date</TableHead>
                <TableHead className="border border-border">Task Performed</TableHead>
                <TableHead className="w-[250px] border border-border">Skills applied / Learnt</TableHead>
                <TableHead className="w-[100px] border border-border text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/20">
                  <TableCell className="font-medium border border-border">
                    Week {log.weekNumber}: {formatWeekRange(new Date(log.startDate), new Date(log.endDate))}
                  </TableCell>
                  <TableCell className="border border-border">
                    {log.tasks.length > 0 ? (
                      <ul className="list-disc pl-5 space-y-1">
                        {log.tasks.map((task, index) => (
                          <li key={task.id} className="text-sm">
                            {task.content}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">No tasks recorded</span>
                    )}
                  </TableCell>
                  <TableCell className="border border-border">
                    <div className="flex justify-center items-center h-full">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                            <PlusCircleIcon className="h-4 w-4 mr-2" />
                            Add Skills
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Skills for Week {log.weekNumber}</DialogTitle>
                            <DialogDescription>
                              Add the skills you applied or learned during this week.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <p className="text-sm text-muted-foreground">
                              This feature will be implemented in a future update.
                            </p>
                          </div>
                          <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                          </DialogClose>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                  <TableCell className="border border-border text-center">
                    <div className="flex justify-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <FileTextIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Weekly Log Details</DialogTitle>
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default LogBook;
