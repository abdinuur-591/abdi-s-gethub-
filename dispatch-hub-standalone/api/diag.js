module.exports = async (req, res) => {
  const url = (process.env.SUPABASE_URL || "").trim();
  const key = (process.env.SUPABASE_SERVICE_KEY || "").trim();

  const report = {
    env: {
      urlPresent: !!url,
      urlPreview: url ? url.slice(0, 20) + "..." + url.slice(-10) : null,
      urlLength: url.length,
      keyPresent: !!key,
      keyPreview: key ? key.slice(0, 10) + "..." : null,
      keyLength: key.length
    }
  };

  try {
    const target = url + "/rest/v1/";
    const resp = await fetch(target, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    report.rawFetch = { ok: resp.ok, status: resp.status, statusText: resp.statusText };
  } catch (e) {
    report.rawFetch = {
      failed: true,
      name: e.name,
      message: e.message,
      cause_code: e.cause ? e.cause.code : null,
      cause_message: e.cause ? e.cause.message : null,
      cause_errno: e.cause ? e.cause.errno : null,
      stack: (e.stack || "").split("\n").slice(0, 3)
    };
  }

  res.status(200).json(report);
};
