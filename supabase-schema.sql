-- Slope, Swell & Stride AI — Supabase schema
-- Run this in the Supabase SQL Editor to create the required tables.

-- ─── Bookings ───
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  destination   TEXT,
  shop_name     TEXT,
  shop_type     TEXT,
  price_range   TEXT,
  rating        NUMERIC,
  mode          TEXT,
  total_price   NUMERIC,
  status        TEXT DEFAULT 'confirmed',
  user_id       TEXT,
  created_date  TIMESTAMPTZ DEFAULT now()
);

-- ─── Commission Entries (15% platform take) ───
CREATE TABLE IF NOT EXISTS commission_entries (
  id                 UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id         UUID REFERENCES bookings(id) ON DELETE CASCADE,
  destination        TEXT,
  shop_name          TEXT,
  mode               TEXT,
  gross_amount       NUMERIC,
  commission_rate    NUMERIC,
  commission_amount  NUMERIC,
  net_amount         NUMERIC,
  status             TEXT DEFAULT 'recorded',
  user_id            TEXT,
  created_date       TIMESTAMPTZ DEFAULT now()
);

-- ─── Row Level Security ───
-- Permissive policies for anon access; client filters by user_id.
-- Tighten these once Supabase Auth is wired up.
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon all bookings" ON bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "anon all commission" ON commission_entries FOR ALL USING (true) WITH CHECK (true);

-- ─── Real-time ───
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE commission_entries;