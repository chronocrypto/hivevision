import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";
import KpiCard from "../../components/KpiCard";
import { useState } from "react";

async function fetchAccount(name) {
  const res = await fetch(`/api/account/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Account fetch failed");
  return res.json();
}

async function fetchHistory(name, limit, filter) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  if (filter) params.set("filter", filter);
  const res = await fetch(`/api/account/${encodeURIComponent(name)}/history?${params.toString()}`);
  if (!res.ok) throw new Error("History fetch failed");
  return res.json();
}

export default function AccountPage() {
  const router = useRouter();
  const { name } = router.query;
  const [filter, setFilter] = useState("");

  const accountQ = useQuery({
    queryKey: ["account", name],
    queryFn: () => fetchAccount(name),
    enabled: !!name,
    refetchInterval: 10000
  });

  const historyQ = useQuery({
    queryKey: ["history", name, filter],
    queryFn: () => fetchHistory(name, 80, filter || undefined),
    enabled: !!name,
    refetchInterval: 15000
  });

  if (!name) {
    return (
      <Layout>
        <div className="text-white/60">Loading...</div>
      </Layout>
    );
  }

  if (accountQ.isLoading) {
    return (
      <Layout>
        <div className="text-white/60">Loading account...</div>
      </Layout>
    );
  }

  if (accountQ.isError || !accountQ.data?.account) {
    return (
      <Layout>
        <div className="text-red-400 text-sm">Account not found or error loading.</div>
      </Layout>
    );
  }

  const { account, rc, hp } = accountQ.data;
  const hiveBal = Number(account.balance.split(" ")[0]);
  const hbdBal = Number(account.hbd_balance.split(" ")[0]);
  const savingsHive = Number(account.savings_balance.split(" ")[0]);
  const savingsHbd = Number(account.savings_hbd_balance.split(" ")[0]);
  const rewardsHive = Number(account.reward_hive_balance.split(" ")[0]);
  const rewardsHbd = Number(account.reward_hbd_balance.split(" ")[0]);

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <SearchBar />

        <div className="text-2xl font-semibold">@{account.name}</div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="HIVE" value={hiveBal.toLocaleString()} />
          <KpiCard label="HBD" value={hbdBal.toLocaleString()} />
          <KpiCard
            label="Hive Power (HP)"
            value={hp.toFixed(3)}
            sub="computed from vests"
          />
          <KpiCard
            label="RC Mana"
            value={
              rc
                ? Number(rc.rc_manabar.current_mana).toLocaleString()
                : "N/A"
            }
            sub={rc ? "raw mana units" : "rc_api not available"}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KpiCard label="Savings HIVE" value={savingsHive.toLocaleString()} />
          <KpiCard label="Savings HBD" value={savingsHbd.toLocaleString()} />
          <KpiCard label="Rewards HIVE" value={rewardsHive.toLocaleString()} />
          <KpiCard label="Rewards HBD" value={rewardsHbd.toLocaleString()} />
        </div>

        <div className="bg-panel rounded-2xl p-4 border border-white/5">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <div className="text-sm font-medium">Recent Activity</div>
              <div className="text-xs text-white/50">
                Last {historyQ.data?.history?.length || 0} operations
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-panel2 text-xs md:text-sm rounded-xl px-2 py-1 border border-white/10 outline-none"
            >
              <option value="">All ops</option>
              <option value="transfer">transfer</option>
              <option value="vote">vote</option>
              <option value="comment">comment</option>
              <option value="custom_json">custom_json</option>
              <option value="claim_reward_balance">claim_reward_balance</option>
            </select>
          </div>

          <div className="space-y-2 text-xs max-h-[520px] overflow-auto pr-1">
            {historyQ.data?.history?.length ? (
              historyQ.data.history.slice(0, 80).map(([idx, item]) => {
                const op = item.op?.[0];
                const body = item.op?.[1];
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-start bg-panel2 rounded-xl px-3 py-2 border border-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-white/90 mb-0.5">
                        {op}
                      </div>
                      <div className="text-white/55 truncate max-w-[90%]">
                        {JSON.stringify(body)}
                      </div>
                    </div>
                    <div className="ml-2 text-[10px] text-white/40 whitespace-nowrap">
                      #{item.trx_id?.slice(0, 8) || idx}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-white/50">No history data.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
