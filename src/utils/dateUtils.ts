
import { format, startOfWeek, endOfWeek, isWeekend, isFriday, eachDayOfInterval, isAfter, isBefore, startOfDay, endOfDay, isSameDay } from "date-fns";
import { v4 as uuidv4 } from 'uuid';

export type WeekData = {
  startDate: Date;
  endDate: Date;
  weekNumber: number;
  year: number;
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
  let start = startOfWeek(today, { weekStartsOn: 1 }); // Week starts on Monday
  let end = endOfWeek(today, { weekStartsOn: 1 }); // Week ends on Sunday
  
  const weekNumber = getWeekNumber(today);
  const year = today.getFullYear();
  
  return {
    startDate: start,
    endDate: end,
    weekNumber,
    year
  };
};

export const getWeekForDate = (date: Date): WeekData => {
  let start = startOfWeek(date, { weekStartsOn: 1 }); // Week starts on Monday
  let end = endOfWeek(date, { weekStartsOn: 1 }); // Week ends on Sunday
  
  const weekNumber = getWeekNumber(date);
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
  return allDays.filter(day => !isWeekend(day));
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
  const weekKey = `week-${weekData.year}-${weekData.weekNumber}`;
  
  return uuidv4();
};

export const getWeekStringIdentifier = (weekData: WeekData): string => {
  return `week-${weekData.year}-${weekData.weekNumber}`;
};

export const getDayIdentifier = (date: Date): string => {
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
  return !isWeekend(date);
};
