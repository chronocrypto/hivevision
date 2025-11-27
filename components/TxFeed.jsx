export default function TxFeed({ ops }) {
  return (
    <div className="bg-panel rounded-2xl p-4 border border-white/5">
      <div className="flex items-center justify-between mb-3 gap-2">
        <div>
          <div className="text-sm font-medium">Live Operations Feed</div>
          <div className="text-xs text-white/50">
            Latest account history for @hive (demo feed)
          </div>
        </div>
        <div className="text-[10px] px-2 py-1 rounded-full border border-white/10 text-white/60">
          Static source: get_account_history
        </div>
      </div>
      <div className="space-y-2 text-xs max-h-[420px] overflow-auto pr-1">
        {ops && ops.length > 0 ? (
          ops.map((item, i) => {
            const type = item.op?.[0];
            const body = item.op?.[1];
            return (
              <div
                key={i}
                className="flex justify-between items-start bg-panel2 rounded-xl px-3 py-2 border border-white/5"
              >
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white/90 mb-0.5">
                    {type}
                  </div>
                  <div className="text-white/55 truncate max-w-[90%]">
                    {JSON.stringify(body)}
                  </div>
                </div>
                <div className="ml-2 text-[10px] text-white/40 whitespace-nowrap">
                  #{item?.trx_id?.slice(0, 8) || i}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-white/50">No operations found.</div>
        )}
      </div>
    </div>
  );
}
