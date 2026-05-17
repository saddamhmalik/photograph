import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-white/30 transition-colors focus-visible:border-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold",
        className
      )}
      ref={ref}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
