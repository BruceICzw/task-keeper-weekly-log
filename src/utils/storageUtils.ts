
import { getDayIdentifier, getWeekIdentifier, WeekData } from './dateUtils';

export interface Task {
  id: string;
  content: string;
  date: string; // ISO string
  createdAt: string; // ISO string
}

export interface WeeklyLog {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  tasks: Task[];
  compiledAt: string; // ISO string
}

// Local storage keys
const TASKS_STORAGE_KEY = 'task-keeper-tasks';
const WEEKLY_LOGS_STORAGE_KEY = 'task-keeper-weekly-logs';

// Get all tasks
export const getAllTasks = (): Task[] => {
  const tasksJson = localStorage.getItem(TASKS_STORAGE_KEY);
  return tasksJson ? JSON.parse(tasksJson) : [];
};

// Get tasks for a specific day
export const getTasksForDay = (date: Date): Task[] => {
  const allTasks = getAllTasks();
  const dayId = getDayIdentifier(date);
  return allTasks.filter(task => task.date.startsWith(dayId));
};

// Get tasks for the current week
export const getTasksForWeek = (weekData: WeekData): Task[] => {
  const allTasks = getAllTasks();
  const weekStart = new Date(weekData.startDate);
  const weekEnd = new Date(weekData.endDate);
  
  return allTasks.filter(task => {
    const taskDate = new Date(task.date);
    return (
      taskDate >= weekStart && 
      taskDate <= weekEnd && 
      ![0, 6].includes(taskDate.getDay()) // Filter out weekends (0 = Sunday, 6 = Saturday)
    );
  });
};

// Add a new task
export const addTask = (content: string, date: Date): Task => {
  const newTask: Task = {
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    content,
    date: date.toISOString(),
    createdAt: new Date().toISOString()
  };

  const tasks = getAllTasks();
  tasks.push(newTask);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  
  return newTask;
};

// Delete a task
export const deleteTask = (taskId: string): void => {
  const tasks = getAllTasks();
  const updatedTasks = tasks.filter(task => task.id !== taskId);
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

// Get all weekly logs
export const getAllWeeklyLogs = (): WeeklyLog[] => {
  const logsJson = localStorage.getItem(WEEKLY_LOGS_STORAGE_KEY);
  return logsJson ? JSON.parse(logsJson) : [];
};

// Get a specific weekly log
export const getWeeklyLog = (weekData: WeekData): WeeklyLog | null => {
  const logs = getAllWeeklyLogs();
  const weekId = getWeekIdentifier(weekData);
  return logs.find(log => log.id === weekId) || null;
};

// Create a new weekly log
export const createWeeklyLog = (weekData: WeekData, tasks: Task[]): WeeklyLog => {
  const weekId = getWeekIdentifier(weekData);
  
  const newLog: WeeklyLog = {
    id: weekId,
    weekNumber: weekData.weekNumber,
    year: weekData.year,
    startDate: weekData.startDate.toISOString(),
    endDate: weekData.endDate.toISOString(),
    tasks: tasks,
    compiledAt: new Date().toISOString()
  };

  const logs = getAllWeeklyLogs();
  
  // Check if log already exists
  const existingLogIndex = logs.findIndex(log => log.id === weekId);
  
  if (existingLogIndex >= 0) {
    // Update existing log
    logs[existingLogIndex] = newLog;
  } else {
    // Add new log
    logs.push(newLog);
  }
  
  localStorage.setItem(WEEKLY_LOGS_STORAGE_KEY, JSON.stringify(logs));
  
  return newLog;
};

// Delete a weekly log
export const deleteWeeklyLog = (logId: string): void => {
  const logs = getAllWeeklyLogs();
  const updatedLogs = logs.filter(log => log.id !== logId);
  localStorage.setItem(WEEKLY_LOGS_STORAGE_KEY, JSON.stringify(updatedLogs));
};

// Clear all data (for testing/reset purposes)
export const clearAllData = (): void => {
  localStorage.removeItem(TASKS_STORAGE_KEY);
  localStorage.removeItem(WEEKLY_LOGS_STORAGE_KEY);
};
