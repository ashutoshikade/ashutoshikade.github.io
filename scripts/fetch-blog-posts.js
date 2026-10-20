// Reads the blog's RSS feed (Substack, Medium, ...) and saves the latest posts
// to src/generated/blog-posts.json, which the Blog page imports.
//
// Why not fetch the feed from the browser? Substack and Medium don't allow
// other websites to read their feeds from the browser (no CORS headers), so
// we read it here, at build time, where that rule doesn't apply.
//
// This runs automatically before `npm run dev` and `npm run build` (see
// "predev" and "prebuild" in package.json). On GitHub, the deploy workflow
// also runs every few hours, which is how new posts reach the site without
// anyone pushing code.

import { mkdir, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import siteConfig from "../site.config.js";

const OUTPUT_FILE = new URL("../src/generated/blog-posts.json", import.meta.url);
const { feedUrl, maxPosts } = siteConfig.blog;

async function fetchPosts() {
  const response = await fetch(feedUrl, {
    headers: { "User-Agent": `${siteConfig.url} blog feed reader` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const parser = new XMLParser({ ignoreAttributes: false, parseTagValue: false, htmlEntities: true });
  const feed = parser.parse(await response.text());
  // A feed with a single post gives an object instead of an array; [x].flat() handles both.
  const items = [feed.rss?.channel?.item ?? []].flat();

  return items.map(toPost).filter(Boolean).slice(0, maxPosts);
}

// Turns one RSS <item> into the shape the Blog page expects.
function toPost(item) {
  const url = textOf(item.link);
  if (!url.startsWith("https://")) return null;

  const date = new Date(textOf(item.pubDate));
  return {
    title: textOf(item.title),
    // Substack puts the subtitle in <description>; Medium has none, so use the start of the post.
    subtitle: textOf(item.description) || excerpt(textOf(item["content:encoded"])),
    url,
    date: Number.isNaN(date.getTime()) ? null : date.toISOString(),
    image: item.enclosure?.["@_url"] ?? null,
  };
}

// Feed values can be plain strings or objects like { "#text": "...", "@_attr": "..." }.
function textOf(value) {
  if (value == null) return "";
  const text = typeof value === "object" ? (value["#text"] ?? "") : String(value);
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function excerpt(text, maxLength = 200) {
  if (text.length <= maxLength) return text;
  return text.slice(0, text.lastIndexOf(" ", maxLength)) + "…";
}

let posts = [];
if (feedUrl) {
  try {
    posts = await fetchPosts();
    console.log(`Fetched ${posts.length} blog posts from ${feedUrl}`);
  } catch (error) {
    // On GitHub Actions (which sets CI=true), stop the build: the live site
    // then keeps its last good version instead of losing its post list.
    // Locally, carry on so `npm run dev` still works offline.
    if (process.env.CI) {
      console.error(`Could not read the blog feed ${feedUrl}: ${error.message}`);
      process.exit(1);
    }
    console.warn(`Could not read the blog feed (${error.message}); showing earlier posts only.`);
  }
}

await mkdir(new URL(".", OUTPUT_FILE), { recursive: true });
await writeFile(OUTPUT_FILE, JSON.stringify(posts, null, 2) + "\n");
