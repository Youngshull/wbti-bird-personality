# WBTI 项目规则

## 项目定位

这是一个面向公众的响应式鸟格测试网页：24 道题、四个评分维度、16 种鸟格结果，正式入口为 `https://wbti.site`。

## 运行与验证

- 使用 pnpm 和 Node.js `>=22.13.0`。
- 本地开发：`pnpm dev`。
- Sites 构建：`pnpm build`。
- EdgeOne 静态构建：`pnpm build:edgeone`。
- 提交前运行：`pnpm test` 和 `pnpm lint`。

## 技术栈

React 19、Next.js 16、vinext、Vite 8、TypeScript 和纯 CSS。正式部署使用腾讯云 EdgeOne Makers；OpenAI Sites 配置只作回退。

## 目录与约定

- `app/lib/quiz.ts` 是题目、结果、原型鸟资料和评分逻辑的唯一权威来源；鸟类小知识只写公认、可核实的习性。
- 评分在浏览器内完成，不引入用户登录或答题数据上传；进度和上次结果只存本机 `localStorage`。
- 鸟类插画是与纸质手册一致的水彩场景图（不是透明抠图），画面内不放任何文字。2048px 母版在 `art/birds-v3/`，改动后运行 `pnpm assets:birds` 重新生成 `public/birds-v3/` 的 JPG、WebP 和 `public/og-cover.jpg`。新画或重画的鸟必须先与真实照片核对关键特征（嘴、脸、羽色、腿色）。
- 答题进度条上的小鸟是单独的透明小图 `public/icons/progress-bird.webp`。
- 首页“江豚湾鸟友集合！”是生图贴纸（母版 `art/stickers/jiangtun.png`，透明背景），不要再用系统楷体手写字代替。
- 页面组件在 `app/components/`，流程状态与浏览器历史在 `app/BirdQuiz.tsx`，分享图在 `app/lib/poster.ts`。
- 分享文案不写“转发才能看结果”之类的诱导分享语，避免被微信限制访问。
- 页面改动必须同时检查手机与 PC 布局、键盘操作和减少动态效果偏好。
- 不直接编辑 `dist/`、`edgeone-dist/`、`.vinext/`、`.wrangler/` 或 `.edgeone/` 中的生成文件。
- 遵循上级 `AGENTS.md` 的表达规范，本文件不复制同一组规则。

## 当前状态与下一步

2026-07-20 已验证 `https://wbti.site` 首页和静态资源可访问。

2026-10-09 完成重构（题目交替轮换、平局规则、原型鸟资料、四维条、最佳搭子、鸟格图鉴、分享海报、浏览器返回键支持、WebP 图片），本地两种构建与测试通过，尚未部署。下一步：在 iOS 微信、Android 微信真机上检查长按保存海报和二维码识别，再部署 EdgeOne，并以正式域名做上线验收。2026-10-09 同日按手册场景用生图 API 重绘了 16 张插画，并逐张与维基百科真实照片核对；“湖边显眼包”改为白鹤，“领队大哥”改为鸿雁，“囤货狂魔”改为红尾伯劳。
