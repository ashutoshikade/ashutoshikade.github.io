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
//
// If the feed can't be read, the site keeps the posts it already lists: it
// publishes a copy at /generated/blog-posts.json for exactly this. That way a
// feed outage doesn't empty the Blog page, or hold up other changes such as a
// new photo.

import { mkdir, writeFile } from "node:fs/promises";
import { XMLParser } from "fast-xml-parser";
import siteConfig from "../site.config.js";

const OUTPUT_FILE = new URL("../src/generated/blog-posts.json", import.meta.url);
// The copy the live site serves, read back by the next deploy if the feed fails.
const PUBLISHED_FILE = new URL("../public/generated/blog-posts.json", import.meta.url);
const PUBLISHED_URL = `${siteConfig.url}/generated/blog-posts.json`;
const { feedUrl, maxPosts } = siteConfig.blog;

async function fetchPosts() {
  const response = await fetch(feedUrl, {
    headers: { "User-Agent": `${siteConfig.url} blog feed reader` },
    signal: AbortSignal.timeout(20_000),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  // Substack redirects a feed URL to your profile page until the publication
  // exists. That isn't an outage, so just show no feed posts for now.
  if (!response.headers.get("content-type")?.includes("xml")) {
    console.warn(`${feedUrl} isn't an RSS feed yet (has the publication been created?)`);
    return [];
  }

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

// The posts the live site lists right now.
async function postsOnLiveSite() {
  const response = await fetch(PUBLISHED_URL, { signal: AbortSignal.timeout(20_000) });
  // No copy yet: the live site was built before this file existed.
  if (response.status === 404) return [];
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

// On GitHub Actions, "::warning::" puts the message on the run's summary page.
function warn(message) {
  console.warn(process.env.GITHUB_ACTIONS ? `::warning::${message}` : message);
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
    // Locally, carry on without them so `npm run dev` still works offline.
    // On GitHub Actions (which sets CI=true), keep what the live site lists.
    if (!process.env.CI) {
      console.warn(`Could not read the blog feed (${error.message}); showing earlier posts only.`);
    } else {
      try {
        posts = await postsOnLiveSite();
        warn(`Could not read the blog feed ${feedUrl} (${error.message}); keeping the ${posts.length} posts the live site lists.`);
      } catch (liveError) {
        // Without either list, stop the build: the live site then keeps its
        // last good version instead of losing its post list.
        console.error(`Could not read the blog feed ${feedUrl} (${error.message}) or the live site's copy (${liveError.message})`);
        process.exit(1);
      }
    }
  }
}

const json = JSON.stringify(posts, null, 2) + "\n";
for (const file of [OUTPUT_FILE, PUBLISHED_FILE]) {
  await mkdir(new URL(".", file), { recursive: true });
  await writeFile(file, json);
}
