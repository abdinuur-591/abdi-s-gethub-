const { createClient } = require("@supabase/supabase-js");

// Defensive cleanup: a trailing slash or stray whitespace/newline copied from
// Supabase's dashboard into Vercel's env var box is the #1 cause of
// "Invalid path specified in request URL" errors on every request.
const SUPABASE_URL = (process.env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
const SUPABASE_SERVICE_KEY = (process.env.SUPABASE_SERVICE_KEY || "").trim();

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

module.exports = { supabase };
