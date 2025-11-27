import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import SearchBar from "../components/SearchBar";
import KpiCard from "../components/KpiCard";
import TxFeed from "../components/TxFeed";

async function fetchStatus() {
  const res = await fetch("/api/status");
  if (!res.ok) throw new Error("Failed to fetch status");
  return res.json();
}

async function fetchGlobalHistory() {
  // For demo purposes, we read history from @hive
  const res = await fetch("/api/account/hive/history?limit=40");
  if (!res.ok) return { history: [] };
  return res.json();
}

export default function Home() {
  const statusQ = useQuery({
    queryKey: ["status"],
    queryFn: fetchStatus,
    refetchInterval: 5000
  });

  const histQ = useQuery({
    queryKey: ["global-history"],
    queryFn: fetchGlobalHistory,
    refetchInterval: 8000
  });

  const props = statusQ.data?.props;
  const feed = statusQ.data?.feed;
  const tps = statusQ.data?.tps;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <SearchBar />

        {/* KPI row */}
        {props && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KpiCard
              label="Head Block"
              value={props.head_block_number?.toLocaleString()}
              sub={props.current_witness}
            />
            <KpiCard
              label="TPS (est)"
              value={tps?.toFixed(2) ?? "–"}
              sub="last 20 blocks"
            />
            <KpiCard
              label="HIVE Supply"
              value={Number(props.current_supply.split(" ")[0]).toLocaleString()}
              sub="liquid + vested"
            />
            <KpiCard
              label="HBD Supply"
              value={Number(props.current_hbd_supply.split(" ")[0]).toLocaleString()}
              sub="circulating"
            />
            <KpiCard
              label="Virtual Supply"
              value={props.virtual_supply}
              sub="est inflation tracking"
            />
          </div>
        )}

        {/* Price feed */}
        {feed && (
          <div className="bg-panel rounded-2xl p-4 border border-white/5">
            <div className="text-sm font-medium mb-1.5">Price Feed</div>
            <div className="text-xs text-white/60 mb-2">
              Median price feed from witnesses (static RPC call)
            </div>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span>HIVE / HBD pair</span>
                <span className="font-medium text-white/80">
                  {feed.current_median_history.base} / {feed.current_median_history.quote}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Live ops */}
        <TxFeed
          ops={histQ.data?.history?.map((row) => row[1]) || []}
        />
      </div>
    </Layout>
  );
}
