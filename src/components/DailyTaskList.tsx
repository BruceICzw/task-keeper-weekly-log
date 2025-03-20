
import { useState, useEffect } from "react";
import { formatDate, isWeekday } from "@/utils/dateUtils";
import { getTasksForDay, Task, deleteTask, addSkillsToTask, removeSkillFromTask } from "@/utils/storageUtils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangleIcon, TrashIcon, PlusCircleIcon, XIcon, WandSparklesIcon, RefreshCwIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
      <div className="flex flex-col items-center justify-center py-8 text-center animate-fade-in">
        <AlertTriangleIcon className="h-12 w-12 text-muted-foreground mb-4 opacity-40" />
        <h3 className="text-xl font-light mb-2">Weekend Day</h3>
        <p className="text-muted-foreground max-w-md">
          This is a weekend day. Tasks are not tracked on weekends.
          <br />
          <small className="block mt-2">Note: You can enable Saturday as a work day in settings.</small>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-in">
      <div className="mb-6">
        <TaskInput date={date} onTaskAdded={handleTaskAdded} />
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {formatDate(date, "EEEE, MMMM d")}
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadTasks} 
            disabled={loading || isProcessing}
            className="flex items-center space-x-1"
          >
            <RefreshCwIcon className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs">Refresh</span>
          </Button>
          <div className="text-sm text-muted-foreground">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </div>
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
                <div className="flex flex-col p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p>{task.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(new Date(task.createdAt), "h:mm a")}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-muted-foreground hover:text-primary"
                            onClick={() => setSelectedTaskId(task.id)}
                            disabled={isProcessing}
                          >
                            <WandSparklesIcon className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Add Skills</DialogTitle>
                            <DialogDescription>
                              Add skills you applied or learned while performing this task.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <form onSubmit={handleAddSkill} className="flex items-center space-x-2 mt-4">
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
                            <h4 className="text-sm font-medium mb-2">Task Skills:</h4>
                            {task.skills && task.skills.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {task.skills.map((skill) => (
                                  <Badge key={skill} variant="outline" className="flex items-center gap-1 px-3 py-1">
                                    {skill}
                                    <button 
                                      type="button"
                                      onClick={() => handleRemoveSkill(task.id, skill)}
                                      className="text-muted-foreground hover:text-destructive ml-1"
                                      disabled={isProcessing}
                                    >
                                      <XIcon className="h-3 w-3" />
                                    </button>
                                  </Badge>
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
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteTask(task.id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {task.skills && task.skills.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1">
                        {task.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
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
