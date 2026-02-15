import { cva, type VariantProps } from "class-variance-authority";
import { motion, AnimatePresence } from "motion/react";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeDotVariants = cva(
  "absolute flex items-center justify-center rounded-full font-medium",
  {
    defaultVariants: {
      size: "default",
      variant: "default",
    },
    variants: {
      variant: {
        default: "bg-red-500 text-white",
        primary: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        success: "bg-green-500 text-white",
        warning: "bg-amber-500 text-white",
      },
      size: {
        sm: "min-w-3 h-3 text-[8px]",
        default: "min-w-4 h-4 text-[10px]",
        lg: "min-w-5 h-5 text-xs",
      },
    },
  },
);

const positionVariants = cva("", {
  defaultVariants: {
    position: "top-right",
  },
  variants: {
    position: {
      "top-right": "-top-1 -right-1",
      "top-left": "-top-1 -left-1",
      "bottom-right": "-bottom-1 -right-1",
      "bottom-left": "-bottom-1 -left-1",
    },
  },
});

export interface BadgeDotProps
  extends VariantProps<typeof badgeDotVariants>,
    VariantProps<typeof positionVariants> {
  className?: string;
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  pulse?: boolean;
}

function BadgeDot({
  className,
  variant,
  size,
  position,
  count,
  maxCount = 99,
  showZero = false,
  dot = false,
  pulse = false,
}: BadgeDotProps) {
  const showBadge = dot || (count !== undefined && (count > 0 || showZero));
  const displayCount = count !== undefined && count > maxCount ? `${maxCount}+` : count;

  if (!showBadge) return null;

  return (
    <AnimatePresence>
      <motion.span
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className={cn(
          badgeDotVariants({ variant, size }),
          positionVariants({ position }),
          dot && "!min-w-2 !h-2 !text-[0px]",
          !dot && count !== undefined && "px-1",
          className,
        )}
      >
        {!dot && displayCount}
        {pulse && (
          <motion.span
            className="absolute inset-0 rounded-full bg-inherit"
            initial={{ scale: 1, opacity: 0.7 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

export interface BadgeDotWrapperProps extends BadgeDotProps {
  children: React.ReactNode;
}

function BadgeDotWrapper({ children, ...badgeProps }: BadgeDotWrapperProps) {
  return (
    <span className="relative inline-flex">
      {children}
      <BadgeDot {...badgeProps} />
    </span>
  );
}

export { BadgeDot, BadgeDotWrapper, badgeDotVariants };
