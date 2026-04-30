"use client";

import { useState, useSyncExternalStore } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
}

function getSnapshot() {
  return localStorage.getItem("slx_unlock") === "1";
}

function getServerSnapshot() {
  return false;
}

export default function Page() {
  const [justUnlocked, setJustUnlocked] = useState(false);
  const persistedUnlock = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!justUnlocked && !persistedUnlock) {
    return <PasswordGate onUnlock={() => setJustUnlocked(true)} />;
  }

  return <ChatApp />;
}
