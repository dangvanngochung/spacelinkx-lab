"use client";

import { useSyncExternalStore } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

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

export default function Page() {
  const ok = useSyncExternalStore(subscribe, getUnlockSnapshot, getServerSnapshot);

  if (!ok) {
    return (
      <PasswordGate
        onUnlock={() => window.dispatchEvent(new Event("slx-unlock-changed"))}
      />
    );
  }

  return <ChatApp />;
}
