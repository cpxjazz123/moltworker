import { cva, type VariantProps } from "class-variance-authority";
import { motion, type MotionProps, type MotionValue, useMotionValue, useSpring, useTransform } from "motion/react";
import React, { type PropsWithChildren, useRef } from "react";

import { cn } from "../../lib/utils";

export interface DockProps extends VariantProps<typeof dockVariants> {
  children: React.ReactNode;
  className?: string;
  direction?: "bottom" | "middle" | "top";
  disableMagnification?: boolean;
  iconDistance?: number;
  iconMagnification?: number;
  iconSize?: number;
}

const DEFAULT_SIZE = 40;
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_DISABLEMAGNIFICATION = false;

const dockVariants = cva(
  "relative mx-auto mt-8 flex h-[58px] w-max items-center justify-center gap-2 rounded-2xl p-2 gap-6 md:gap-12 lg:gap-16  bg-white/[0.06] dark:bg-white/[0.06] backdrop-blur-[6px]",
);

const borderStyle: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  padding: "1.5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 33%, rgba(255,255,255,0.4) 66%, rgba(255,255,255,0) 100%)",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  pointerEvents: "none",
  mixBlendMode: "screen",
  opacity: 0.2,
};

const borderStyle2: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  borderRadius: "inherit",
  padding: "1.5px",
  background:
    "linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.32) 33%, rgba(255,255,255,0.6) 66%, rgba(255,255,255,0) 100%)",
  mask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  maskComposite: "exclude",
  WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
  WebkitMaskComposite: "xor",
  pointerEvents: "none",
  mixBlendMode: "overlay",
};

const Dock = React.forwardRef<HTMLDivElement, DockProps>(
  (
    {
      children,
      className,
      direction = "middle",
      disableMagnification = DEFAULT_DISABLEMAGNIFICATION,
      iconDistance = DEFAULT_DISTANCE,
      iconMagnification = DEFAULT_MAGNIFICATION,
      iconSize = DEFAULT_SIZE,
      ...props
    },
    ref,
  ) => {
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () =>
      React.Children.map(children, (child) => {
        if (React.isValidElement<DockIconProps>(child) && child.type === DockIcon) {
          return React.cloneElement(child, {
            ...child.props,
            disableMagnification,
            distance: iconDistance,
            magnification: iconMagnification,
            mouseX,
            size: iconSize,
          });
        }

        return child;
      });

    return (
      <motion.div
        onMouseLeave={() => mouseX.set(Infinity)}
        onMouseMove={(e) => mouseX.set(e.pageX)}
        ref={ref}
        {...props}
        className={cn(dockVariants({ className }), {
          "items-center": direction === "middle",
          "items-end": direction === "bottom",
          "items-start": direction === "top",
        })}
      >
        <span style={borderStyle} />
        <span style={borderStyle2} />
        {renderChildren()}
      </motion.div>
    );
  },
);

Dock.displayName = "Dock";

export interface DockIconProps extends Omit<MotionProps & React.HTMLAttributes<HTMLDivElement>, "children"> {
  children?: React.ReactNode;
  className?: string;
  disableMagnification?: boolean;
  distance?: number;
  magnification?: number;
  mouseX?: MotionValue<number>;
  props?: PropsWithChildren;
  size?: number;
}

const DockIcon = ({
  children,
  className,
  disableMagnification,
  distance = DEFAULT_DISTANCE,
  magnification = DEFAULT_MAGNIFICATION,
  mouseX,
  size = DEFAULT_SIZE,
  ...props
}: DockIconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const padding = Math.max(6, size * 0.2);
  const defaultMouseX = useMotionValue(Infinity);

  const distanceCalc = useTransform(mouseX ?? defaultMouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { width: 0, x: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const targetSize = disableMagnification ? size : magnification;

  const sizeTransform = useTransform(distanceCalc, [-distance, 0, distance], [size, targetSize, size]);

  const scaleSize = useSpring(sizeTransform, {
    damping: 12,
    mass: 0.1,
    stiffness: 150,
  });

  return (
    <motion.div
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        disableMagnification && "hover:bg-muted-foreground transition-colors",
        className,
      )}
      ref={ref}
      style={{ height: scaleSize, padding, width: scaleSize }}
      {...props}
    >
      <div>{children}</div>
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";

export { Dock, DockIcon, dockVariants };
