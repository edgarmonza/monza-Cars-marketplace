"use client";

import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RedFlagsProps {
  redFlags: string[];
  className?: string;
}

// ---------------------------------------------------------------------------
// Severity helpers
// ---------------------------------------------------------------------------

function getSeverityStyles(index: number, total: number) {
  // First items are most critical - stronger red tints
  const ratio = total <= 1 ? 0 : index / (total - 1);

  if (ratio <= 0.33) {
    // High severity
    return {
      container:
        "bg-red-500/10 border-red-500/30 hover:bg-red-500/15",
      icon: "text-red-400",
      dot: "bg-red-400",
      label: "High",
      labelClass: "text-red-400 bg-red-500/15",
    };
  }
  if (ratio <= 0.66) {
    // Medium severity
    return {
      container:
        "bg-orange-500/8 border-orange-500/25 hover:bg-orange-500/12",
      icon: "text-orange-400",
      dot: "bg-orange-400",
      label: "Medium",
      labelClass: "text-orange-400 bg-orange-500/15",
    };
  }
  // Lower severity
  return {
    container:
      "bg-amber-500/6 border-amber-500/20 hover:bg-amber-500/10",
    icon: "text-amber-400",
    dot: "bg-amber-400",
    label: "Monitor",
    labelClass: "text-amber-400 bg-amber-500/15",
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RedFlags({ redFlags, className }: RedFlagsProps) {
  if (redFlags.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {redFlags.map((flag, i) => {
        const severity = getSeverityStyles(i, redFlags.length);

        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.25 }}
            className={cn(
              "flex items-start gap-3 rounded-md p-3 border transition-colors",
              severity.container
            )}
          >
            {/* Alert icon */}
            <AlertTriangle
              className={cn("size-4 mt-0.5 shrink-0", severity.icon)}
            />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-zinc-300 leading-relaxed">{flag}</p>
            </div>

            {/* Severity label */}
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                severity.labelClass
              )}
            >
              {severity.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
