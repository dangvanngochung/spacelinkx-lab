"use client";

import { Check, Folder, FolderPlus, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Thread } from "@/types/chat";

type SidebarProps = {
  threads: Thread[];
  folders: string[];
  activeFolder: string;
  setActiveFolder: (folder: string) => void;
  activeId: string;
  setActiveId: (id: string) => void;
  createThread: () => void;
  deleteThread: (id: string) => void;
  renameThread: (id: string, title: string) => void;
  moveThreadFolder: (id: string, folder: string) => void;
  createFolder: (name: string) => void;
  deleteFolder: (name: string) => void;
};

export default function Sidebar({
  threads,
  folders,
  activeFolder,
  setActiveFolder,
  activeId,
  setActiveId,
  createThread,
  deleteThread,
  renameThread,
  moveThreadFolder,
  createFolder: createFolderProp,
  deleteFolder,
}: SidebarProps) {
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draftTitle, setDraftTitle] = useState("");
  const [newFolder, setNewFolder] = useState("");

  function createFolder() {
    const name = newFolder.trim().toLowerCase();
    if (!name) return;
    createFolderProp(name);
    setActiveFolder(name);
    setNewFolder("");
  }

  const keyword = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      const folderMatched = activeFolder === "all" || (t.folder ?? "general") === activeFolder;
      if (!folderMatched) return false;
      if (!keyword) return true;
      const inTitle = t.title.toLowerCase().includes(keyword);
      const inMessages = t.messages.some((m) => m.content.toLowerCase().includes(keyword));
      return inTitle || inMessages;
    });
  }, [threads, activeFolder, keyword]);

  return (
    <aside className="w-[290px] bg-zinc-950 text-zinc-100 border-r border-zinc-800 h-screen flex flex-col">
      <div className="px-5 pt-5 pb-4">
        <div className="text-xs tracking-[0.35em] text-zinc-400">SPACE LINK X</div>
        <div className="text-2xl font-semibold mt-1">Lab</div>
      </div>

      <div className="px-4 pb-3">
        <button onClick={createThread} className="w-full flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 transition rounded-xl px-4 py-3">
          <Plus size={18} />
          New chat
        </button>
      </div>

      <div className="px-4 pb-3 space-y-2">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setActiveFolder("all")} className={`text-xs px-2.5 py-1.5 rounded-lg border ${activeFolder === "all" ? "bg-zinc-700 border-zinc-600" : "border-zinc-700 text-zinc-400"}`}>All</button>
          {folders.map((f) => (
            <button key={f} onClick={() => setActiveFolder(f)} className={`text-xs px-2.5 py-1.5 rounded-lg border inline-flex items-center gap-1 ${activeFolder === f ? "bg-zinc-700 border-zinc-600" : "border-zinc-700 text-zinc-400"}`}>
              <Folder size={12} /> {f}
              {f !== "general" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFolder(f);
                  }}
                  className="ml-1 text-zinc-400 hover:text-white"
                  role="button"
                >
                  <X size={11} />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <input
            value={newFolder}
            onChange={(e) => setNewFolder(e.target.value)}
            placeholder="new folder"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1 text-xs outline-none"
          />
          <button onClick={createFolder} className="text-zinc-300 hover:text-white"><FolderPlus size={15} /></button>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-zinc-900 rounded-xl px-3 py-2 flex items-center gap-2 border border-zinc-800">
          <Search size={16} />
          <input placeholder="Search chats" value={search} onChange={(e) => setSearch(e.target.value)} className="bg-transparent outline-none w-full text-sm" />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-3 pb-4">
        <div className="space-y-1">
          {filtered.map((t) => (
            <div key={t.id} className={`group rounded-xl px-3 py-3 flex items-center gap-2 cursor-pointer transition ${activeId === t.id ? "bg-zinc-800" : "hover:bg-zinc-900"}`}>
              {editingId === t.id ? (
                <div className="flex-1 space-y-2">
                  <input autoFocus value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} className="w-full bg-zinc-900 text-sm rounded px-2 py-1 outline-none" />
                  <select
                    value={t.folder ?? "general"}
                    onChange={(e) => moveThreadFolder(t.id, e.target.value)}
                    className="w-full bg-zinc-900 text-xs rounded px-2 py-1 outline-none border border-zinc-700"
                  >
                    {folders.map((f) => (
                      <option key={f}>{f}</option>
                    ))}
                    {newFolder.trim() && <option>{newFolder.trim().toLowerCase()}</option>}
                  </select>
                </div>
              ) : (
                <button onClick={() => setActiveId(t.id)} className="flex-1 text-left truncate text-sm">
                  {t.title}
                </button>
              )}

              {editingId === t.id ? (
                <>
                  <button onClick={() => { renameThread(t.id, draftTitle); setEditingId(""); }} className="text-zinc-300 hover:text-white"><Check size={14} /></button>
                  <button onClick={() => setEditingId("")} className="text-zinc-500 hover:text-zinc-200"><X size={14} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => { setEditingId(t.id); setDraftTitle(t.title); }} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition text-zinc-400 hover:text-white"><Pencil size={14} /></button>
                  <button onClick={() => deleteThread(t.id)} className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition text-zinc-400 hover:text-white"><Trash2 size={15} /></button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">Private AI Workspace</div>
    </aside>
  );
}
