"use client";

import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { Thread } from "@/types/chat";
import {
  loadThreads,
  saveThreads,
} from "@/lib/storage";

export default function ChatApp() {
  const [threads, setThreads] =
    useState<Thread[]>([]);
  const [activeId, setActiveId] =
    useState("");
  const [msg, setMsg] = useState("");
  const [streaming, setStreaming] =
    useState("");
  const [dark, setDark] = useState(true);
  const [model, setModel] =
    useState("gpt-5");

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

    const t = {
      id,
      title: "New Chat",
      createdAt: Date.now(),
      messages: [],
    };

    setThreads((prev) => [t, ...prev]);
    setActiveId(id);
  }

  const active =
    threads.find((x) => x.id === activeId);

  async function send() {
    if (!active || !msg.trim()) return;

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
        messages: thread?.messages,
      }),
    });

    const reader =
      res.body?.getReader();

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

  return (
    <main
      className={
        dark
          ? "dark bg-zinc-950 text-white"
          : "bg-white text-black"
      }
    >
      <div className="flex h-screen">
        <Sidebar
          threads={threads}
          activeId={activeId}
          setActiveId={setActiveId}
          createThread={createThread}
        />

        <section className="flex-1 flex flex-col">
          <Topbar
            dark={dark}
            setDark={setDark}
            model={model}
            setModel={setModel}
          />

          <div className="flex-1 overflow-auto p-6 space-y-5">
            {active?.messages.map(
              (m, i) => (
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
              className="flex-1 border rounded p-3 text-black"
            />

            <button
              onClick={send}
              className="px-6 rounded bg-black text-white"
            >
              Send
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}