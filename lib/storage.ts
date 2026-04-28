import { Thread } from "@/types/chat";

const KEY = "slx_threads_v1";

export function loadThreads(): Thread[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveThreads(data: Thread[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}