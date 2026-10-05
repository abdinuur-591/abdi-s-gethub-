const { supabase } = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("drivers").select("*").order("created_at");
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ drivers: data });
  }
  if (req.method === "POST") {
    const { data, error } = await supabase.from("drivers").insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ driver: data });
  }
  if (req.method === "PATCH") {
    const { id, ...updates } = req.body;
    const { data, error } = await supabase.from("drivers").update(updates).eq("id", id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ driver: data });
  }
  res.status(405).json({ error: "GET, POST, or PATCH only" });
};
