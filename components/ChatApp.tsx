"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { loadThreads, saveThreads } from "@/lib/storage";

export default function ChatApp() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeId, setActiveId] = useState("");
  const [msg, setMsg] = useState("");
  const [streaming, setStreaming] = useState("");
  const [theme, setTheme] = useState("light");
  const [model, setModel] = useState("gpt-4.1-mini");

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("slx_theme");
    if (savedTheme) setTheme(savedTheme);

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

  useEffect(() => {
    localStorage.setItem("slx_theme", theme);
  }, [theme]);

  function createThread() {
    const id = uuid();

    const item = {
      id,
      title: "New Chat",
      messages: [],
    };

    setThreads((prev) => [item, ...prev]);
    setActiveId(id);
  }

  function deleteThread(id: string) {
    if (!confirm("Delete this chat?")) return;

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
                ? msg.slice(0, 30)
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

    const reader = res.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();

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

  const themes: any = {
    dark:
      "bg-black text-white",
    light:
      "bg-white text-black",
    slate:
      "bg-slate-900 text-slate-100",
    midnight:
      "bg-zinc-950 text-zinc-100",
    cream:
      "bg-amber-50 text-zinc-900",
    forest:
      "bg-emerald-950 text-emerald-100",
  };

  return (
    <main
      className={`${themes[theme]} h-screen`}
    >
      <div className="flex h-screen">
        <Sidebar
          threads={threads}
          activeId={activeId}
          setActiveId={setActiveId}
          createThread={createThread}
          deleteThread={deleteThread}
        />

        <section className="flex-1 flex flex-col">
          <Topbar
            theme={theme}
            setTheme={setTheme}
            model={model}
            setModel={setModel}
          />

          <div className="flex-1 overflow-auto p-6 space-y-5">
            {active?.messages?.map(
              (m: any, i: number) => (
                <div key={i}>
                  <b>{m.role}:</b>
                  <div>{m.content}</div>
                </div>
              )
            )}

            {streaming && (
              <div>
                <b>assistant:</b>
                <div>{streaming}</div>
              </div>
            )}
          </div>

          <div className="border-t p-4 flex gap-3">
            <textarea
              rows={3}
              value={msg}
              onChange={(e) =>
                setMsg(e.target.value)
              }
              className="flex-1 rounded-xl p-3 text-black"
            />

            <button
              onClick={send}
              className="px-6 rounded-xl bg-white text-black"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}