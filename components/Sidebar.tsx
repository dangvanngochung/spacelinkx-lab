"use client";

import { Trash2 } from "lucide-react";

export default function Sidebar({
  threads,
  activeId,
  setActiveId,
  createThread,
  deleteThread,
}: any) {
  return (
    <aside className="w-72 border-r h-screen overflow-auto p-3">
      <button
        onClick={createThread}
        className="w-full rounded-xl p-3 mb-3 border hover:opacity-80"
      >
        + New Chat
      </button>

      <div className="space-y-2">
        {threads.map((t: any) => (
          <div
            key={t.id}
            className={`group rounded-xl p-3 flex items-center justify-between ${
              activeId === t.id
                ? "bg-white/10"
                : "hover:bg-white/5"
            }`}
          >
            <button
              onClick={() => setActiveId(t.id)}
              className="text-left flex-1 truncate"
            >
              {t.title}
            </button>

            <button
              onClick={() => deleteThread(t.id)}
              className="opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}