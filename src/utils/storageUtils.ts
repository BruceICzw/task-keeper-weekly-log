
import { getDayIdentifier, getWeekIdentifier, WeekData } from './dateUtils';
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  content: string;
  date: string; // ISO string
  createdAt: string; // ISO string
  skills: string[]; // Array of skills for the task
  user_id?: string; // For Supabase
}

export interface WeeklyLog {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string; // ISO string
  endDate: string; // ISO string
  tasks: Task[];
  compiledAt: string; // ISO string
  user_id?: string; // For Supabase
}

// Get all tasks
export const getAllTasks = async (): Promise<Task[]> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const tasksJson = localStorage.getItem('task-keeper-tasks');
    return tasksJson ? JSON.parse(tasksJson) : [];
  }
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*');
  
  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
  
  return data.map(task => ({
    id: task.id,
    content: task.content,
    date: task.date,
    createdAt: task.created_at,
    skills: task.skills || []
  }));
};

// Get tasks for a specific day
export const getTasksForDay = async (date: Date): Promise<Task[]> => {
  const allTasks = await getAllTasks();
  const dayId = getDayIdentifier(date);
  return allTasks.filter(task => task.date.startsWith(dayId));
};

// Get tasks for the current week
export const getTasksForWeek = async (weekData: WeekData): Promise<Task[]> => {
  const allTasks = await getAllTasks();
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
export const addTask = async (content: string, date: Date): Promise<Task> => {
  const { data: session } = await supabase.auth.getSession();
  
  const newTask: Task = {
    id: uuidv4(),
    content,
    date: date.toISOString(),
    createdAt: new Date().toISOString(),
    skills: []
  };
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const tasks = await getAllTasks();
    tasks.push(newTask);
    localStorage.setItem('task-keeper-tasks', JSON.stringify(tasks));
    return newTask;
  }
  
  // Add task to Supabase
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      id: newTask.id,
      content: newTask.content,
      date: newTask.date,
      skills: newTask.skills,
      user_id: session.session.user.id
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error adding task:', error);
    throw error;
  }
  
  return {
    id: data.id,
    content: data.content,
    date: data.date,
    createdAt: data.created_at,
    skills: data.skills || []
  };
};

// Delete a task
export const deleteTask = async (taskId: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const tasks = await getAllTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    localStorage.setItem('task-keeper-tasks', JSON.stringify(updatedTasks));
    return;
  }
  
  // Delete from Supabase
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);
  
  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

// Add skills to a task
export const addSkillsToTask = async (taskId: string, skills: string[]): Promise<Task | null> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const tasks = await getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex].skills = Array.from(new Set([...tasks[taskIndex].skills, ...skills]));
    localStorage.setItem('task-keeper-tasks', JSON.stringify(tasks));
    
    return tasks[taskIndex];
  }
  
  // First, get the current task to get its existing skills
  const { data: existingTask, error: fetchError } = await supabase
    .from('tasks')
    .select('skills')
    .eq('id', taskId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching task for skills update:', fetchError);
    return null;
  }
  
  // Combine existing skills with new ones, ensuring no duplicates
  const updatedSkills = Array.from(new Set([...(existingTask.skills || []), ...skills]));
  
  // Update the task with the new skills
  const { data, error } = await supabase
    .from('tasks')
    .update({ skills: updatedSkills })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating task skills:', error);
    return null;
  }
  
  return {
    id: data.id,
    content: data.content,
    date: data.date,
    createdAt: data.created_at,
    skills: data.skills || []
  };
};

// Remove a skill from a task
export const removeSkillFromTask = async (taskId: string, skill: string): Promise<Task | null> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const tasks = await getAllTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) return null;
    
    tasks[taskIndex].skills = tasks[taskIndex].skills.filter(s => s !== skill);
    localStorage.setItem('task-keeper-tasks', JSON.stringify(tasks));
    
    return tasks[taskIndex];
  }
  
  // First, get the current task to get its existing skills
  const { data: existingTask, error: fetchError } = await supabase
    .from('tasks')
    .select('skills')
    .eq('id', taskId)
    .single();
  
  if (fetchError) {
    console.error('Error fetching task for skill removal:', fetchError);
    return null;
  }
  
  // Filter out the skill to remove
  const updatedSkills = (existingTask.skills || []).filter(s => s !== skill);
  
  // Update the task with the filtered skills
  const { data, error } = await supabase
    .from('tasks')
    .update({ skills: updatedSkills })
    .eq('id', taskId)
    .select()
    .single();
  
  if (error) {
    console.error('Error removing task skill:', error);
    return null;
  }
  
  return {
    id: data.id,
    content: data.content,
    date: data.date,
    createdAt: data.created_at,
    skills: data.skills || []
  };
};

// Get all weekly logs
export const getAllWeeklyLogs = async (): Promise<WeeklyLog[]> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const logsJson = localStorage.getItem('task-keeper-weekly-logs');
    return logsJson ? JSON.parse(logsJson) : [];
  }
  
  const { data, error } = await supabase
    .from('weekly_logs')
    .select('*');
  
  if (error) {
    console.error('Error fetching weekly logs:', error);
    return [];
  }
  
  return data.map(log => ({
    id: log.id,
    weekNumber: log.week_number,
    year: log.year,
    startDate: log.start_date,
    endDate: log.end_date,
    tasks: log.tasks || [],
    compiledAt: log.compiled_at
  }));
};

// Get a specific weekly log
export const getWeeklyLog = async (weekData: WeekData): Promise<WeeklyLog | null> => {
  const logs = await getAllWeeklyLogs();
  const weekId = getWeekIdentifier(weekData);
  return logs.find(log => log.id === weekId) || null;
};

// Create a new weekly log
export const createWeeklyLog = async (weekData: WeekData, tasks: Task[]): Promise<WeeklyLog> => {
  const { data: session } = await supabase.auth.getSession();
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
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const logs = await getAllWeeklyLogs();
    
    // Check if log already exists
    const existingLogIndex = logs.findIndex(log => log.id === weekId);
    
    if (existingLogIndex >= 0) {
      // Update existing log
      logs[existingLogIndex] = newLog;
    } else {
      // Add new log
      logs.push(newLog);
    }
    
    localStorage.setItem('task-keeper-weekly-logs', JSON.stringify(logs));
    
    return newLog;
  }
  
  // Check if log already exists in Supabase
  const { data: existingLog } = await supabase
    .from('weekly_logs')
    .select('id')
    .eq('id', weekId)
    .maybeSingle();
  
  if (existingLog) {
    // Update existing log
    const { data, error } = await supabase
      .from('weekly_logs')
      .update({
        week_number: newLog.weekNumber,
        year: newLog.year,
        start_date: newLog.startDate,
        end_date: newLog.endDate,
        tasks: newLog.tasks,
        compiled_at: newLog.compiledAt
      })
      .eq('id', weekId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating weekly log:', error);
      throw error;
    }
    
    return {
      id: data.id,
      weekNumber: data.week_number,
      year: data.year,
      startDate: data.start_date,
      endDate: data.end_date,
      tasks: data.tasks,
      compiledAt: data.compiled_at
    };
  } else {
    // Create new log
    const { data, error } = await supabase
      .from('weekly_logs')
      .insert({
        id: newLog.id,
        week_number: newLog.weekNumber,
        year: newLog.year,
        start_date: newLog.startDate,
        end_date: newLog.endDate,
        tasks: newLog.tasks,
        compiled_at: newLog.compiledAt,
        user_id: session.session.user.id
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating weekly log:', error);
      throw error;
    }
    
    return {
      id: data.id,
      weekNumber: data.week_number,
      year: data.year,
      startDate: data.start_date,
      endDate: data.end_date,
      tasks: data.tasks,
      compiledAt: data.compiled_at
    };
  }
};

// Delete a weekly log
export const deleteWeeklyLog = async (logId: string): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  
  if (!session.session) {
    // Fallback to localStorage if no authenticated user
    const logs = await getAllWeeklyLogs();
    const updatedLogs = logs.filter(log => log.id !== logId);
    localStorage.setItem('task-keeper-weekly-logs', JSON.stringify(updatedLogs));
    return;
  }
  
  // Delete from Supabase
  const { error } = await supabase
    .from('weekly_logs')
    .delete()
    .eq('id', logId);
  
  if (error) {
    console.error('Error deleting weekly log:', error);
    throw error;
  }
};

// Save cover page data
export const saveCoverPageData = (coverData: any): void => {
  localStorage.setItem('task-keeper-cover-page', JSON.stringify(coverData));
};

// Get cover page data
export const getCoverPageData = (): any => {
  const dataJson = localStorage.getItem('task-keeper-cover-page');
  return dataJson ? JSON.parse(dataJson) : null;
};

// Clear all data (for testing/reset purposes)
export const clearAllData = async (): Promise<void> => {
  localStorage.removeItem('task-keeper-tasks');
  localStorage.removeItem('task-keeper-weekly-logs');
  localStorage.removeItem('task-keeper-cover-page');
  
  const { data: session } = await supabase.auth.getSession();
  
  if (session.session) {
    // Clear Supabase data for the current user
    await supabase.from('tasks').delete().neq('id', '0'); // Delete all tasks
    await supabase.from('weekly_logs').delete().neq('id', '0'); // Delete all logs
  }
};
