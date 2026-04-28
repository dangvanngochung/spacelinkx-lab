"use client";

import { useState } from "react";

export default function PasswordGate({
  onUnlock,
}: {
  onUnlock: () => void;
}) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");

    const res = await fetch("/api/auth", {
      method: "POST",
      body: JSON.stringify({
        password: pw,
      }),
    });

    if (res.ok) {
      localStorage.setItem("slx_unlock", "1");
      onUnlock();
    } else {
      setErr("Wrong password");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md border rounded-2xl p-6 space-y-4">
        <h1 className="text-2xl font-bold">
          SpaceLinkX Lab
        </h1>

        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Password"
          className="w-full border p-3 rounded"
        />

        <button
          onClick={submit}
          className="w-full bg-black text-white p-3 rounded"
        >
          Unlock
        </button>

        <p className="text-red-500 text-sm">{err}</p>
      </div>
    </main>
  );
}