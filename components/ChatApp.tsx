"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {
  loadThreads,
  saveThreads,
} from "@/lib/storage";

export default function ChatApp() {
  const [threads, setThreads] =
    useState<any[]>([]);
  const [activeId, setActiveId] =
    useState("");
  const [msg, setMsg] = useState("");
  const [streaming, setStreaming] =
    useState("");
  const [model, setModel] =
    useState("gpt-4.1-mini");

  useEffect(() => {
    const t = loadThreads();

    if (t.length) {
      setThreads(t);
      setActiveId(t[0].id);
    } else {
      createThread();
    }
  }, []);

  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  function createThread() {
    const id = uuid();

    const item = {
      id,
      title: "New chat",
      messages: [],
    };

    setThreads((prev) => [item, ...prev]);
    setActiveId(id);
  }

  function deleteThread(id: string) {
    if (!confirm("Delete chat?"))
      return;

    const next = threads.filter(
      (x) => x.id !== id
    );

    setThreads(next);

    if (next.length) {
      setActiveId(next[0].id);
    } else {
      createThread();
    }
  }

  const active = threads.find(
    (x) => x.id === activeId
  );

  async function send() {
    if (!msg.trim()) return;

    const updated = threads.map((t) =>
      t.id === activeId
        ? {
            ...t,
            title:
              t.messages.length === 0
                ? msg.slice(0, 35)
                : t.title,
            messages: [
              ...t.messages,
              {
                role: "user",
                content: msg,
              },
            ],
          }
        : t
    );

    setThreads(updated);
    setMsg("");
    setStreaming("");

    const thread = updated.find(
      (x) => x.id === activeId
    );

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({
        model,
        messages: thread.messages,
      }),
    });

    const reader =
      res.body?.getReader();

    if (!reader) return;

    const decoder =
      new TextDecoder();

    let final = "";

    while (true) {
      const { done, value } =
        await reader.read();

      if (done) break;

      const chunk =
        decoder.decode(value);

      final += chunk;
      setStreaming(final);
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: [
                ...t.messages,
                {
                  role: "assistant",
                  content: final,
                },
              ],
            }
          : t
      )
    );

    setStreaming("");
  }

  return (
    <main className="h-screen flex bg-white text-zinc-900">
      <Sidebar
        threads={threads}
        activeId={activeId}
        setActiveId={setActiveId}
        createThread={createThread}
        deleteThread={deleteThread}
      />

      <section className="flex-1 flex flex-col">
        <Topbar
          model={model}
          setModel={setModel}
        />

        {/* Messages */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
            {active?.messages.map(
              (m: any, i: number) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "flex justify-end"
                      : "flex justify-start"
                  }
                >
                  <div
                    className={`rounded-2xl px-5 py-4 max-w-[85%] whitespace-pre-wrap leading-7 ${
                      m.role === "user"
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-900"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              )
            )}

            {streaming && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-5 py-4 bg-zinc-100 max-w-[85%] whitespace-pre-wrap leading-7">
                  {streaming}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-200 p-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl border border-zinc-300 px-4 py-3 shadow-sm">
              <textarea
                rows={3}
                value={msg}
                onChange={(e) =>
                  setMsg(e.target.value)
                }
                placeholder="Message SPACE LINK X Lab..."
                className="w-full resize-none outline-none"
              />

              <div className="flex justify-end pt-3">
                <button
                  onClick={send}
                  className="bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl"
                >
                  Send
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 text-center mt-3">
              Private AI Workspace
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}