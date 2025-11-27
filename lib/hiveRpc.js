const DEFAULT_NODE = process.env.HIVE_RPC || "https://api.hive.blog";

/**
 * Generic Hive RPC caller. If method already has a namespace
 * (like "rc_api.find_rc_accounts"), it is used as is. Otherwise,
 * it is prefixed with "condenser_api.".
 */
export async function callHive(method, params = [], node = DEFAULT_NODE) {
  const rpcMethod = method.includes(".") ? method : `condenser_api.${method}`;

  const body = {
    jsonrpc: "2.0",
    id: 1,
    method: rpcMethod,
    params
  };

  const res = await fetch(node, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    throw new Error(`Hive RPC error ${res.status}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message || "Unknown Hive RPC error");
  }

  return json.result;
}
