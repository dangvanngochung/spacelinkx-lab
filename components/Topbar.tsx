"use client";

type TopbarProps = {
  model: string;
  setModel: (model: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
};

export default function Topbar({ model, setModel, theme, setTheme }: TopbarProps) {
  return (
    <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-6">
      <div className="font-medium text-zinc-700">SPACE LINK X Lab</div>

      <select
        value={model}
        onChange={(e) => setModel(e.target.value)}
        className="border border-zinc-300 rounded-xl px-4 py-2 text-sm bg-white"
      >
        <option>gpt-4.1-mini</option>
        <option>gpt-4.1</option>
        <option>gpt-5-mini</option>
        <option>gpt-5</option>
      </select>

      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value)}
        className="border border-zinc-300 rounded-xl px-3 py-2 text-sm bg-white ml-3"
      >
        <option value="slx-light">SLX Light</option>
        <option value="slx-dark">SLX Dark</option>
        <option value="slx-ocean">SLX Ocean</option>
      </select>
    </header>
  );
}
