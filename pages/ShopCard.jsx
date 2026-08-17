import React from "react";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, ArrowUpRight } from "lucide-react";
import { modeAccents } from "@/lib/mockData";
import { createBooking } from "@/lib/localStore";
import { useToast } from "@/components/ui/use-toast";

export default function ShopCard({ shop, index, mode, destination }) {
  const accent = modeAccents[mode];
  const { toast } = useToast();

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-2xl p-5 transition-all duration-400 overflow-hidden bg-white border border-stone-200/60"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.03)" }}
      whileHover={{ y: -2 }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: `radial-gradient(circle at 100% 0%, ${accent}0a, transparent 60%)` }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-stone-900 font-semibold text-sm tracking-tight truncate">{shop.name}</h3>
            <p className="text-stone-400 text-xs mt-0.5">{shop.type}</p>
          </div>
          <span className="text-xs font-semibold text-stone-300 ml-2 shrink-0">{shop.priceRange}</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: `${accent}12` }}>
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-stone-700 tabular-nums">{shop.rating}</span>
          </div>
          <span className="text-xs text-stone-400">{shop.reviews} reviews</span>
        </div>

        <div className="space-y-1.5 mb-4">
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span className="truncate">{shop.address}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-500">
            <Phone className="w-3.5 h-3.5 shrink-0 opacity-60" />
            <span>{shop.phone}</span>
          </div>
        </div>

        <button
          onClick={async () => {
            if (!destination) return;
            await createBooking({ destination, shop, mode });
            toast({
              title: "Booking confirmed.",
              description: shop.name,
              duration: 2000,
            });
          }}
          className="group/btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold tracking-[0.1em] uppercase transition-all duration-300"
          style={{
            background: `${accent}10`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          Book Now
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </button>
      </div>
    </motion.div>
  );
}