import "react";

declare module "react" {
  interface IntrinsicElements {
    "micro-web": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        name?: string;
        url?: string;
      },
      HTMLElement
    >;
  }
}
