import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";

async function fetchWitnesses() {
  const res = await fetch("/api/witnesses");
  if (!res.ok) throw new Error("Witness fetch failed");
  return res.json();
}

export default function Leaderboards() {
  const witnessesQ = useQuery({
    queryKey: ["witnesses"],
    queryFn: fetchWitnesses,
    refetchInterval: 15000
  });

  const witnesses = witnessesQ.data?.witnesses || [];

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <SearchBar />
        <div className="text-2xl font-semibold">Top Witnesses</div>

        <div className="bg-panel rounded-2xl p-4 border border-white/5 text-sm">
          {witnesses.length ? (
            <div className="space-y-2">
              {witnesses.map((w, i) => (
                <div
                  key={w.owner}
                  className="flex justify-between items-center bg-panel2 rounded-xl px-3 py-2 border border-white/5"
                >
                  <div className="text-white/85">
                    #{i + 1} @{w.owner}
                  </div>
                  <div className="text-white/55 text-xs">
                    votes: {Number(w.votes).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-white/50 text-sm">
              No witness data available.
            </div>
          )}
        </div>

        <div className="bg-panel rounded-2xl p-4 border border-dashed border-white/10 text-xs text-white/60">
          Analytics layer for authors, curators, and cohort trends can sit here
          once you plug in a HAF indexer or your own database. This page is
          wired to live Hive RPC (witnesses) and can be extended with more
          ranking logic.
        </div>
      </div>
    </Layout>
  );
}
