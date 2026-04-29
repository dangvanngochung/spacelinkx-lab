"use client";

import { Check, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useState } from "react";
import type { Thread } from "@/types/chat";

type SidebarProps = {
  threads: Thread[];
  activeId: string;
  setActiveId: (id: string) => void;
  createThread: () => void;
  deleteThread: (id: string) => void;
};

export default function Sidebar({ threads, activeId, setActiveId, createThread, deleteThread }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draftTitle, setDraftTitle] = useState("");

  const filtered = threads.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <aside className="w-[290px] bg-zinc-950 text-zinc-100 border-r border-zinc-800 h-screen flex flex-col">
      <div className="px-5 pt-5 pb-4">
        <div className="text-xs tracking-[0.35em] text-zinc-400">SPACE LINK X</div>
        <div className="text-2xl font-semibold mt-1">Lab</div>
      </div>

      <div className="px-4 pb-3">
        <button
          onClick={createThread}
          className="w-full flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition rounded-xl px-4 py-3"
        >
          <Plus size={18} />
          New chat
        </button>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-zinc-900 rounded-xl px-3 py-2 flex items-center gap-2 border border-zinc-800">
          <Search size={16} />
          <input
            placeholder="Search chats"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 pb-4">
        <div className="space-y-1">
          {filtered.map((t) => (
            <div
              key={t.id}
              className={`group rounded-xl px-3 py-3 flex items-center gap-2 cursor-pointer transition ${
                activeId === t.id ? "bg-zinc-800" : "hover:bg-zinc-900"
              }`}
            >
              <button onClick={() => setActiveId(t.id)} className="flex-1 text-left truncate text-sm">
                {t.title}
              </button>

              <button
                onClick={() => deleteThread(t.id)}
                className="opacity-0 group-hover:opacity-100 transition text-zinc-400 hover:text-white"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">Private AI Workspace</div>
    </aside>
  );
}
