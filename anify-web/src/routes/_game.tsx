import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_game")({
  component: GameLayout,
});

function GameLayout() {
  return (
    <div className="game-layout">
      <Outlet />
    </div>
  );
}
