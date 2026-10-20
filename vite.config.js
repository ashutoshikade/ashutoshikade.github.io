import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import siteConfig from "./site.config.js";

// Adds the <title> and link-preview <meta> tags to index.html using the values
// in site.config.js. They have to be in the HTML file itself (not added later
// by React) because LinkedIn, X and Slack read the raw HTML without running
// any JavaScript when they build a link preview.
function siteMetaTags() {
  const { name, description, url } = siteConfig;
  const meta = (attrs) => ({ tag: "meta", attrs, injectTo: "head" });

  return {
    name: "site-meta-tags",
    transformIndexHtml() {
      return [
        { tag: "title", children: name, injectTo: "head-prepend" },
        meta({ name: "description", content: description }),
        meta({ property: "og:type", content: "website" }),
        meta({ property: "og:title", content: name }),
        meta({ property: "og:description", content: description }),
        meta({ property: "og:url", content: url }),
        meta({ property: "og:image", content: `${url}/og-image.jpg` }),
        meta({ name: "twitter:card", content: "summary_large_image" }),
      ];
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), siteMetaTags()],
});
