"use client";

import { useEffect, useState } from "react";
import PasswordGate from "@/components/PasswordGate";
import ChatApp from "@/components/ChatApp";

export default function Page() {
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem(
        "slx_unlock"
      ) === "1"
    ) {
      setOk(true);
    }
  }, []);

  if (!ok) {
    return (
      <PasswordGate
        onUnlock={() => setOk(true)}
      />
    );
  }

  return <ChatApp />;
}