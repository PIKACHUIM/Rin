# PikaBlog

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/PIKACHUIM/Rin)
[![线上站点](https://img.shields.io/badge/live-coding.opkg.cn-2ea44f?style=for-the-badge)](https://coding.opkg.cn)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)

[English](./README.md) | 简体中文

PikaBlog 是基于 [openRin/Rin](https://github.com/openRin/Rin) 的个人博客，跑在 Cloudflare 全家桶上：
**单个 Worker 同时托管前端静态资源与 `/api`**，D1 存数据，R2 / S3 存图片，Queues 跑异步任务，Workers AI 生成摘要。

线上站点：<https://coding.opkg.cn>

## 相比上游做了什么

- **前后端合并为单个 Worker**：前端构建产物通过 `[assets]` 上传，`/api` 与页面同源，没有 CORS、不用维护两套域名；SPA 深链由 Worker 回退 `index.html`
- **模板化主题系统**：内置 5 套主题（`official` / `aurora` / `fuwari` / `noir` / `zen`），后台可视化切换，支持自定义模板注册
- **多域名登录**：OAuth `state` 里带签名后的来源域名，从任意已路由域名登录都能跳回原域名，不再依赖 `FRONTEND_URL`
- **按域名的 SEO 输出**：`sitemap.xml` / `robots.txt` / RSS 全部用当前请求的 origin 生成绝对链接，多域名互不串号
- **数据层迁移到 D1 `rinblogs-data`**：补齐最新 schema（评论、说说、缓存表、AI 摘要字段与索引）
- 修复上游遗留问题：`react-helmet-async` 崩溃、旧主题 CSS 变量残留等

## 功能

- GitHub OAuth 登录，首个注册用户自动成为管理员
- Markdown 编辑器 + 实时本地草稿、拖拽/粘贴上传图片、自定义文章别名（`/about`）
- 草稿 / 不公开 / 公开三种可见性，支持置顶
- 话题标签、时间线、说说（Moments）、搜索、友链（定时健康检查）
- 评论与审核、Webhook 通知、AI 摘要（Workers AI + Queue）
- RSS / Atom / JSON Feed、`sitemap.xml`、`robots.txt`
- 5 套主题模板 + 自定义壁纸 + 强调色，明暗模式跟随系统
- 中 / 繁 / 英 / 日 四语言界面

## 架构

```text
worker: rinblogs-work
├── [assets] ./dist/client   → 前端构建产物
├── /api/*                   → Hono 应用（server/src）
├── /sitemap.xml /robots.txt → 按请求域名生成
└── /rss.xml 等              → 按请求域名实时生成

绑定
├── DB          D1    rinblogs-data
├── TASK_QUEUE  Queue rinblogs-work-tasks（AI 摘要 / 兼容任务）
├── AI          Workers AI
└── ASSETS      ./dist/client
```

```text
client/            React + Vite 前端（页面、组件、主题、i18n）
server/            Hono Worker 后端（services / db / runtime / queue）
packages/api/      前后端共享的请求响应类型
packages/config/   站点配置默认值（含主题默认值）
packages/ui/       通用 UI 组件
cli/               部署、数据库迁移等命令行工具
```

## 本地开发

需要 [Bun](https://bun.sh) 1.3+。

```bash
git clone https://github.com/PIKACHUIM/Rin.git
cd Rin
bun install

cp .env.example .env.local   # 按需填写本地配置
bun run dev                  # 前端 5173 / Worker 11498
```

打开 <http://localhost:5173>。

| 命令 | 说明 |
| --- | --- |
| `bun run dev` | 同时启动前端与 Worker |
| `bun run dev:client` / `dev:server` | 只启动其中一侧 |
| `bun run check` | TypeScript 类型检查 |
| `bun run test` | 全部测试（`test:client` / `test:server` 单独跑） |
| `bun run db:migrate` | 对本地 D1 执行迁移 |
| `bun run build` | 构建前端 + 服务端 dry-run |

## 部署到 Cloudflare

### 方式一：一键按钮

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/PIKACHUIM/Rin)

按钮会克隆本仓库，用仓库根目录的 `wrangler.toml` 部署 Worker。由于 D1 必须填真实的 `database_id`，
首次部署后需要补绑定；想一步到位请用方式二（会自动创建 D1 / Queue 并跑迁移）。

### 方式二：CLI 一键部署（推荐）

```bash
export CLOUDFLARE_API_TOKEN=...      # 需要 Workers Scripts / D1 / Queues 权限
export CLOUDFLARE_ACCOUNT_ID=...

bun run deploy                       # 前端 + 后端
bun run deploy -- --server           # 只部署 Worker
bun run deploy -- --client           # 只部署前端
```

CLI 会依次：生成 `wrangler.toml` → 创建 D1（`DB_NAME`，默认 `rinblogs-data`）→ 创建队列 →
执行数据库迁移 → 构建前端 → 部署 Worker → 同步密钥。

### 方式三：手动 wrangler

```bash
cp wrangler.toml wrangler.local.toml   # 本地配置不入库
# 填 account_id、routes、D1 database_id，队列名保持默认
bun --filter './client' build
npx wrangler deploy --config wrangler.local.toml
```

### 必须配置的密钥

用 `wrangler secret put <KEY>` 写入，不要放进 `[vars]`：

| 变量 | 说明 |
| --- | --- |
| `JWT_SECRET` | 登录令牌签名密钥 |
| `RIN_GITHUB_CLIENT_ID` / `RIN_GITHUB_CLIENT_SECRET` | GitHub OAuth App（回调 `/api/user/github/callback`） |
| `S3_ACCESS_KEY_ID` / `S3_SECRET_ACCESS_KEY` | 图床密钥（R2 或兼容 S3） |

### 可选站点变量（`[vars]`）

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| `NAME` / `DESCRIPTION` / `AVATAR` | `Rin` / 空 | 站点名称、描述、头像 |
| `PAGE_SIZE` | `5` | 列表每页数量 |
| `S3_ENDPOINT` / `S3_BUCKET` / `S3_ACCESS_HOST` | 空 | 对象存储地址、桶名、公开域名 |
| `S3_FOLDER` / `S3_CACHE_FOLDER` | `images/` / `cache/` | 上传与缓存前缀 |
| `CACHE_STORAGE_MODE` | `s3` | 改成 `database` 则缓存写 D1 |
| `WEBHOOK_URL` | 空 | 新评论等事件通知 |
| `RSS_TITLE` / `RSS_DESCRIPTION` | 空 | Feed 标题与描述 |

> `FRONTEND_URL` 已移除：sitemap / robots / RSS 一律按请求域名生成，多域名部署不会再串。

## 主题

后台「设置 → 个性化 → 主题模板」可切换 5 套模板，并支持自定义壁纸与强调色：

| 模板 | 风格 |
| --- | --- |
| `official` | 上游默认：中性灰白、白卡片、无渐变无模糊（当前默认） |
| `aurora` | 冷调渐变 + 玻璃拟态 |
| `fuwari` | 柔和粉彩、大圆角 |
| `noir` | 黑白强对比、小圆角、无模糊 |
| `zen` | 暖纸底色 + 衬线标题 |

新增主题：在 `client/src/theme/custom-templates.ts` 追加一项（明暗两套令牌）即可，设置页会自动出现；
插件式场景可调用 `registerThemeTemplate()` 运行时注册。

## 许可证

MIT。本项目源自 [openRin/Rin](https://github.com/openRin/Rin)，版权归原作者所有；衍生部分同样以 MIT 发布。
