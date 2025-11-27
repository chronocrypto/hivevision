import { callHive } from "../../lib/hiveRpc";

export default async function handler(req, res) {
  try {
    const witnesses = await callHive("get_witnesses_by_vote", ["", 50]);
    res.status(200).json({ witnesses });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "witnesses error" });
  }
}
