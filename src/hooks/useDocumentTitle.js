import { useEffect } from "react";
import siteConfig from "../../site.config.js";

// A custom hook: a reusable piece of component logic. Functions whose names
// start with "use" can call other hooks (here, useEffect).
//
// Sets the browser tab's title, e.g. useDocumentTitle("Projects") shows
// "Projects | Ashutosh Ekade". Call it with no title for just the name.
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  }, [title]);
}
