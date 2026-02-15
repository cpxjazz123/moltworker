import {
  type CSSProperties,
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

// Displacement maps (base64 encoded)
import { displacementMap, polarDisplacementMap, prominentDisplacementMap } from "./liquid-glass-maps";
import { ShaderDisplacementGenerator, fragmentShaders } from "./liquid-glass-shader";

type DisplacementMode = "standard" | "polar" | "prominent" | "shader";

// Generate shader-based displacement map
const generateShaderDisplacementMap = (width: number, height: number): string => {
  const generator = new ShaderDisplacementGenerator({
    width,
    height,
    fragment: fragmentShaders.liquidGlass,
  });

  const dataUrl = generator.updateShader();
  generator.destroy();

  return dataUrl;
};

const getMap = (mode: DisplacementMode, shaderMapUrl?: string) => {
  switch (mode) {
    case "standard":
      return displacementMap;
    case "polar":
      return polarDisplacementMap;
    case "prominent":
      return prominentDisplacementMap;
    case "shader":
      return shaderMapUrl || displacementMap;
    default:
      throw new Error(`Invalid mode: ${mode}`);
  }
};

/* ---------- SVG filter (edge-only displacement) ---------- */
interface GlassFilterProps {
  id: string;
  displacementScale: number;
  aberrationIntensity: number;
  mode: DisplacementMode;
  shaderMapUrl?: string;
}

const GlassFilter: React.FC<GlassFilterProps> = ({
  id,
  displacementScale,
  aberrationIntensity,
  mode,
  shaderMapUrl,
}) => (
  <svg style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }} aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-edge-mask`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="black" stopOpacity="0" />
        <stop offset={`${Math.max(30, 80 - aberrationIntensity * 2)}%`} stopColor="black" stopOpacity="0" />
        <stop offset="100%" stopColor="white" stopOpacity="1" />
      </radialGradient>
      <filter id={id} x="-35%" y="-35%" width="170%" height="170%" colorInterpolationFilters="sRGB">
        <feImage
          id="feimage"
          x="0"
          y="0"
          width="100%"
          height="100%"
          result="DISPLACEMENT_MAP"
          href={getMap(mode, shaderMapUrl)}
          preserveAspectRatio="xMidYMid slice"
        />

        {/* Create edge mask using the displacement map itself */}
        <feColorMatrix
          in="DISPLACEMENT_MAP"
          type="matrix"
          values="0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0.3 0.3 0.3 0 0
                 0 0 0 1 0"
          result="EDGE_INTENSITY"
        />
        <feComponentTransfer in="EDGE_INTENSITY" result="EDGE_MASK">
          <feFuncA type="discrete" tableValues={`0 ${aberrationIntensity * 0.05} 1`} />
        </feComponentTransfer>

        {/* Original undisplaced image for center */}
        <feOffset in="SourceGraphic" dx="0" dy="0" result="CENTER_ORIGINAL" />

        {/* Red channel displacement with slight offset */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * (mode === "shader" ? 1 : -1)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="RED_DISPLACED"
        />
        <feColorMatrix
          in="RED_DISPLACED"
          type="matrix"
          values="1 0 0 0 0
                 0 0 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="RED_CHANNEL"
        />

        {/* Green channel displacement */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.05)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="GREEN_DISPLACED"
        />
        <feColorMatrix
          in="GREEN_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 1 0 0 0
                 0 0 0 0 0
                 0 0 0 1 0"
          result="GREEN_CHANNEL"
        />

        {/* Blue channel displacement with slight offset */}
        <feDisplacementMap
          in="SourceGraphic"
          in2="DISPLACEMENT_MAP"
          scale={displacementScale * ((mode === "shader" ? 1 : -1) - aberrationIntensity * 0.1)}
          xChannelSelector="R"
          yChannelSelector="B"
          result="BLUE_DISPLACED"
        />
        <feColorMatrix
          in="BLUE_DISPLACED"
          type="matrix"
          values="0 0 0 0 0
                 0 0 0 0 0
                 0 0 1 0 0
                 0 0 0 1 0"
          result="BLUE_CHANNEL"
        />

        {/* Combine all channels with screen blend mode for chromatic aberration */}
        <feBlend in="GREEN_CHANNEL" in2="BLUE_CHANNEL" mode="screen" result="GB_COMBINED" />
        <feBlend in="RED_CHANNEL" in2="GB_COMBINED" mode="screen" result="RGB_COMBINED" />

        {/* Add slight blur to soften the aberration effect */}
        <feGaussianBlur in="RGB_COMBINED" stdDeviation={Math.max(0.1, 0.5 - aberrationIntensity * 0.1)} result="ABERRATED_BLURRED" />

        {/* Apply edge mask to aberration effect */}
        <feComposite in="ABERRATED_BLURRED" in2="EDGE_MASK" operator="in" result="EDGE_ABERRATION" />

        {/* Create inverted mask for center */}
        <feComponentTransfer in="EDGE_MASK" result="INVERTED_MASK">
          <feFuncA type="table" tableValues="1 0" />
        </feComponentTransfer>
        <feComposite in="CENTER_ORIGINAL" in2="INVERTED_MASK" operator="in" result="CENTER_CLEAN" />

        {/* Combine edge aberration with clean center */}
        <feComposite in="EDGE_ABERRATION" in2="CENTER_CLEAN" operator="over" />
      </filter>
    </defs>
  </svg>
);

/* ---------- Main LiquidGlass component ---------- */
export interface LiquidGlassProps {
  children: ReactNode;
  displacementScale?: number;
  aberrationIntensity?: number;
  cornerRadius?: number;
  className?: string;
  padding?: string;
  style?: CSSProperties;
  mode?: DisplacementMode;
  onClick?: () => void;
  /**
   * Background color for the glass effect.
   * Default: "rgba(255, 255, 255, 0.06)"
   */
  backgroundColor?: string;
  /**
   * Backdrop blur amount in pixels.
   * Default: 6
   */
  blurAmount?: number;
  /**
   * HTML id attribute for the element.
   */
  id?: string;
  /**
   * When true, inner content expands to fill the container width.
   * Default: false
   */
  fullWidth?: boolean;
}

export const LiquidGlass = forwardRef<HTMLDivElement, LiquidGlassProps>(
  (
    {
      children,
      displacementScale = 70,
      aberrationIntensity = 2,
      cornerRadius = 999,
      className = "",
      padding = "24px 32px",
      style = {},
      mode = "standard",
      onClick,
      backgroundColor = "rgba(255, 255, 255, 0.06)",
      blurAmount = 6,
      id,
      fullWidth = false,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const filterId = useId();
    const [isHovered, setIsHovered] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const isTouchDevice = useRef(false);
    const [glassSize, setGlassSize] = useState({ width: 270, height: 69 });
    const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
    const [shaderMapUrl, setShaderMapUrl] = useState<string>("");

    // Generate shader displacement map when in shader mode
    useEffect(() => {
      if (mode === "shader") {
        const url = generateShaderDisplacementMap(glassSize.width, glassSize.height);
        setShaderMapUrl(url);
      }
    }, [mode, glassSize.width, glassSize.height]);

    // Internal mouse tracking
    const handleMouseMove = useCallback((e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      setMouseOffset({
        x: ((e.clientX - centerX) / rect.width) * 100,
        y: ((e.clientY - centerY) / rect.height) * 100,
      });
    }, []);

    // Set up mouse tracking
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove]);

    // Update glass size
    useEffect(() => {
      const updateGlassSize = () => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setGlassSize({ width: rect.width, height: rect.height });
        }
      };

      updateGlassSize();
      window.addEventListener("resize", updateGlassSize);
      return () => window.removeEventListener("resize", updateGlassSize);
    }, []);

    const borderGradient = `linear-gradient(
      ${135 + mouseOffset.x * 1.2}deg,
      rgba(255, 255, 255, 0.0) 0%,
      rgba(255, 255, 255, ${0.12 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,
      rgba(255, 255, 255, ${0.4 + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,
      rgba(255, 255, 255, 0.0) 100%
    )`;

    const borderGradient2 = `linear-gradient(
      ${135 + mouseOffset.x * 1.2}deg,
      rgba(255, 255, 255, 0.0) 0%,
      rgba(255, 255, 255, ${0.32 + Math.abs(mouseOffset.x) * 0.008}) ${Math.max(10, 33 + mouseOffset.y * 0.3)}%,
      rgba(255, 255, 255, ${0.6 + Math.abs(mouseOffset.x) * 0.012}) ${Math.min(90, 66 + mouseOffset.y * 0.4)}%,
      rgba(255, 255, 255, 0.0) 100%
    )`;

    return (
      <div
        id={id}
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={`${className} ${Boolean(onClick) ? "cursor-pointer" : ""}`}
        style={{
          ...style,
          position: "relative",
          display: "inline-block",
          borderRadius: `${cornerRadius}px`,
          // IMPORTANT: backdrop-filter must be on the container itself, not on a child element.
          // When backdrop-filter is on an absolutely-positioned child span, Chrome fails to
          // blur WebGL canvas content (e.g., Gaussian Splatting background). Safari works either way.
          // Keeping it on the container (like Dock component) ensures cross-browser compatibility.
          backgroundColor,
          ...(blurAmount > 0 && {
            backdropFilter: `blur(${blurAmount}px)`,
            WebkitBackdropFilter: `blur(${blurAmount}px)`,
          }),
        }}
        onClick={onClick}
        onMouseEnter={() => {
          // Only apply hover on non-touch devices
          if (!isTouchDevice.current) {
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsActive(false);
        }}
        onMouseDown={() => {
          if (!isTouchDevice.current) {
            setIsActive(true);
          }
        }}
        onMouseUp={() => setIsActive(false)}
        onTouchStart={() => {
          isTouchDevice.current = true;
          setIsActive(true);
        }}
        onTouchEnd={() => {
          setIsActive(false);
          setIsHovered(false);
        }}
        onTouchCancel={() => {
          setIsActive(false);
          setIsHovered(false);
        }}
      >
        {/* SVG Filter for displacement effects */}
        <GlassFilter
          id={filterId}
          displacementScale={displacementScale}
          aberrationIntensity={aberrationIntensity}
          mode={mode}
          shaderMapUrl={shaderMapUrl}
        />

        {/* Border layer 1 - stable position, only gradient changes with mouse */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: `${cornerRadius}px`,
            pointerEvents: "none",
            mixBlendMode: "screen",
            opacity: 0.2,
            padding: "1.5px",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: borderGradient,
            transition: "background 0.15s ease-out",
          }}
        />

        {/* Border layer 2 - stable position, only gradient changes with mouse */}
        <span
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: `${cornerRadius}px`,
            pointerEvents: "none",
            mixBlendMode: "overlay",
            padding: "1.5px",
            WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            boxShadow: "0 0 0 0.5px rgba(255, 255, 255, 0.5) inset, 0 1px 3px rgba(255, 255, 255, 0.25) inset, 0 1px 4px rgba(0, 0, 0, 0.35)",
            background: borderGradient2,
            transition: "background 0.15s ease-out",
          }}
        />

        {/* Hover effects - stable position */}
        {Boolean(onClick) && (
          <>
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: `${cornerRadius}px`,
                pointerEvents: "none",
                transition: "all 0.2s ease-out",
                opacity: isHovered || isActive ? 0.5 : 0,
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 50%)",
                mixBlendMode: "overlay",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: `${cornerRadius}px`,
                pointerEvents: "none",
                transition: "all 0.2s ease-out",
                opacity: isActive ? 0.5 : 0,
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 80%)",
                mixBlendMode: "overlay",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: `${cornerRadius}px`,
                pointerEvents: "none",
                transition: "all 0.2s ease-out",
                opacity: isHovered ? 0.4 : isActive ? 0.8 : 0,
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)",
                mixBlendMode: "overlay",
              }}
            />
          </>
        )}

        {/* Glass body - contains user content, NOT affected by transform */}
        <div
          className="glass"
          style={{
            borderRadius: `${cornerRadius}px`,
            position: "relative",
            display: fullWidth ? "flex" : "inline-flex",
            alignItems: "center",
            justifyContent: fullWidth ? "center" : undefined,
            gap: "24px",
            padding,
            overflow: "hidden",
            transition: "all 0.2s ease-in-out",
            width: fullWidth ? "100%" : undefined,
          }}
        >
          {/* User content */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              font: "500 20px/1 system-ui",
              color: "white",
              textShadow: "0px 2px 12px rgba(0, 0, 0, 0.4)",
              transition: "all 0.15s ease-in-out",
              width: fullWidth ? "100%" : undefined,
              display: fullWidth ? "flex" : undefined,
              justifyContent: fullWidth ? "center" : undefined,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

LiquidGlass.displayName = "LiquidGlass";

export default LiquidGlass;
