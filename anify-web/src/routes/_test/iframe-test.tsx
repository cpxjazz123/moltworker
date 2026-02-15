import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_test/iframe-test")({
  component: IframeTestPage,
});

function IframeTestPage() {
  return (
    <div className="h-screen">
      <iframe
        className="w-full h-full"
        src="https://html-classic.itch.zone/html/14007573-1462251/index.html"
        title="Google"
      />
    </div>
  );
}
