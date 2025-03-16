
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { addTask } from "@/utils/storageUtils";
import { useToast } from "@/hooks/use-toast";

interface TaskInputProps {
  date: Date;
  onTaskAdded: () => void;
}

const TaskInput = ({ date, onTaskAdded }: TaskInputProps) => {
  const [taskContent, setTaskContent] = useState<string>("");
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (taskContent.trim() && !isSubmitting) {
      try {
        setIsSubmitting(true);
        await addTask(taskContent, date);
        setTaskContent("");
        onTaskAdded();
        
        toast({
          title: "Task added",
          description: "Your task has been added successfully.",
          duration: 3000,
        });
      } catch (error) {
        console.error("Error adding task:", error);
        toast({
          title: "Error",
          description: "Failed to add task. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt+N shortcut to focus the input
      if (e.altKey && e.key === "n") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`
        w-full p-4 rounded-lg transition-all duration-300 ease-in-out
        ${isInputFocused ? "glass shadow-md scale-[1.01]" : "bg-secondary/50"}
      `}
    >
      <div className="flex items-center space-x-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder="What did you accomplish today? (Alt+N)"
          value={taskContent}
          onChange={(e) => setTaskContent(e.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          className="transition-all duration-300 border-none bg-transparent"
          autoComplete="off"
          disabled={isSubmitting}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="px-3 transition-all duration-300 hover:scale-105"
          disabled={!taskContent.trim() || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <>
              <PlusIcon className="h-4 w-4" />
              <span className="ml-1 hidden sm:inline">Add</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;
