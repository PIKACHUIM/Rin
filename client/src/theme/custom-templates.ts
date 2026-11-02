import type { ThemeTemplate } from "./types";

/**
 * 自定义主题模板入口。
 *
 * 添加一套新主题有两种方式：
 * 1. 直接在此数组中追加一项（构建期生效，推荐）；
 * 2. 运行时调用 `registerThemeTemplate()`（例如按站点配置动态注入）。
 *
 * 一套模板 = 一个 id + 明暗两套令牌，令牌会写入 :root 的 --rin-* 变量，
 * 因此模板只描述「画布/表面/文字/圆角/阴影/玻璃透明度/hero 渐变/内容宽度」，
 * 不需要改动任何组件。
 *
 * 示例：
 * ```ts
 * export const CUSTOM_THEME_TEMPLATES: ThemeTemplate[] = [
 *   {
 *     id: "midnight",
 *     accent: "#7c3aed",
 *     light: {
 *       canvas: "246 247 252",
 *       surface: "255 255 255",
 *       surfaceMuted: "241 243 250",
 *       surfaceHover: "234 237 246",
 *       surfaceActive: "223 228 240",
 *       text: "20 22 34",
 *       textMuted: "96 102 122",
 *       border: "24 24 27",
 *       radiusControl: "0.75rem",
 *       radiusSurface: "1.25rem",
 *       shadowSurface: "0 16px 40px -28px rgb(15 23 42 / 0.4)",
 *       shadowOverlay: "0 24px 80px rgb(0 0 0 / 0.22)",
 *       glassAlpha: 0.72,
 *       heroGradient: "radial-gradient(120% 120% at 10% 0%, rgb(var(--theme-rgb) / 0.2), transparent 60%)",
 *       pageMaxWidth: "72rem",
 *       borderAlpha: 0.08,
 *     },
 *     dark: { ...与 light 同结构 },
 *   },
 * ];
 * ```
 *
 * 添加后无需改设置页：模板卡片、下拉项与 i18n 兜底会自动出现
 * （建议同时在 locales/<语言>/translation.json 的 settings.theme_template.options
 * 与 settings.theme_template.preview 里补文案，缺失时回退显示模板 id）。
 */
export const CUSTOM_THEME_TEMPLATES: ThemeTemplate[] = [];
