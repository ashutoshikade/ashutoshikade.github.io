// Turns the newest photo in profile/photos/ into the versions the site uses:
//
//   public/generated/profile.jpg    the photo on the Home page
//   public/generated/og-image.jpg   the 1200x630 picture LinkedIn/X/Slack show in link previews
//   src/generated/profile-photo.json  its size, so the page can reserve space before it loads
//
// So to change your photo, upload a new one into profile/photos/ (any name,
// JPEG/PNG/HEIC, full size straight from your phone is fine). The newest one
// wins, and the old ones can stay or be deleted.
//
// The web copies drop the photo's metadata, including the GPS location that
// iPhones record. The original in profile/photos/ is never changed.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import decodeHeic from "heic-decode";
import sharp from "sharp";

const PHOTOS_DIR = fileURLToPath(new URL("../profile/photos/", import.meta.url));
const PUBLIC_DIR = fileURLToPath(new URL("../public/generated/", import.meta.url));
const INFO_FILE = fileURLToPath(new URL("../src/generated/profile-photo.json", import.meta.url));
const IMAGE_TYPES = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];
// Shown at up to 360px wide, so 720px stays sharp on high-density (retina) screens.
const PHOTO_WIDTH = 720;

// The photo committed most recently. Photos not committed yet count as newest,
// so a new photo shows up straight away in `npm run dev`.
async function newestPhoto() {
  const files = (await readdir(PHOTOS_DIR)).filter((name) => IMAGE_TYPES.includes(extname(name).toLowerCase()));
  if (files.length === 0) throw new Error("No photo found in profile/photos/");

  const committedAt = (file) => {
    const output = execFileSync("git", ["log", "-1", "--format=%ct", "--", join(PHOTOS_DIR, file)], { encoding: "utf8" });
    return output.trim() ? Number(output) : Infinity;
  };
  return files.map((file) => ({ file, time: committedAt(file) })).sort((a, b) => b.time - a.time)[0].file;
}

// sharp can read JPEG/PNG/WebP itself; iPhone HEIC photos need decoding first.
async function load(file) {
  const buffer = await readFile(join(PHOTOS_DIR, file));
  if (![".heic", ".heif"].includes(extname(file).toLowerCase())) return { buffer, image: sharp(buffer).rotate() };

  const { width, height, data } = await decodeHeic({ buffer });
  return { buffer, image: sharp(Buffer.from(data), { raw: { width, height, channels: 4 } }) };
}

const file = await newestPhoto();
const { buffer, image } = await load(file);
await mkdir(PUBLIC_DIR, { recursive: true });

const photo = await image
  .clone()
  .resize({ width: PHOTO_WIDTH, withoutEnlargement: true })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(PUBLIC_DIR, "profile.jpg"));

// "attention" crops around the most eye-catching part of the photo (usually the face).
await image
  .clone()
  .resize(1200, 630, { fit: "cover", position: sharp.strategy.attention })
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile(join(PUBLIC_DIR, "og-image.jpg"));

// The ?v= part changes whenever the photo does, so browsers don't keep showing an old cached one.
const version = createHash("sha256").update(buffer).digest("hex").slice(0, 8);
await mkdir(join(INFO_FILE, ".."), { recursive: true });
await writeFile(
  INFO_FILE,
  JSON.stringify({ src: `/generated/profile.jpg?v=${version}`, width: photo.width, height: photo.height }, null, 2) + "\n",
);
console.log(`Profile photo: profile/photos/${file} → ${photo.width}x${photo.height}`);
