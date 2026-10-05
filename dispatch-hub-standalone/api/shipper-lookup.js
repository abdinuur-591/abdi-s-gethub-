const { client } = require("../lib/anthropic");

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key) return res.status(200).json({ unavailable: true, reason: "No GOOGLE_PLACES_API_KEY set" });

  try {
    const { name, address } = req.body;
    if (!address) return res.status(400).json({ error: "address is required" });

    // Places API (New) - Text Search
    const searchResp = await fetch("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.reviews"
      },
      body: JSON.stringify({ textQuery: `${name || ""} ${address}`.trim() })
    });
    const searchData = await searchResp.json();
    const place = searchData.places && searchData.places[0];
    if (!place) return res.status(200).json({ found: false });

    const reviewSnippets = (place.reviews || []).slice(0, 5)
      .map(r => r.text && r.text.text).filter(Boolean).join("\n---\n");

    let summary = null;
    if (reviewSnippets) {
      const msg = await client.messages.create({
        model: "claude-haiku-4-5",
        max_tokens: 300,
        messages: [{
          role: "user",
          content: `Summarize this shipper/receiver's reputation for a truck driver in 2-3 sentences, based on these reviews. Flag anything about strict appointment windows, long wait times, detention, or driver treatment. Reviews:\n${reviewSnippets}`
        }]
      });
      summary = msg.content.find(b => b.type === "text")?.text || null;
    }

    res.status(200).json({
      found: true,
      name: place.displayName && place.displayName.text,
      rating: place.rating,
      ratingCount: place.userRatingCount,
      summary
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "lookup failed" });
  }
};
