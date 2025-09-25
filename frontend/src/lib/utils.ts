import { clsx, ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {GridLayoutProps} from "@/types";

/*
 * Combines conditional class names from 'clsx' or 'classnames'
 * with 'tailwind-merge' to avoid TailwindCSS style conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Return current Year
 */
export const FullYear = () => new Date().getFullYear();

/*
 * Formats date in German styles
 */
export function dateFormater(date: string) {
  const formatedDate = new Date(date);
  return new Intl.DateTimeFormat("de-DE", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(formatedDate)
}


/*
 * Helper function to create grid-cols/layout base on cols
 */
const colClassesMap: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
  7: "grid-cols-7",
  8: "grid-cols-8",
  9: "grid-cols-9",
  10: "grid-cols-10",
  11: "grid-cols-11",
  12: "grid-cols-12",
};
export const buildGridCols = (gridCols?: GridLayoutProps["gridCols"]) => {
  if (!gridCols) return "grid-cols-1"

  return Object.entries(gridCols)
      .map(([breakpoint, cols]) => {
        const colClass = colClassesMap[cols ?? 1] || "grid-cols-1";
        return breakpoint === "base" ? colClass : `${breakpoint}:${colClass}`
      })
      .join(" ")
};
