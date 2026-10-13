// Builds the web copies of the bird scene illustrations and the homepage sticker.
// art/birds-v3/*.png are the 2048px masters; run `pnpm assets:birds` after changing one.
import { mkdir, readdir, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const sourceDir = new URL("../art/birds-v3/", import.meta.url);
const publicDir = new URL("../public/birds-v3/", import.meta.url);
const webDir = new URL("web/", publicDir);
const widths = [480, 960];
const path = (url) => fileURLToPath(url);

await mkdir(webDir, { recursive: true });

const files = (await readdir(sourceDir)).filter((file) => file.endsWith(".png")).sort();
let total = 0;

for (const file of files) {
  const id = file.replace(/\.png$/, "");
  const source = path(new URL(file, sourceDir));

  const fallback = new URL(`${id}.jpg`, publicDir);
  await sharp(source).resize(1200, 1200).jpeg({ quality: 84, mozjpeg: true }).toFile(path(fallback));
  total += (await stat(fallback)).size;

  for (const width of widths) {
    const target = new URL(`${id}-${width}.webp`, webDir);
    await sharp(source).resize(width, width).webp({ quality: width > 600 ? 78 : 80, effort: 6 }).toFile(path(target));
    total += (await stat(target)).size;
  }
}

console.log(`Wrote ${files.length} JPG + ${files.length * widths.length} WebP files, ${Math.round(total / 1024)} KB in total.`);

// 链接预览用的封面图（og:image）：四张斜放的场景卡片。
const coverBirds = ["hype-buddy", "mood-poet", "nailed-it", "foodie-champ"];
const angles = [-6, 4, -3, 6];
const coverCards = await Promise.all(coverBirds.map(async (id, index) => {
  const art = await sharp(path(new URL(`${id}.png`, sourceDir))).resize(236, 236).toBuffer();
  const card = await sharp({ create: { width: 260, height: 260, channels: 4, background: "#fffaf0" } })
    .composite([{ input: art, left: 12, top: 12 }])
    .png()
    .toBuffer();
  const rotated = await sharp(card).rotate(angles[index], { background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  return { input: rotated, left: 46 + index * 280, top: index % 2 === 0 ? 300 : 320 };
}));
const coverText = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <text x="600" y="140" text-anchor="middle" font-family="Arial Black, Helvetica, sans-serif" font-weight="900" font-size="92" fill="#1f1d16">WBTI</text>
  <text x="600" y="222" text-anchor="middle" font-family="PingFang SC, Hiragino Sans GB, sans-serif" font-weight="700" font-size="52" fill="#d9501c">今天的你，是哪一只鸟？</text>
</svg>`);
await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#f4ecd8" } })
  .composite([{ input: coverText, left: 0, top: 0 }, ...coverCards])
  .jpeg({ quality: 84, mozjpeg: true })
  .toFile(path(new URL("../public/og-cover.jpg", import.meta.url)));
console.log("Wrote public/og-cover.jpg");

// 首页“江豚湾鸟友集合！”贴纸（透明背景）。
await sharp(path(new URL("../art/stickers/jiangtun.png", import.meta.url)))
  .resize(480, 480)
  .webp({ quality: 84, alphaQuality: 90, effort: 6 })
  .toFile(path(new URL("../public/icons/jiangtun-sticker.webp", import.meta.url)));
console.log("Wrote public/icons/jiangtun-sticker.webp");
