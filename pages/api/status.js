import { callHive } from "../../../lib/hiveRpc";

export default async function handler(req, res) {
  try {
    const props = await callHive("get_dynamic_global_properties");
    const feed = await callHive("get_feed_history");

    const head = props.head_block_number;
    const from = head - 19;
    const numbers = [];
    for (let i = from; i <= head; i++) {
      numbers.push(i);
    }

    const blocks = await Promise.all(
      numbers.map((n) => callHive("get_block", [n]))
    );

    const txCount = blocks.reduce(
      (sum, b) => sum + (b && b.transactions ? b.transactions.length : 0),
      0
    );
    const tps = txCount / (blocks.length * 3); // 3 second blocks

    res.status(200).json({ props, feed, tps });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "status error" });
  }
}
