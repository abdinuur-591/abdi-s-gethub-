const { createClient } = require("@supabase/supabase-js");

// SUPABASE_SERVICE_KEY is the "service_role" secret key — server-side only,
// never send this to the browser. Set both in Vercel's Environment Variables.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = { supabase };
