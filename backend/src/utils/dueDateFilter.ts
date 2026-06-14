import type { Prisma } from "@prisma/client";

function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getCalendarWeekRange(weekOffset: number): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;

  const start = startOfDay(now);
  start.setDate(start.getDate() + diffToMonday + weekOffset * 7);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return { start, end };
}

export function applyDueDateFilter(
  filters: Prisma.TaskWhereInput,
  dueDate: string,
): void {
  if (dueDate === "today") {
    const start = startOfDay(new Date());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    filters.dueDate = { gte: start, lt: end };
    return;
  }

  if (dueDate === "lastWeek") {
    const { start, end } = getCalendarWeekRange(-1);
    filters.dueDate = { gte: start, lt: end };
    return;
  }

  if (dueDate === "thisWeek") {
    const { start, end } = getCalendarWeekRange(0);
    filters.dueDate = { gte: start, lt: end };
    return;
  }

  if (dueDate === "nextWeek") {
    const { start, end } = getCalendarWeekRange(1);
    filters.dueDate = { gte: start, lt: end };
  }
}
