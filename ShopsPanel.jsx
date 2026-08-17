import React from "react";
import { motion } from "framer-motion";
import { Store } from "lucide-react";
import { modeAccents } from "@/lib/mockData";
import ShopCard from "@/components/dashboard/ShopCard";

export default function ShopsPanel({ locationData, destinationName }) {
  const { mode } = locationData;
  const accent = modeAccents[mode];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center gap-2.5">
        <Store className="w-4 h-4 text-stone-400" />
        <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-stone-500">
          Local Gear & Rentals
        </h2>
      </div>

      {locationData.shopCategories ? (
        <div className="space-y-6">
          {locationData.shopCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="font-heading text-base font-medium text-stone-800 border-l-2 pl-3" style={{ borderColor: accent }}>
                {category.title}
              </h3>
              <div className="space-y-3">
                {category.shops.map((shop, i) => (
                  <ShopCard key={shop.name} shop={shop} index={i} mode={mode} destination={destinationName} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {locationData.shops.map((shop, i) => (
            <ShopCard key={shop.name} shop={shop} index={i} mode={mode} destination={destinationName} />
          ))}
        </div>
      )}
    </motion.div>
  );
}