import clsx from "clsx"
import { twMerge } from "tailwind-merge"

export const cname =(...inputs) => {
  return twMerge(clsx(...inputs))
}