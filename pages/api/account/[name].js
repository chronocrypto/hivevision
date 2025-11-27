import { callHive } from "../../../lib/hiveRpc";

export default async function handler(req, res) {
  try {
    const { name } = req.query;

    const accounts = await callHive("get_accounts", [[name]]);
    const account = accounts && accounts[0];
    if (!account) {
      return res.status(404).json({ error: "Account not found" });
    }

    let rc = null;
    try {
      const rcResult = await callHive("rc_api.find_rc_accounts", [{ accounts: [name] }]);
      rc = rcResult?.rc_accounts?.[0] || null;
    } catch (err) {
      // RC API may not be available on all nodes – do not fail hard
      console.warn("RC fetch failed", err.message);
    }

    const props = await callHive("get_dynamic_global_properties");
    const totalVests = Number(props.total_vesting_shares.split(" ")[0]);
    const totalHive = Number(props.total_vesting_fund_hive.split(" ")[0]);
    const userVests = Number(account.vesting_shares.split(" ")[0]);
    const hp = totalVests > 0 ? (userVests / totalVests) * totalHive : 0;

    const delegationsOut = await callHive("get_vesting_delegations", [name, "", 100]);
    const delegationsIn = await callHive("get_vesting_delegations", ["", name, 100]);

    res.status(200).json({
      account,
      rc,
      hp,
      delegationsOut,
      delegationsIn
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "account error" });
  }
}
