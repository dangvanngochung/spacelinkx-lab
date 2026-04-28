"use client";

import { Thread } from "@/types/chat";

export default function Sidebar({
  threads,
  activeId,
  setActiveId,
  createThread,
}: any) {
  return (
    <aside className="w-72 border-r h-screen overflow-auto p-3">
      <button
        onClick={createThread}
        className="w-full border rounded p-3 mb-3"
      >
        + New Chat
      </button>

      {threads.map((t: Thread) => (
        <button
          key={t.id}
          onClick={() => setActiveId(t.id)}
          className={`w-full text-left p-3 rounded mb-2 ${
            activeId === t.id
              ? "bg-zinc-200 dark:bg-zinc-700"
              : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
          }`}
        >
          {t.title}
        </button>
      ))}
    </aside>
  );
}