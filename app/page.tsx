"use client";

import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

export default function Page() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setOk(localStorage.getItem("slx_unlock") === "1");
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  if (!ok) {
    return <PasswordGate onUnlock={() => setOk(true)} />;
  }

  return <ChatApp />;
}
