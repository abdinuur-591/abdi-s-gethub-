# Dispatch Hub — Standalone Version

This is your own, independently-hosted version of Dispatch Hub. Unlike the
Claude artifact version, this one:
- Runs on your own domain
- Stores your data in your own database (Supabase), not Anthropic's
- Reads PDFs (scanned or text) natively using your own Anthropic API key —
  no more "images not available" limitation
- Can look up a shipper's Google reviews (needs a Google API key, see below)

## What you need (accounts to create — all free to start)

1. **GitHub account** — to hold the code (free)
2. **Vercel account** — hosts the site and runs the backend functions (free tier)
3. **Supabase account** — your database + file storage (free tier)
4. **Your Anthropic API key** — you already have this
5. **A Google Cloud account + Places API key** — only if you want the shipper
   review lookup. This is a *separate* key and a *separate* bill from
   Anthropic. Skip this step if you don't need it yet; everything else
   still works, the shipper lookup will just say it's not configured.
6. **Your domain** — from whatever registrar you bought it from

## Step 1 — Put this code on GitHub

1. Create a new (private is fine) repository on GitHub.
2. Upload every file in this project to it (GitHub's web uploader works —
   drag the whole unzipped folder in).

## Step 2 — Set up Supabase (your database)

1. Go to supabase.com → New project. Pick any name/region, set a database
   password (save it somewhere).
2. Once it's created, go to **SQL Editor → New query**, paste in the
   contents of `supabase-schema.sql` from this project, and click Run.
   This creates your `drivers` and `loads` tables.
3. Go to **Storage → New bucket**, name it exactly `rateconfs`, and toggle
   **Public bucket: ON** (this is what lets your PDF download links work).
4. Go to **Project Settings → API**. Copy two values — you'll need them in
   Step 4:
   - **Project URL** → this is `SUPABASE_URL`
   - **service_role key** (NOT the "anon" key — the secret one) →
     this is `SUPABASE_SERVICE_KEY`

## Step 3 — (Optional) Set up Google Places for shipper lookups

1. Go to console.cloud.google.com → create a project.
2. Enable the **"Places API (New)"**.
3. Create an API key under **Credentials**. Restrict it to the Places API
   for safety.
4. Google requires billing to be enabled on the project, but gives a
   recurring free monthly credit that comfortably covers light use —
   check their current pricing page before relying on an exact number.

## Step 4 — Deploy to Vercel

1. Go to vercel.com → **Add New → Project** → import the GitHub repo from
   Step 1.
2. Before clicking Deploy, open **Environment Variables** and add:
   - `ANTHROPIC_API_KEY` — your Anthropic key
   - `SUPABASE_URL` — from Step 2
   - `SUPABASE_SERVICE_KEY` — from Step 2
   - `GOOGLE_PLACES_API_KEY` — from Step 3, if you did it
3. Click **Deploy**. In about a minute you'll get a working link like
   `dispatch-hub-yourname.vercel.app` — test everything there first.

## Step 5 — Connect your own domain

1. In the Vercel project → **Settings → Domains** → add your domain or a
   subdomain (e.g. `dispatch.yourdomain.com`).
2. Vercel will show you a DNS record to add (usually a CNAME, sometimes an
   A record for a root domain).
3. Go to your domain registrar's dashboard → DNS settings → add exactly
   the record Vercel showed you.
4. Wait anywhere from a few minutes to a few hours for DNS to update.
   Vercel's domain page will show a green checkmark once it's live, and
   it issues your HTTPS certificate automatically — no extra cost there.

## Updating the app later

Change a file → push to GitHub → Vercel redeploys automatically within
about a minute. No manual re-upload needed after this first setup.

## Costs to expect (separate from each other)

- Domain: whatever you already paid your registrar (yearly)
- Vercel: free tier is enough for this scale
- Supabase: free tier is enough for this scale
- Anthropic API: pay-as-you-go, roughly $10-20/month at ~50 PDFs/day with
  Haiku (already set as the model in `api/extract.js`)
- Google Places: only if you turn it on; Google's free monthly credit
  likely covers light use, check Google's current pricing to be sure

## What's simpler now than the old artifact version

The old version had to fake PDF reading with page screenshots because the
artifact tool's AI couldn't accept images. This version sends your PDF
straight to Claude as a real document — no pdf.js, no page-rendering, no
"screenshot upload" fallback needed. Scanned PDFs just work now.
