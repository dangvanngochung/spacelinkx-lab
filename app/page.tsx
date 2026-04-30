"use client";

import { useState, useSyncExternalStore } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

const UNLOCK_KEY = "slx_unlock";
const UNLOCK_EVENT = "slx_unlock_change";

function subscribeToUnlockStatus(onStoreChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === UNLOCK_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(UNLOCK_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(UNLOCK_EVENT, onStoreChange);
  };
}

function useUnlockStatus() {
  return useSyncExternalStore(
    subscribeToUnlockStatus,
    () => localStorage.getItem(UNLOCK_KEY) === "1",
    () => false,
  );
}

export default function Page() {
  const persistedUnlock = useUnlockStatus();
  const [justUnlocked, setJustUnlocked] = useState(false);
  const ok = persistedUnlock || justUnlocked;

  function handleSignOut() {
    localStorage.removeItem(UNLOCK_KEY);
    window.dispatchEvent(new Event(UNLOCK_EVENT));
    setJustUnlocked(false);
  }

  if (!ok) {
    return <PasswordGate onUnlock={() => setJustUnlocked(true)} />;
  }

  return <ChatApp onSignOut={handleSignOut} />;
}
