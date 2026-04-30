"use client";

import { useState, useSyncExternalStore } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

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
