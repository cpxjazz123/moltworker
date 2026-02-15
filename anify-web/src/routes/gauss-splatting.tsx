import { createFileRoute } from "@tanstack/react-router";

import { GaussSplattingBackground } from "../components/GaussSplattingBackground";

export const Route = createFileRoute("/gauss-splatting")({
  component: () => (
    <div style={{ background: "#000", height: "100vh", position: "relative", width: "100vw" }}>
      <GaussSplattingBackground />
      {/* Overriding zIndex for this specific route to ensure it's on top if needed, 
          though the component currently uses fixed with inset 0 and zIndex 0. 
          Actually, let's just use it as is. */}
    </div>
  ),
});
