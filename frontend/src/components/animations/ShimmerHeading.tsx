"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ShimmerHeadingProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3";
}

export function ShimmerHeading({
  children,
  className,
  as: Tag = "h2",
}: ShimmerHeadingProps) {
  return (
    <Tag className={cn("relative inline-block", className)}>
      <motion.span
        className="block shimmer-text font-display font-light"
        initial={{ opacity: 0, y: 32, filter: "blur(14px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
