import { WithId } from "@/types";

export function getThemeFromCookie() {
  if (typeof document === "undefined") return "light";
  const match = document.cookie.match(/(?:^|;\s*)theme=([^;]*)/);
  return match ? match[1] : "light";
}


export function getNextId<T extends WithId>(data: T[] = []) {
  return data.length ? Math.max(...data.map((p) => p.id)) + 1 : 1;
}

export function blockExstansion(pathname: string) {
  const BLOCKED_EXTENSIONS = [
    ".exe",
    ".sh",
    ".php",
    ".bat",
    ".cmd",
    ".ssh",
    ".scr",
    ".ps1",
    ".jar",
    ".py",
    ".pl",
    ".rb",
  ];
  return BLOCKED_EXTENSIONS.some((ext) => pathname.toLowerCase().endsWith(ext));
}