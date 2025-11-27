import { useState } from "react";
import { useRouter } from "next/router";

export default function SearchBar({ placeholder = "Search @username or block number..." }) {
  const [q, setQ] = useState("");
  const router = useRouter();

  function onSubmit(e) {
    e.preventDefault();
    const v = q.trim().toLowerCase();
    if (!v) return;
    if (/^\d+$/.test(v)) {
      router.push(`/block/${v}`);
    } else {
      router.push(`/account/${v.replace(/^@/, "")}`);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="flex bg-panel2 rounded-2xl border border-white/10 focus-within:border-accent transition shadow-md shadow-black/40">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent px-4 py-3 outline-none text-sm md:text-base text-white placeholder:text-white/40"
        />
        <button
          type="submit"
          className="px-4 md:px-5 text-xs md:text-sm font-medium bg-accent hover:bg-accent/90 rounded-2xl m-1 flex items-center justify-center"
        >
          Search
        </button>
      </div>
    </form>
  );
}
