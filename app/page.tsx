"use client";

import { useEffect, useState } from "react";
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
  const [ok, setOk] = useState(false);

  useEffect(() => {
    setOk(localStorage.getItem("slx_unlock") === "1");
  }, []);

  if (!ok) {
    return (
      <PasswordGate
        onUnlock={() => window.dispatchEvent(new Event("slx-unlock-changed"))}
      />
    );
  }

  return <ChatApp />;
}
