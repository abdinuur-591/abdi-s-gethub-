-- Run this once in Supabase: Project > SQL Editor > New query > paste > Run

create table drivers (
  id uuid primary key default gen_random_uuid(),
  unit text,
  name text,
  phone text,
  truck_num text,
  cdl_url text,
  truck_photo_url text,
  off boolean default false,
  created_at timestamptz default now()
);

create table loads (
  id uuid primary key default gen_random_uuid(),
  driver_id uuid references drivers(id),
  load_number text,
  po_number text,
  broker_name text,
  broker_mc text,
  broker_contact text,
  carrier_mc text,
  carrier_dot text,
  truck_num text,
  trailer_num text,
  driver_phone text,
  pickup_address text,
  pickup_city text,
  pickup_zip text,
  pickup_date date,
  pickup_time text,
  delivery_address text,
  delivery_city text,
  delivery_zip text,
  delivery_date date,
  delivery_time text,
  rate_pay text,
  notes_or_penalties text,
  pdf_url text,
  filename text,
  shipper_reputation text,
  created_at timestamptz default now()
);

-- Create a public storage bucket for PDFs too:
-- Project > Storage > New bucket > name it "rateconfs" > Public bucket: ON
