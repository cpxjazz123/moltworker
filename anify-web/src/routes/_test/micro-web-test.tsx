import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_test/micro-web-test")({
  component: MicroWebTestPage,
});

function MicroWebTestPage() {
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: '<micro-web keep-alive name="my-app" url="https://www.spacex.com/"></micro-web>',
      }}
    />
  );
}
