import { callHive } from "../../../lib/hiveRpc";

export default async function handler(req, res) {
  try {
    const num = Number(req.query.num);
    if (!Number.isFinite(num)) {
      return res.status(400).json({ error: "Invalid block number" });
    }
    const block = await callHive("get_block", [num]);
    if (!block) {
      return res.status(404).json({ error: "Block not found" });
    }
    res.status(200).json({ block });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "block error" });
  }
}
