const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

// Supabase-backed persistence layer
// Replaces localStorage mock with persistent multi-user storage + real-time sync.
// Tables: bookings, commission_entries  (see src/lib/supabase-schema.sql)

import { supabase } from "@/lib/supabaseClient";

// --- Platform Commission Rate ---
export const COMMISSION_RATE = 0.15;

// --- Current Base44 user ID (for multi-user row filtering) ---
const getCurrentUserId = async () => {
  try {
    const user = await db.auth.me();
    return user?.id || null;
  } catch {
    return null;
  }
};

// --- Price helper ---
const priceForRange = (range) => {
  const map = { $: 45, $$: 120, $$$: 280, Free: 0, "": 100 };
  return map[range] ?? 100;
};

// --- Bookings ---

export const getBookings = async (mode) => {
  const userId = await getCurrentUserId();
  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_date", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  if (mode) query = query.eq("mode", mode);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const createBooking = async ({ destination, shop, mode }) => {
  const userId = await getCurrentUserId();
  const total_price = priceForRange(shop.priceRange);

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      destination,
      shop_name: shop.name,
      shop_type: shop.type,
      price_range: shop.priceRange,
      rating: shop.rating,
      mode,
      total_price,
      status: "confirmed",
      user_id: userId,
    })
    .select()
    .single();
  if (error) throw error;

  // Auto-record the 15% platform commission entry
  const commission_amount = +(total_price * COMMISSION_RATE).toFixed(2);
  const { data: commission, error: commissionError } = await supabase
    .from("commission_entries")
    .insert({
      booking_id: booking.id,
      destination,
      shop_name: shop.name,
      mode,
      gross_amount: total_price,
      commission_rate: COMMISSION_RATE,
      commission_amount,
      net_amount: +(total_price - commission_amount).toFixed(2),
      status: "recorded",
      user_id: userId,
    })
    .select()
    .single();
  if (commissionError) throw commissionError;

  return { booking, commission };
};

export const deleteBooking = async (id) => {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw error;
};

// --- Commission Ledger ---

export const getCommissionLedger = async (mode) => {
  const userId = await getCurrentUserId();
  let query = supabase
    .from("commission_entries")
    .select("*")
    .order("created_date", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  if (mode) query = query.eq("mode", mode);
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
};

export const getCommissionSummary = (ledger = []) => {
  const total = ledger.reduce((s, e) => s + e.commission_amount, 0);
  const gross = ledger.reduce((s, e) => s + e.gross_amount, 0);
  const net = ledger.reduce((s, e) => s + e.net_amount, 0);
  return {
    count: ledger.length,
    total: +total.toFixed(2),
    gross: +gross.toFixed(2),
    net: +net.toFixed(2),
  };
};

// --- Real-time subscriptions ---

export const subscribeToBookings = (callback) => {
  const channel = supabase
    .channel("bookings-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "bookings" },
      callback
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "commission_entries" },
      callback
    )
    .subscribe();
  return () => supabase.removeChannel(channel);
};