"use client";

const themes = [
  { name: "Dark", value: "dark" },
  { name: "Light", value: "light" },
  { name: "Slate", value: "slate" },
  { name: "Midnight", value: "midnight" },
  { name: "Cream", value: "cream" },
  { name: "Forest", value: "forest" },
];

export default function Topbar({
  theme,
  setTheme,
  model,
  setModel,
}: any) {
  return (
    <header className="border-b p-3 flex gap-3 items-center justify-between">
      <div className="flex gap-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border p-2 rounded text-black"
        >
          <option>gpt-5</option>
          <option>gpt-5-mini</option>
          <option>gpt-4.1</option>
          <option>gpt-4.1-mini</option>
        </select>

        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="border p-2 rounded text-black"
        >
          {themes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      <div className="text-sm opacity-70">
        SpaceLinkX Lab
      </div>
    </header>
  );
}