"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export interface TextShimmerProps {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

export function TextShimmer({
  children,
  as: Component = "span",
  className,
  duration = 1.5,
}: TextShimmerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Comp = Component as React.ComponentType<{
      className?: string;
      children?: React.ReactNode;
    }>;
    return (
      <Comp className={cn("inline-block text-muted-foreground", className)}>
        {children}
      </Comp>
    );
  }

  return (
    <motion.span
      className={cn(
        "inline-block bg-size-[250%_100%] bg-clip-text text-transparent",
        "bg-linear-to-r from-muted-foreground via-foreground to-muted-foreground",
        className,
      )}
      animate={{
        backgroundPosition: ["100% 0%", "-100% 0%"],
      }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
    >
      {children}
    </motion.span>
  );
}

export default TextShimmer;
