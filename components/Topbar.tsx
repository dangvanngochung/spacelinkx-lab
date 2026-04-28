"use client";

export default function Topbar({
  dark,
  setDark,
  model,
  setModel,
}: any) {
  return (
    <header className="border-b p-3 flex gap-3 items-center">
      <select
        value={model}
        onChange={(e) =>
          setModel(e.target.value)
        }
        className="border p-2 rounded text-black"
      >
        <option>gpt-5</option>
        <option>gpt-5-mini</option>
        <option>gpt-4.1</option>
        <option>gpt-4.1-mini</option>
      </select>

      <button
        onClick={() => setDark(!dark)}
        className="border px-4 py-2 rounded"
      >
        Theme
      </button>
    </header>
  );
}