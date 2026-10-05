const { supabase } = require("../lib/supabase");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { filename, base64, contentType } = req.body;
    if (!filename || !base64) return res.status(400).json({ error: "filename and base64 are required" });

    const buffer = Buffer.from(base64, "base64");
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${safeName}`;

    const { error: uploadError } = await supabase.storage
      .from("rateconfs")
      .upload(path, buffer, { contentType: contentType || "application/pdf" });
    if (uploadError) return res.status(500).json({ error: uploadError.message });

    const { data } = supabase.storage.from("rateconfs").getPublicUrl(path);
    res.status(200).json({ url: data.publicUrl, path });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "upload failed" });
  }
};
