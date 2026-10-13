# WBTI 鸟格测试

一个适配手机与 PC 的中文鸟格测试网页。参与者完成 24 道生活情境题后，会得到 16 种鸟格中的一种；每种鸟格都对应一种真实鸟类，结果页会介绍这只鸟的习性，把“你像哪只鸟”和“这只鸟是什么样”连在一起。

公开访问地址：<https://wbti.site>

## 当前功能

- 24 道四选一情境题，行动节奏、社交电量、计划偏好、决策关注四个维度轮流出现；相邻题目的选项正反交替，避免“总选 A”得到固定结果
- 维度总分打平时，以该维度最后一道题的选择为准，正反两极完全对称
- 16 种鸟格，各有原型鸟、一句话标语、三个关键词、观鸟笔记、小提醒和最佳搭子
- 结果页展示四维倾向条；“鸟格图鉴”可以浏览全部 16 种鸟格
- 分享图在浏览器里生成（含二维码），微信里可长按保存，其他浏览器可下载或调用系统分享；分享链接 `?bird=<id>` 会打开对应鸟格的介绍页
- 答题进度和上次结果只保存在本机浏览器，不上传；手机返回手势会回到上一屏，不会直接退出网站
- 键盘可用 1–4 或 A–D 选择，← / → 切换题目；尊重“减少动态效果”系统设置

## 本地开发

要求 Node.js `>=22.13.0` 和 pnpm。

```bash
pnpm install
pnpm dev
```

常用检查：

```bash
pnpm build
pnpm build:edgeone
pnpm test
pnpm lint
```

`pnpm test` 会先完成 vinext 构建，再运行服务端渲染测试和 `tests/quiz.test.mjs` 中的题库、评分、图片完整性测试。

## 代码结构

- `app/lib/quiz.ts`：24 道题、16 种鸟格资料和四维评分逻辑的权威来源
- `app/BirdQuiz.tsx`：页面流程、浏览器历史、答题进度
- `app/components/`：首页、答题、揭晓、结果、图鉴、鸟格详情和分享面板
- `app/lib/storage.ts`：本机进度与上次结果的读写
- `app/lib/poster.ts`：分享图绘制
- `app/globals.css`：观鸟手账风格的纸张、水彩和响应式样式
- `art/birds-v3/`：16 张 2048px 水彩场景插画母版（与纸质手册同一套场景，画面内无文字）
- `public/birds-v3/`：由 `pnpm assets:birds` 生成的 1200px JPG 兜底图，以及 `web/` 下 480/960 宽 WebP
- `public/icons/progress-bird.webp`：答题进度条上的透明小鸟
- `public/og-cover.jpg`：链接预览封面，同样由 `pnpm assets:birds` 生成
- `edgeone-entry.tsx`、`edgeone-static/`、`vite.edgeone.config.ts`：腾讯云 EdgeOne 静态站入口与构建配置
- `.openai/hosting.json`、`vite.config.ts`、`worker/index.ts`：OpenAI Sites 回退构建配置

## 发布状态

截至 2026-10-09：

- `https://wbti.site` 是正式入口；本次重构尚未部署。
- EdgeOne Makers 项目名为 `wbti-bird-personality`，项目 ID 为 `makers-jc6zdisanqau`。
- EdgeOne 自动分配的预览域名需要访问令牌，不用于公开分享。
- OpenAI Sites 项目继续保留作回退；其 `chatgpt.site` 地址对匿名外部请求返回 403，不作为公开入口。

发布 EdgeOne 版本：

```bash
pnpm build:edgeone
pnpm dlx edgeone makers deploy edgeone-dist -n wbti-bird-personality -e production
```

发布完成后，应再次检查 `https://wbti.site` 的首页、至少一张 `/birds-v3/web/*.webp` 图片，以及在手机微信里生成并长按保存一次分享图。`edgeone-dist/`、`dist/`、`.vinext/` 和 `.wrangler/` 都是可重新生成的产物，不要直接编辑。

## 隐私与内容边界

网站不要求登录，不采集姓名、联系方式或答题记录。测试用于轻松的自我探索，不适合用于招聘、诊断或重大人生决策。插画中的原型鸟已逐张与真实照片核对关键特征，鸟类小知识只写公认的习性。
