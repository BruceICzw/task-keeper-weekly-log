
import { useState, useEffect } from "react";
import { formatDate, isWeekday } from "@/utils/dateUtils";
import { getTasksForDay, Task, deleteTask, addSkillsToTask, removeSkillFromTask } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Trash2, PlusCircle, X, Sparkles, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import TaskInput from "@/components/TaskInput";

interface DailyTaskListProps {
  date: Date;
  onChange?: () => void;
}

const DailyTaskList = ({ date, onChange }: DailyTaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [skillInput, setSkillInput] = useState<string>("");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    loadTasks();
  }, [date]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const dayTasks = await getTasksForDay(date);
      setTasks(dayTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAdded = () => {
    loadTasks();
    if (onChange) onChange();
  };

  const handleDeleteTask = async (taskId: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await deleteTask(taskId);
      await loadTasks();
      if (onChange) onChange();

      toast({
        title: "Task deleted",
        description: "The task has been removed.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTaskId || !skillInput.trim() || isProcessing) return;

    setIsProcessing(true);
    try {
      await addSkillsToTask(selectedTaskId, [skillInput.trim()]);
      setSkillInput("");
      await loadTasks();

      toast({
        title: "Skill added",
        description: `"${skillInput.trim()}" has been added to the task.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveSkill = async (taskId: string, skill: string) => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await removeSkillFromTask(taskId, skill);
      await loadTasks();

      toast({
        title: "Skill removed",
        description: `"${skill}" has been removed from the task.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('Error removing skill:', error);
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isWeekday(date)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
        <AlertTriangle className="mb-4 h-10 w-10 text-muted-foreground/40" />
        <h3 className="mb-2 text-lg font-semibold text-foreground">Weekend Day</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Tasks are not tracked on weekends.
          <br />
          <small className="mt-1 block">Enable Saturday as a work day in Weekly settings.</small>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <TaskInput date={date} onTaskAdded={handleTaskAdded} />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-foreground">
          {formatDate(date, "EEEE, MMMM d")}
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={loadTasks}
            disabled={loading || isProcessing}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-primary">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
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
            <div
              key={task.id}
              className="group flex items-start justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:shadow-md hover:translate-x-0.5"
            >
              <div className="flex flex-1 gap-3">
                <span className="mt-1.5 h-2.5 w-2.5 flex-shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{task.content}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDate(new Date(task.createdAt), "h:mm a")}
                  </p>
                  {task.skills && task.skills.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {task.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action buttons — visible on hover */}
              <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-primary"
                      onClick={() => setSelectedTaskId(task.id)}
                      disabled={isProcessing}
                    >
                      <Sparkles className="h-4 w-4" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Skills</DialogTitle>
                      <DialogDescription>
                        Add skills you applied or learned while performing this task.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddSkill} className="mt-4 flex items-center gap-2">
                      <Input
                        placeholder="Enter a skill (e.g., React, Time Management)"
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="flex-1"
                        disabled={isProcessing}
                      />
                      <Button type="submit" disabled={!skillInput.trim() || isProcessing}>
                        {isProcessing ? "Adding..." : "Add"}
                      </Button>
                    </form>
                    <div className="mt-4">
                      <h4 className="mb-2 text-sm font-medium">Task Skills:</h4>
                      {task.skills && task.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {task.skills.map((skill) => (
                            <span
                              key={skill}
                              className="flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary"
                            >
                              {skill}
                              <button
                                type="button"
                                onClick={() => handleRemoveSkill(task.id, skill)}
                                className="ml-1 text-muted-foreground hover:text-destructive"
                                disabled={isProcessing}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No skills added yet.</p>
                      )}
                    </div>
                    <DialogClose asChild>
                      <Button type="button" variant="outline" className="mt-4">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-destructive"
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyTaskList;
