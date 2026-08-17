import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";
import { modeAccents } from "@/lib/mockData";
import ConditionCard from "@/components/dashboard/ConditionCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

export default function ConditionsPanel({ locationData }) {
  const { mode, status } = locationData;
  const accent = modeAccents[mode];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-stone-400" />
          <h2 className="text-sm font-semibold tracking-[0.15em] uppercase text-stone-500">
            Live Conditions
          </h2>
        </div>
        <StatusBadge label={status.label} emoji={status.emoji} mode={mode} />
      </div>

      {status.description && (
        <p className="text-sm text-stone-500 leading-relaxed">{status.description}</p>
      )}

      {locationData.conditionGroups ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locationData.conditionGroups.map((group, gi) => (
            <div key={group.label} className="space-y-3">
              <div>
                <h3 className="font-heading text-base font-medium text-stone-800">{group.label}</h3>
                <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-stone-400">
                  {group.subtitle}
                </p>
              </div>
              <div className="space-y-3">
                {group.conditions.map((item, i) => (
                  <ConditionCard
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    unit={item.unit}
                    index={gi * 3 + i}
                    mode={mode}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {Object.values(locationData.conditions).map((item, i) => (
            <ConditionCard
              key={item.label}
              label={item.label}
              value={item.value}
              unit={item.unit}
              index={i}
              mode={mode}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}