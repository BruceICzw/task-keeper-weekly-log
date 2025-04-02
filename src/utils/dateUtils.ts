
import { format, startOfWeek, endOfWeek, isWeekend, isFriday, eachDayOfInterval, isAfter, isBefore, startOfDay, endOfDay, isSameDay, addWeeks, differenceInWeeks, isSaturday } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

export type WeekData = {
  startDate: Date;
  endDate: Date;
  weekNumber: number;
  year: number;
};

// Store internship start date in localStorage
export const setInternshipStartDate = (date: Date): void => {
  localStorage.setItem('internship-start-date', date.toISOString());
};

// Get internship start date from localStorage
export const getInternshipStartDate = (): Date | null => {
  const dateStr = localStorage.getItem('internship-start-date');
  return dateStr ? new Date(dateStr) : null;
};

// Set whether Saturday is a work day
export const setSaturdayWorkDay = (isWorkDay: boolean): void => {
  localStorage.setItem('saturday-work-day', String(isWorkDay));
};

// Get whether Saturday is a work day
export const isSaturdayWorkDay = (): boolean => {
  return localStorage.getItem('saturday-work-day') === 'true';
};

export const getCurrentDate = (): Date => {
  return new Date();
};

export const formatDate = (date: Date, formatStr: string = "MMM dd, yyyy"): string => {
  return format(date, formatStr);
};

export const formatWeekRange = (startDate: Date, endDate: Date): string => {
  const startMonth = format(startDate, "MMM");
  const endMonth = format(endDate, "MMM");
  
  if (startMonth === endMonth) {
    return `${startMonth} ${format(startDate, "d")}-${format(endDate, "d")}, ${format(endDate, "yyyy")}`;
  } else {
    return `${format(startDate, "MMM d")} - ${format(endDate, "MMM d")}, ${format(endDate, "yyyy")}`;
  }
};

export const getCurrentWeek = (): WeekData => {
  const today = new Date();
  return getWeekForDate(today);
};

export const getWeekForDate = (date: Date): WeekData => {
  let start = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
  let end = endOfWeek(date, { weekStartsOn: 1 }); // Week ends on Sunday
  
  // Calculate week number based on internship start date if available
  const internshipStart = getInternshipStartDate();
  let weekNumber = getWeekNumber(date);
  
  if (internshipStart) {
    const internshipStartWeek = startOfWeek(internshipStart, { weekStartsOn: 1 });
    // Add 1 because we want to start with Week 1
    weekNumber = Math.max(1, differenceInWeeks(start, internshipStartWeek) + 1);
  }
  
  const year = date.getFullYear();
  
  return {
    startDate: start,
    endDate: end,
    weekNumber,
    year
  };
};

export const getWeekDaysOnly = (startDate: Date, endDate: Date): Date[] => {
  const allDays = eachDayOfInterval({ start: startDate, end: endDate });
  const includeSaturday = isSaturdayWorkDay();
  
  return allDays.filter(day => {
    // Include Monday to Friday always
    if (![0, 6].includes(day.getDay())) return true;
    
    // Include Saturday if configured
    if (includeSaturday && isSaturday(day)) return true;
    
    return false;
  });
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

export const isTodayFriday = (): boolean => {
  return isFriday(new Date());
};

export const getWeekIdentifier = (weekData: WeekData): string => {
  return uuidv4();
};

export const getWeekStringIdentifier = (weekData: WeekData): string => {
  return `week-${weekData.year}-${weekData.weekNumber}`;
};

export const getDayIdentifier = (date: Date): string => {
  // Fix: Make sure we get consistent formatting of the date
  // by using the date-fns format with zero-padding for month and day
  return format(date, "yyyy-MM-dd");
};

export const areDatesInSameDay = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

export const getDateFromDayIdentifier = (dayId: string): Date => {
  const [year, month, day] = dayId.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isDateInWeek = (date: Date, weekData: WeekData): boolean => {
  return (
    isAfter(startOfDay(date), startOfDay(new Date(weekData.startDate))) ||
    isSameDay(date, weekData.startDate)
  ) && (
    isBefore(endOfDay(date), endOfDay(new Date(weekData.endDate))) ||
    isSameDay(date, weekData.endDate)
  );
};

export const isWeekday = (date: Date): boolean => {
  // Check if the date is a weekday (not Saturday or Sunday)
  // If Saturday is a work day, consider it as a weekday too
  if (isSaturdayWorkDay() && isSaturday(date)) {
    return true;
  }
  return !isWeekend(date) || (isSaturdayWorkDay() && isSaturday(date));
};

// Calculate previous week
export const getPreviousWeek = (currentWeek: WeekData): WeekData => {
  const previousWeekDate = new Date(currentWeek.startDate);
  previousWeekDate.setDate(previousWeekDate.getDate() - 7);
  return getWeekForDate(previousWeekDate);
};

// Calculate next week
export const getNextWeek = (currentWeek: WeekData): WeekData => {
  const nextWeekDate = new Date(currentWeek.startDate);
  nextWeekDate.setDate(nextWeekDate.getDate() + 7);
  return getWeekForDate(nextWeekDate);
};

// Get a specific week by week number (relative to internship start)
export const getWeekByNumber = (weekNumber: number): WeekData | null => {
  const internshipStart = getInternshipStartDate();
  if (!internshipStart) return null;
  
  const startWeek = startOfWeek(internshipStart, { weekStartsOn: 1 });
  const targetWeekStart = addWeeks(startWeek, weekNumber - 1);
  
  return getWeekForDate(targetWeekStart);
};
