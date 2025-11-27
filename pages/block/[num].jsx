import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import Layout from "../../components/Layout";
import SearchBar from "../../components/SearchBar";

async function fetchBlock(num) {
  const res = await fetch(`/api/block/${encodeURIComponent(num)}`);
  if (!res.ok) throw new Error("Block fetch failed");
  return res.json();
}

export default function BlockPage() {
  const router = useRouter();
  const { num } = router.query;

  const blockQ = useQuery({
    queryKey: ["block", num],
    queryFn: () => fetchBlock(num),
    enabled: !!num,
    refetchInterval: 15000
  });

  if (!num) {
    return (
      <Layout>
        <div className="text-white/60">Loading...</div>
      </Layout>
    );
  }

  if (blockQ.isLoading) {
    return (
      <Layout>
        <div className="text-white/60">Loading block...</div>
      </Layout>
    );
  }

  if (blockQ.isError || !blockQ.data?.block) {
    return (
      <Layout>
        <div className="text-red-400 text-sm">Block not found or error loading.</div>
      </Layout>
    );
  }

  const { block } = blockQ.data;

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <SearchBar />
        <div className="text-2xl font-semibold">Block #{num}</div>

        <div className="bg-panel rounded-2xl p-4 border border-white/5 text-sm space-y-1.5">
          <div>
            <span className="text-white/50 mr-1">Timestamp:</span>
            {block.timestamp}
          </div>
          <div>
            <span className="text-white/50 mr-1">Witness:</span>
            {block.witness}
          </div>
          <div>
            <span className="text-white/50 mr-1">Transactions:</span>
            {block.transactions?.length ?? 0}
          </div>
        </div>

        <div className="bg-panel rounded-2xl p-4 border border-white/5">
          <div className="text-sm font-medium mb-2">Transactions</div>
          <div className="space-y-3 text-xs">
            {block.transactions && block.transactions.length > 0 ? (
              block.transactions.map((tx, i) => (
                <div
                  key={i}
                  className="bg-panel2 rounded-xl p-3 border border-white/5 overflow-auto"
                >
                  <div className="text-white/70 mb-1">Tx #{i + 1}</div>
                  <pre className="whitespace-pre text-white/60 text-[11px]">
{JSON.stringify(tx.operations, null, 2)}
                  </pre>
                </div>
              ))
            ) : (
              <div className="text-white/50">No transactions in this block.</div>
            )}
          </div>
        </div>

        <div className="bg-panel rounded-2xl p-4 border border-white/5">
          <div className="text-sm font-medium mb-2">Raw Block JSON</div>
          <pre className="whitespace-pre-wrap text-[11px] text-white/60 max-h-[420px] overflow-auto">
{JSON.stringify(block, null, 2)}
          </pre>
        </div>
      </div>
    </Layout>
  );
}
