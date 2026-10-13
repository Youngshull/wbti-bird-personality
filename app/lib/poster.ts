// 在浏览器里把鸟格画成一张分享图，微信里可长按保存，其他浏览器可下载或系统分享。
import { assetUrl } from "./asset";
import { birdImage, type BirdType } from "./quiz";

export const SITE_URL = "https://wbti.site";

const WIDTH = 1080;
const HEIGHT = 1660;
const SANS = '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif';
const HAND = '"Kaiti SC", "STKaiti", "KaiTi", "Songti SC", serif';
const INK = "#1f1d16";
const MUTED = "#6c6656";
const PAPER = "#f6eedb";

export type Poster = { url: string; blob: Blob; fileName: string };

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`无法加载 ${src}`));
    image.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = [];
  let line = "";
  for (const char of text) {
    if (ctx.measureText(line + char).width > maxWidth && line) {
      lines.push(line);
      line = char;
    } else {
      line += char;
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function drawQr(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const { default: qrcode } = await import("qrcode-generator");
  const qr = qrcode(0, "M");
  qr.addData(SITE_URL);
  qr.make();
  const count = qr.getModuleCount();
  const quiet = 2;
  const cell = Math.floor(size / (count + quiet * 2));
  const drawn = cell * (count + quiet * 2);
  const offsetX = x + (size - drawn) / 2;
  const offsetY = y + (size - drawn) / 2;

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, x - 6, y - 6, size + 12, size + 12, 18);
  ctx.fill();
  ctx.fillStyle = INK;
  for (let row = 0; row < count; row += 1) {
    for (let col = 0; col < count; col += 1) {
      if (qr.isDark(row, col)) {
        ctx.fillRect(offsetX + (col + quiet) * cell, offsetY + (row + quiet) * cell, cell, cell);
      }
    }
  }
}

export async function createPoster(bird: BirdType): Promise<Poster> {
  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器无法生成图片");

  const art = await loadImage(birdImage(bird.id, 960)).catch(() => loadImage(assetUrl(bird.image)));

  // 纸张底色与外框
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.strokeStyle = "rgba(31, 29, 22, 0.16)";
  ctx.lineWidth = 3;
  roundRect(ctx, 36, 36, WIDTH - 72, HEIGHT - 72, 44);
  ctx.stroke();

  // 顶部品牌
  ctx.fillStyle = INK;
  ctx.font = `900 54px "Arial Black", ${SANS}`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillText("WBTI", 92, 140);
  ctx.font = `500 26px ${SANS}`;
  ctx.fillStyle = MUTED;
  ctx.fillText("鸟格观察卡", 92, 180);
  ctx.textAlign = "right";
  ctx.font = `700 30px ${SANS}`;
  ctx.fillStyle = bird.accent;
  ctx.fillText(`No.${String(bird.number).padStart(2, "0")} / 16`, WIDTH - 92, 140);

  // 场景插画：贴着胶带的卡片
  const artSize = 800;
  const artX = (WIDTH - artSize) / 2;
  const artY = 212;
  ctx.save();
  ctx.shadowColor = "rgba(70, 52, 18, 0.22)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#fffaf0";
  roundRect(ctx, artX - 16, artY - 16, artSize + 32, artSize + 32, 30);
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, artX, artY, artSize, artSize, 20);
  ctx.clip();
  ctx.drawImage(art, artX, artY, artSize, artSize);
  ctx.restore();
  ctx.save();
  ctx.translate(WIDTH / 2, artY - 14);
  ctx.rotate(-0.03);
  ctx.fillStyle = "rgba(222, 202, 143, 0.85)";
  ctx.fillRect(-90, -18, 180, 36);
  ctx.restore();

  // 鸟格名称
  ctx.textAlign = "center";
  ctx.fillStyle = MUTED;
  ctx.font = `500 32px ${SANS}`;
  ctx.fillText("我的 WBTI 鸟格是", WIDTH / 2, 1090);
  ctx.fillStyle = bird.accent;
  ctx.font = `900 120px ${SANS}`;
  ctx.fillText(bird.name, WIDTH / 2, 1214);
  ctx.fillStyle = INK;
  ctx.font = `800 34px "Arial Black", ${SANS}`;
  ctx.fillText(bird.english.split("").join(String.fromCharCode(8202)), WIDTH / 2, 1268);
  ctx.fillStyle = MUTED;
  ctx.font = `500 30px ${SANS}`;
  ctx.fillText(`原型鸟 · ${bird.species}  ${bird.speciesEnglish}`, WIDTH / 2, 1320);

  // 关键词
  ctx.font = `700 30px ${SANS}`;
  const chipWidths = bird.traits.map((trait) => ctx.measureText(trait).width + 56);
  const gap = 18;
  let chipX = WIDTH / 2 - (chipWidths.reduce((sum, width) => sum + width, 0) + gap * (chipWidths.length - 1)) / 2;
  bird.traits.forEach((trait, index) => {
    ctx.fillStyle = "#fffaf0";
    ctx.strokeStyle = bird.accent;
    ctx.lineWidth = 3;
    roundRect(ctx, chipX, 1352, chipWidths[index], 58, 29);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = INK;
    ctx.fillText(trait, chipX + chipWidths[index] / 2, 1392);
    chipX += chipWidths[index] + gap;
  });

  // 底部：一句话 + 二维码
  ctx.strokeStyle = "rgba(31, 29, 22, 0.14)";
  ctx.setLineDash([10, 10]);
  ctx.beginPath();
  ctx.moveTo(92, 1446);
  ctx.lineTo(WIDTH - 92, 1446);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.textAlign = "left";
  ctx.fillStyle = INK;
  ctx.font = `400 34px ${HAND}`;
  const taglineLines = wrapLines(ctx, `“${bird.tagline}”`, 700).slice(0, 2);
  taglineLines.forEach((line, index) => ctx.fillText(line, 92, 1506 + index * 44));
  ctx.fillStyle = MUTED;
  ctx.font = `600 26px ${SANS}`;
  ctx.fillText("长按识别二维码 · 测测你是哪一只鸟", 92, 1506 + taglineLines.length * 44 + 4);

  await drawQr(ctx, WIDTH - 92 - 150, 1468, 150);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => (result ? resolve(result) : reject(new Error("图片导出失败"))), "image/jpeg", 0.82);
  });
  const url = canvas.toDataURL("image/jpeg", 0.82);
  return { url, blob, fileName: `WBTI-${bird.name}.jpg` };
}
