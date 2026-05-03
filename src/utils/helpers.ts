import { format } from "date-fns";
import { Task } from "../types";

/**
 * Format a date string to a readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    return format(new Date(dateString), "MMM dd, yyyy HH:mm");
  } catch (error) {
    return dateString;
  }
};

/**
 * Format recording duration in MM:SS format
 */
export const formatDuration = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Group tasks by category
 */
export const groupTasksByCategory = (tasks: Task[]) => {
  return tasks.reduce(
    (acc, task) => {
      const category = task.category || "uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(task);
      return acc;
    },
    {} as Record<string, Task[]>,
  );
};

/**
 * Sort tasks by priority (high -> medium -> low)
 */
export const sortTasksByPriority = (tasks: Task[]): Task[] => {
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return [...tasks].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
};

/**
 * Filter incomplete tasks
 */
export const getIncompleteTasks = (tasks: Task[]): Task[] => {
  return tasks.filter((task) => !task.isCompleted);
};

/**
 * Get the most recent tasks
 */
export const getRecentTasks = (tasks: Task[], count: number = 3): Task[] => {
  return [...tasks]
    .sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, count);
};
