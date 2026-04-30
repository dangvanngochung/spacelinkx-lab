"use client";

import { useSyncExternalStore } from "react";
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

export default function Page() {
  const ok = useSyncExternalStore(subscribe, getUnlockSnapshot, getServerSnapshot);

  if (!googleOk) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <GoogleAuthGate onSuccess={() => setGoogleOk(true)} />
      </main>
    );
  }

  if (!ok) {
    return (
      <PasswordGate
        onUnlock={() => window.dispatchEvent(new Event("slx-unlock-changed"))}
      />
    );
  }

  return <ChatApp />;
}
