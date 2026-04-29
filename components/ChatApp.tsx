"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, Menu, X } from "lucide-react";
import { v4 as uuid } from "uuid";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { loadThreads, saveThreads } from "@/lib/storage";
import type { Msg, Thread } from "@/types/chat";

function MarkdownMessage({ content }: { content: string }) {
  const segments = useMemo(() => {
    const blocks = content.split(/```/g);
    return blocks.map((block, idx) => {
      if (idx % 2 === 1) {
        const [firstLine, ...rest] = block.split("\n");
        const language = firstLine.trim();
        return {
          type: "code" as const,
          language,
          value: rest.join("\n").trimEnd(),
        };
      }

      const lines = block.split("\n");
      return {
        type: "text" as const,
        value: lines,
      };
    });
  }, [content]);

  function parseInline(line: string) {
    const pieces = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return pieces.map((piece, i) => {
      if (piece.startsWith("**") && piece.endsWith("**")) {
        return <strong key={i}>{piece.slice(2, -2)}</strong>;
      }

      if (piece.startsWith("`") && piece.endsWith("`")) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded-md bg-zinc-200/80 text-[0.92em]"
          >
            {piece.slice(1, -1)}
          </code>
        );
      }

      return <span key={i}>{piece}</span>;
    });
  }

  return (
    <div className="space-y-4">
      {segments.map((segment, idx) => {
        if (segment.type === "code") {
          return <CodeBlock key={idx} language={segment.language} code={segment.value} />;
        }

        return (
          <div key={idx} className="space-y-2">
            {segment.value.map((line, lineIndex) => {
              if (!line.trim()) return <div key={lineIndex} className="h-2" />;

              if (line.startsWith("### ")) {
                return (
                  <h3 key={lineIndex} className="text-base font-semibold">
                    {parseInline(line.slice(4))}
                  </h3>
                );
              }

              if (line.startsWith("## ")) {
                return (
                  <h2 key={lineIndex} className="text-lg font-semibold">
                    {parseInline(line.slice(3))}
                  </h2>
                );
              }

              if (line.startsWith("# ")) {
                return (
                  <h1 key={lineIndex} className="text-xl font-semibold">
                    {parseInline(line.slice(2))}
                  </h1>
                );
              }

              if (/^[-*]\s/.test(line)) {
                return (
                  <li key={lineIndex} className="ml-5 list-disc">
                    {parseInline(line.replace(/^[-*]\s/, ""))}
                  </li>
                );
              }

              return <p key={lineIndex}>{parseInline(line)}</p>;
            })}
          </div>
        );
      })}
    </div>
  );
}

function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  }

  return (
    <div className="rounded-xl overflow-hidden border border-zinc-700/40">
      <div className="flex items-center justify-between bg-zinc-900 text-zinc-200 px-3 py-2 text-xs">
        <span>{language || "code"}</span>
        <button onClick={onCopy} className="inline-flex items-center gap-1 hover:text-white transition">
          <Copy size={13} />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-zinc-950 text-zinc-100 p-4 overflow-x-auto text-sm leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function makeNewThread(): Thread {
  return {
    id: uuid(),
    title: "New chat",
    createdAt: Date.now(),
    folder: "general",
    messages: [],
  };
}

export default function ChatApp() {
  const [threads, setThreads] = useState<Thread[]>(() => {
    if (typeof window === "undefined") return [makeNewThread()];
    const stored = loadThreads();
    return stored.length ? stored : [makeNewThread()];
  });
  const [activeId, setActiveId] = useState(() => threads[0]?.id ?? "");
  const [msg, setMsg] = useState("");
  const [streaming, setStreaming] = useState("");
  const [model, setModel] = useState("gpt-4.1-mini");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [activeFolder, setActiveFolder] = useState("all");

  const folders = useMemo(() => {
    const set = new Set(threads.map((t) => t.folder ?? "general"));
    return Array.from(set);
  }, [threads]);


  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  useEffect(() => {
    messagesRef.current?.scrollTo({
      top: messagesRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [activeId, streaming, threads]);

  function createThread() {
    const item = makeNewThread();

    setThreads((prev) => [item, ...prev]);
    setActiveId(item.id);
    setSidebarOpen(false);
  }

  function deleteThread(id: string) {
    if (!confirm("Delete chat?")) return;

    const next = threads.filter((x) => x.id !== id);

    setThreads(next);

    if (next.length) {
      setActiveId(next[0].id);
    } else {
      createThread();
    }
  }

  const active = threads.find((x) => x.id === activeId);

  async function send() {
    if (!msg.trim() || !activeId) return;

    const userMessage = msg;

    const updated = threads.map((t) =>
      t.id === activeId
        ? {
            ...t,
            title: t.messages.length === 0 ? userMessage.slice(0, 35) : t.title,
            messages: [...t.messages, { role: "user", content: userMessage } as Msg],
          }
        : t,
    );

    setThreads(updated);
    setMsg("");
    setStreaming("");

    const thread = updated.find((x) => x.id === activeId);
    if (!thread) return;

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
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      final += chunk;
      setStreaming(final);
    }

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeId
          ? {
              ...t,
              messages: [...t.messages, { role: "assistant", content: final }],
            }
          : t,
      ),
    );

    setStreaming("");
  }

  return (
    <main className="h-screen flex bg-white text-zinc-900">
      <div className={`fixed inset-0 z-40 md:hidden ${sidebarOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setSidebarOpen(false)}
          className={`absolute inset-0 bg-black/35 transition ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute inset-y-0 left-0 transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            threads={threads}
            folders={folders}
            activeFolder={activeFolder}
            setActiveFolder={setActiveFolder}
            activeId={activeId}
            setActiveId={(id: string) => {
              setActiveId(id);
              setSidebarOpen(false);
            }}
            createThread={createThread}
            deleteThread={deleteThread}
            renameThread={(id: string, title: string) => {
              setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title: title.trim().slice(0, 80) || "Untitled chat" } : t)));
            }}
            moveThreadFolder={(id: string, folder: string) => {
              setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, folder } : t)));
            }}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <Sidebar
          threads={threads}
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          activeId={activeId}
          setActiveId={setActiveId}
          createThread={createThread}
          deleteThread={deleteThread}
          renameThread={(id: string, title: string) => {
            setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, title: title.trim().slice(0, 80) || "Untitled chat" } : t)));
          }}
          moveThreadFolder={(id: string, folder: string) => {
            setThreads((prev) => prev.map((t) => (t.id === id ? { ...t, folder } : t)));
          }}
        />
      </div>

      <section className="flex-1 flex flex-col min-w-0">
        <Topbar model={model} setModel={setModel} />

        <div className="md:hidden border-b border-zinc-200 px-4 py-2 flex justify-between">
          <button onClick={() => setSidebarOpen(true)} className="inline-flex items-center gap-2 text-sm text-zinc-700">
            <Menu size={18} /> Chats
          </button>
          {sidebarOpen && <button onClick={() => setSidebarOpen(false)}><X size={18} /></button>}
        </div>

        <div ref={messagesRef} className="flex-1 overflow-auto">
          <div className="max-w-3xl mx-auto px-4 md:px-6 py-8 space-y-10">
            {active?.messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={`rounded-2xl px-5 py-4 max-w-[92%] md:max-w-[85%] leading-7 shadow-sm ${
                    m.role === "user" ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900"
                  }`}
                >
                  <MarkdownMessage content={m.content} />
                </div>
              </div>
            ))}

            {streaming && (
              <div className="flex justify-start">
                <div className="rounded-2xl px-5 py-4 bg-zinc-100 max-w-[92%] md:max-w-[85%] leading-7 shadow-sm">
                  <MarkdownMessage content={streaming} />
                  <span className="inline-block ml-1 w-2 h-5 bg-zinc-500 align-middle animate-pulse" />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-200 p-4 md:p-5 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-3xl border border-zinc-300 px-4 py-3 shadow-sm">
              <textarea
                rows={3}
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="Message SPACE LINK X Lab..."
                className="w-full resize-none outline-none"
              />

              <div className="flex justify-end pt-3">
                <button onClick={send} className="bg-zinc-900 hover:bg-black text-white px-5 py-2 rounded-xl">
                  Send
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400 text-center mt-3">Private AI Workspace</p>
          </div>
        </div>
      </section>
    </main>
  );
}
