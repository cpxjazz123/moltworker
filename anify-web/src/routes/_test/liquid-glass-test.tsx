import { createFileRoute } from "@tanstack/react-router";

import { GaussSplattingBackground } from "@/components/GaussSplattingBackground";
import { LiquidGlass } from "@/components/ui/liquid-glass";

export const Route = createFileRoute("/_test/liquid-glass-test")({
  component: LiquidGlassTest,
});

function LiquidGlassTest() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
      }}
    >
      <GaussSplattingBackground />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "40px",
        }}
      >
      {/* Button style */}
      <LiquidGlass
        displacementScale={64}
        aberrationIntensity={2}
        cornerRadius={100}
        padding="8px 16px"
        backgroundColor="rgba(255, 255, 255, 0.2)"
        onClick={() => console.log("Button clicked!")}
      >
        <span className="font-medium text-white">Click Me</span>
      </LiquidGlass>

      {/* Card style */}
      <LiquidGlass cornerRadius={24} padding="24px 32px">
        <div>
          <h2 className="text-xl font-bold">Your content here</h2>
          <p className="text-white/80">This will have the liquid glass effect</p>
        </div>
      </LiquidGlass>

      {/* Pure CSS baseline test - no LiquidGlass */}
      <div
        style={{
          padding: "24px 32px",
          borderRadius: "24px",
          backgroundColor: "rgba(255, 255, 255, 0.06)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          color: "white",
        }}
      >
        <h2 className="text-xl font-bold">Pure CSS Test</h2>
        <p className="text-white/80">No LiquidGlass - just backdrop-filter</p>
      </div>
      </div>
    </div>
  );
}
