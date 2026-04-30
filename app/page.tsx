"use client";

import { useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";
import GoogleAuthGate from "@/components/GoogleAuthGate";

export default function Page() {
  const [googleOk, setGoogleOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("slx_google_login") === "1";
  });

  const [ok, setOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("slx_unlock") === "1";
  });

  if (!googleOk) {
    return (
      <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        <GoogleAuthGate onSuccess={() => setGoogleOk(true)} />
      </main>
    );
  }

  if (!ok) {
    return <PasswordGate onUnlock={() => setOk(true)} />;
  }

  return <ChatApp />;
}
