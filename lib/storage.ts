import { Thread } from "@/types/chat";

const THREADS_KEY = "slx_threads_v1";
const FOLDERS_KEY = "slx_folders_v1";

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(THREADS_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveThreads(data: Thread[]) {
  localStorage.setItem(THREADS_KEY, JSON.stringify(data));
}

export function loadFolders(): string[] {
  if (typeof window === "undefined") return ["general"];
  const raw = localStorage.getItem(FOLDERS_KEY);
  const parsed = raw ? (JSON.parse(raw) as string[]) : [];
  const normalized = parsed.map((x) => x.trim().toLowerCase()).filter(Boolean);
  return Array.from(new Set(["general", ...normalized]));
}

export function saveFolders(data: string[]) {
  const normalized = Array.from(new Set(data.map((x) => x.trim().toLowerCase()).filter(Boolean)));
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(normalized));
}
