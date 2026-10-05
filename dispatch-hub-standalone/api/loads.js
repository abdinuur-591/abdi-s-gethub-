const { supabase } = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method === "GET") {
    const { data, error } = await supabase.from("loads").select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ loads: data });
  }
  if (req.method === "POST") {
    const { data, error } = await supabase.from("loads").insert(req.body).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ load: data });
  }
  if (req.method === "PATCH") {
    const { id, ...updates } = req.body;
    const { data, error } = await supabase.from("loads").update(updates).eq("id", id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ load: data });
  }
  res.status(405).json({ error: "GET, POST, or PATCH only" });
};
