import { callHive } from "../../../../lib/hiveRpc";

export default async function handler(req, res) {
  try {
    const { name } = req.query;
    const limit = Math.min(Number(req.query.limit || 100), 1000);
    const filter = req.query.filter;

    const history = await callHive("get_account_history", [name, -1, limit]);

    const filtered = filter
      ? history.filter(([_, op]) => op.op && op.op[0] === filter)
      : history;

    res.status(200).json({ history: filtered });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "history error" });
  }
}
