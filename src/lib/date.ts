import { format, startOfDay, endOfDay } from "date-fns";

export function formatKoDate(date: Date): string {
  return format(date, "yyyy.MM.dd");
}

export function toDateRange(date: Date): { start: Date; end: Date } {
  return { start: startOfDay(date), end: endOfDay(date) };
}

export function parseDateInput(value: string): Date {
  return new Date(`${value}T00:00:00`);
}
