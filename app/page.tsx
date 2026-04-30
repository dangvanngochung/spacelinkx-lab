"use client";

import { useState, useSyncExternalStore } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";
import GoogleAuthGate from "@/components/GoogleAuthGate";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("slx-unlock-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("slx-unlock-changed", onStoreChange);
  };
};
const getServerSnapshot = () => false;
const getUnlockSnapshot = () => localStorage.getItem("slx_unlock") === "1";

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

function useUnlockStatus() {
  return useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem("slx_unlock") === "1",
    () => false,
  );
}

export default function Page() {
  const persistedUnlock = useUnlockStatus();
  const [justUnlocked, setJustUnlocked] = useState(false);
  const ok = persistedUnlock || justUnlocked;

  function handleSignOut() {
    localStorage.removeItem("slx_unlock");
    setJustUnlocked(false);
  }

  if (!ok) {
    return <PasswordGate onUnlock={() => setJustUnlocked(true)} />;
  }

  return <ChatApp onSignOut={handleSignOut} />;
}
