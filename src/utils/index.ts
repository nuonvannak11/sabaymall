import { WithId } from "@/types";

export function getThemeFromCookie() {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
  return match ? match[1] : "light";
}

export function getNextId<T extends WithId>(data: T[] = []) {
  return data.length ? Math.max(...data.map(p => p.id)) + 1 : 1;
}