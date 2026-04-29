"use client";

import { useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

export default function Page() {
  const [ok, setOk] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("slx_unlock") === "1";
  });

  if (!ok) {
    return <PasswordGate onUnlock={() => setOk(true)} />;
  }

  return <ChatApp />;
}
