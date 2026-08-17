const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Percent, TrendingUp, Trash2, Receipt, Calendar } from "lucide-react";
import { modeAccents, modeLabels } from "@/lib/mockData";
import {
  getBookings,
  deleteBooking,
  getCommissionLedger,
  getCommissionSummary,
  subscribeToBookings,
} from "@/lib/localStore";

const fmtMoney = (n) =>
  n != null
    ? `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : "—";

const fmtDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "—";
  }
};

export default function BookingsLedger({ mode }) {
  const [bookings, setBookings] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({ count: 0, total: 0, gross: 0, net: 0 });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const accent = modeAccents[mode];

  const refresh = async () => {
    setLoading(true);
    const [modeBookings, modeLedger] = await Promise.all([
      getBookings(mode),
      getCommissionLedger(mode),
    ]);
    setBookings(modeBookings);
    setLedger(modeLedger);
    setSummary(getCommissionSummary(modeLedger));
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [mode]);

  useEffect(() => {
    const unsubscribe = subscribeToBookings(() => refresh());
    return unsubscribe;
  }, [mode]);

  useEffect(() => {
    db.auth
      .me()
      .then((user) => setIsAdmin(user?.role === "admin"))
      .catch(() => setIsAdmin(false));
  }, []);

  const handleDelete = async (id) => {
    await deleteBooking(id);
    refresh();
  };

  return (
    <div className="space-y-10">
      {/* Commission Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isAdmin && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 bg-white border border-stone-200/60"
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${accent}12` }}>
              <Percent className="w-3.5 h-3.5" style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">Platform Commission</span>
          </div>
          <p className="text-2xl font-heading font-medium text-stone-900 tabular-nums">{fmtMoney(summary.total)}</p>
          <p className="text-xs text-stone-400 mt-1">{(0.15 * 100).toFixed(0)}% of gross bookings</p>
        </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={`rounded-2xl p-5 bg-white border border-stone-200/60 ${isAdmin ? "" : "md:col-span-2"}`}
          style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-stone-100">
              <TrendingUp className="w-3.5 h-3.5 text-stone-500" />
            </div>
            <span className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">{isAdmin ? "Gross Bookings" : "Total Spent"}</span>
          </div>
          <p className="text-2xl font-heading font-medium text-stone-900 tabular-nums">{fmtMoney(summary.gross)}</p>
          <p className="text-xs text-stone-400 mt-1">{summary.count} active booking{summary.count !== 1 ? "s" : ""}</p>
        </motion.div>

      </div>

      {/* Active Bookings */}
      <div className="rounded-2xl bg-white border border-stone-200/60 p-6 md:p-8" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <Calendar className="w-4 h-4 text-stone-400" />
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">Active Bookings · {modeLabels[mode]}</h3>
        </div>

        {loading ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-400">Loading bookings…</p>
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-400">No active bookings yet.</p>
            <p className="text-xs text-stone-300 mt-1">Book a rental from any destination dashboard to see it here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {bookings.map((b, i) => (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  className="flex items-center justify-between gap-4 rounded-xl border border-stone-100 bg-stone-50/40 px-4 py-3.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-stone-800 truncate">{b.shop_name}</p>
                    <p className="text-xs text-stone-400 truncate mt-0.5">
                      {b.destination} · {b.shop_type}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-stone-700 tabular-nums">{fmtMoney(b.total_price)}</p>
                    <p className="text-[10px] text-stone-400 mt-0.5">{fmtDate(b.created_date)}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-stone-300 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {isAdmin && (
      <>
      {/* Commission Ledger */}
      <div className="rounded-2xl bg-white border border-stone-200/60 p-6 md:p-8" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}>
        <div className="flex items-center gap-2.5 mb-5">
          <Receipt className="w-4 h-4 text-stone-400" />
          <h3 className="text-xs font-semibold tracking-[0.15em] uppercase text-stone-500">Commission Ledger · 15% Split</h3>
        </div>

        {ledger.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-400">No commission entries recorded.</p>
          </div>
        ) : (
          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-semibold tracking-[0.1em] uppercase text-stone-400 border-b border-stone-100">
                  <th className="px-2 py-2.5 font-semibold">Shop</th>
                  <th className="px-2 py-2.5 font-semibold">Destination</th>
                  <th className="px-2 py-2.5 font-semibold text-right">Gross</th>
                  <th className="px-2 py-2.5 font-semibold text-right">Commission</th>
                  <th className="px-2 py-2.5 font-semibold text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((e, i) => (
                  <tr key={e.id} className="border-b border-stone-50 last:border-0">
                    <td className="px-2 py-3 text-stone-700 font-medium">{e.shop_name}</td>
                    <td className="px-2 py-3 text-stone-400 text-xs">{e.destination}</td>
                    <td className="px-2 py-3 text-right tabular-nums text-stone-600">{fmtMoney(e.gross_amount)}</td>
                    <td className="px-2 py-3 text-right tabular-nums font-semibold" style={{ color: accent }}>
                      {fmtMoney(e.commission_amount)}
                    </td>
                    <td className="px-2 py-3 text-right tabular-nums text-stone-600">{fmtMoney(e.net_amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      </>
      )}
    </div>
  );
}