const { client } = require("../lib/anthropic");

const EXTRACT_FIELDS = [
  "loadNumber","poNumber","brokerName","brokerMc","brokerContact","carrierMc","carrierDot",
  "truckNum","trailerNum","driverPhone","pickupAddress","pickupCity","pickupZip","pickupDate","pickupTime",
  "deliveryAddress","deliveryCity","deliveryZip","deliveryDate","deliveryTime","ratePay","notesOrPenalties"
];

const INSTRUCTIONS = `Extract structured freight rate-confirmation data as JSON only, no prose, no markdown fences.
Fields: ${EXTRACT_FIELDS.join(", ")}.
Dates must be formatted YYYY-MM-DD. Zip codes are the 5-digit codes next to each address.
notesOrPenalties: a short string summarizing fines/strict rules, or "None noted".
This PDF may have multiple pages, and the load details may not be on the first page (page 1 is often a broker cover/terms page) — check every page.
If a field is genuinely missing from the whole document, use null — don't guess.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  try {
    const { pdfBase64, filename } = req.body;
    if (!pdfBase64) return res.status(400).json({ error: "pdfBase64 is required" });

    const message = await client.messages.create({
      model: "claude-haiku-4-5", // cheap + fast, plenty for structured extraction
      max_tokens: 1024,
      messages: [{
        role: "user",
        content: [
          { type: "document", source: { type: "base64", media_type: "application/pdf", data: pdfBase64 } },
          { type: "text", text: INSTRUCTIONS }
        ]
      }]
    });

    const raw = message.content.find(b => b.type === "text")?.text || "{}";
    const cleaned = raw.replace(/^```json\s*|\s*```$/g, "").trim();
    const fields = JSON.parse(cleaned);
    res.status(200).json({ fields, filename });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "extraction failed" });
  }
};
