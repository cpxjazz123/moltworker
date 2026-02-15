import "./index.css";
import "./firebase";

import microWeb from "@a1exsun/micro-web";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import the route tree
import { routeTree } from "./routeTree.gen";

// Create the router
const router = createRouter({ routeTree });

microWeb.start({
  tagName: "micro-web",
});

// Register the router for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- root element always exists in index.html
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
