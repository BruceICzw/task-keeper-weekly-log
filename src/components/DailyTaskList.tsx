
import { useState, useEffect } from "react";
import { formatDate, isWeekday } from "@/utils/dateUtils";
import { getTasksForDay, Task, deleteTask } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangleIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DailyTaskListProps {
  date: Date;
  onChange?: () => void;
}

const DailyTaskList = ({ date, onChange }: DailyTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [date]);

  const loadTasks = () => {
    setLoading(true);
    const dayTasks = getTasksForDay(date);
    setTasks(dayTasks);
    setLoading(false);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
    loadTasks();
    if (onChange) onChange();
    
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
      duration: 3000,
    });
  };

  if (!isWeekday(date)) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <AlertTriangleIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
        <h3 className="text-xl font-light mb-2">Weekend Day</h3>
        <p className="text-muted-foreground max-w-md">
          This is a weekend day. Tasks are not tracked on weekends.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {formatDate(date, "EEEE, MMMM d")}
        </h3>
        <div className="text-sm text-muted-foreground">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      {loading ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">No tasks for this day yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="overflow-hidden task-item">
              <CardContent className="p-0">
                <div className="flex items-start justify-between p-4">
                  <div className="flex-1">
                    <p>{task.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(new Date(task.createdAt), "h:mm a")}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyTaskList;
