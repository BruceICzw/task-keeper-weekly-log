
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
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskContent.trim()) {
      addTask(taskContent, date);
      setTaskContent("");
      onTaskAdded();
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
        duration: 3000,
      });
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
        />
        <Button 
          type="submit" 
          size="sm" 
          className="px-3 transition-all duration-300 hover:scale-105"
          disabled={!taskContent.trim()}
        >
          <PlusIcon className="h-4 w-4" />
          <span className="ml-1 hidden sm:inline">Add</span>
        </Button>
      </div>
    </form>
  );
};

export default TaskInput;
