import { TODO_PLACEHOLDER } from "@/data/profile";

export function isTodo(val?: string | null): boolean {
  if (!val) return true;
  return val.trim() === TODO_PLACEHOLDER || val.trim().toLowerCase() === "todo: add this";
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Returns true if the field is still a TODO and we are running in production.
 * In this case, the calling component should hide the section or element gracefully.
 */
export function shouldHideInProd(val?: string | null): boolean {
  return isProduction() && isTodo(val);
}

/**
 * Returns a display-safe string.
 * If in development and the value is a TODO, it returns the fallback or placeholder text.
 * If in production and the value is a TODO, returns empty string.
 */
export function getSafeText(val?: string | null, fallbackText?: string): string {
  if (!isTodo(val)) return val || "";
  if (isProduction()) return "";
  return fallbackText || val || "[Pending details]";
}
