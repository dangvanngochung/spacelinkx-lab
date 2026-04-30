"use client";

import { useEffect } from "react";

type GoogleCredentialResponse = { credential: string };

type GoogleAccountsId = {
  initialize: (opts: {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select: boolean;
    ux_mode: "popup";
  }) => void;
  prompt: () => void;
  renderButton: (element: HTMLElement, opts: Record<string, string>) => void;
};

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } };
  }
}

type GoogleProfile = { name: string; email: string; picture?: string };

function parseJwt(token: string): GoogleProfile | null {
  try {
    const base64 = token.split(".")[1];
    const payload = JSON.parse(atob(base64));
    return { name: payload.name, email: payload.email, picture: payload.picture };
  } catch {
    return null;
  }
}

export default function GoogleAuthGate({ onSuccess }: { onSuccess: () => void }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!clientId) return;

    const existing = document.getElementById("google-gsi-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "google-gsi-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }

    function initGoogle() {
      if (!window.google) return;
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          const profile = parseJwt(response.credential);
          if (!profile) return;
          localStorage.setItem("slx_user", JSON.stringify(profile));
          localStorage.setItem("slx_google_login", "1");
          onSuccess();
        },
        auto_select: false,
        ux_mode: "popup",
      });

      window.google.accounts.id.prompt();
      const container = document.getElementById("google-btn");
      if (container) {
        container.innerHTML = "";
        window.google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "large",
          text: "continue_with",
          shape: "pill",
        });
      }
    }
  }, [clientId, onSuccess]);

  return (
    <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm">
      <div className="text-lg font-semibold text-zinc-800">Sign in with Google</div>
      <p className="text-sm text-zinc-500 mt-1">Use your Google account to access SPACE LINK X Lab.</p>
      <div id="google-btn" className="mt-4" />
      {!clientId && <p className="text-xs text-rose-600 mt-3">Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID</p>}
    </div>
  );
}
