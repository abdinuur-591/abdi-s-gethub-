const { supabase } = require("../lib/supabase");

function describeError(error) {
  // Surface the real underlying cause (DNS failure, connection refused, etc.)
  // instead of the generic "TypeError: fetch failed" message, so we can see
  // what's actually happening instead of guessing.
  const parts = [error.message || String(error)];
  if (error.cause) parts.push(`cause: ${error.cause.code || error.cause.message || error.cause}`);
  return parts.join(" | ");
}

module.exports = async (req, res) => {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase.from("drivers").select("*").order("created_at");
      if (error) return res.status(500).json({ error: describeError(error) });
      return res.status(200).json({ drivers: data });
    }
    if (req.method === "POST") {
      const { data, error } = await supabase.from("drivers").insert(req.body).select().single();
      if (error) return res.status(500).json({ error: describeError(error) });
      return res.status(200).json({ driver: data });
    }
    if (req.method === "PATCH") {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from("drivers").update(updates).eq("id", id).select().single();
      if (error) return res.status(500).json({ error: describeError(error) });
      return res.status(200).json({ driver: data });
    }
    res.status(405).json({ error: "GET, POST, or PATCH only" });
  } catch (e) {
    console.error("drivers.js crash:", e);
    res.status(500).json({ error: describeError(e), env: {
      hasUrl: !!process.env.SUPABASE_URL,
      urlLength: (process.env.SUPABASE_URL||"").length,
      hasKey: !!process.env.SUPABASE_SERVICE_KEY,
      keyLength: (process.env.SUPABASE_SERVICE_KEY||"").length
    }});
  }
};
