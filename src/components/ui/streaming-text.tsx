"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export interface StreamingTextProps {
  children?: React.ReactNode;
  className?: string;
  cursor?: boolean;
}

export function StreamingText({
  children,
  className,
  cursor = true,
}: StreamingTextProps) {
  return (
    <span className={cn("inline text-foreground", className)}>
      {children}
      {cursor && (
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            repeat: Infinity,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 rounded-xs bg-primary align-baseline"
        />
      )}
    </span>
  );
}

export default StreamingText;
