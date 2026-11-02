export type ThemeMode = "light" | "dark";

/**
 * 主题令牌：一套主题模板在某个色彩模式下的完整设计变量。
 * 所有值都会写入 :root 的 CSS 变量，供 @rin/ui 与 tailwind 复用。
 */
export type ThemeTokens = {
  /** 页面画布底色（"r g b" 形式，供 rgb(var(--x)) 使用） */
  canvas: string;
  /** 卡片/导航等主体表面 */
  surface: string;
  /** 次级表面（输入框、代码块） */
  surfaceMuted: string;
  surfaceHover: string;
  surfaceActive: string;
  text: string;
  textMuted: string;
  border: string;
  radiusControl: string;
  radiusSurface: string;
  shadowSurface: string;
  shadowOverlay: string;
  /** 顶部玻璃层不透明度（0-1） */
  glassAlpha: number;
  /** 首页 hero 渐变 */
  heroGradient: string;
  /** 内容区最大宽度 */
  pageMaxWidth: string;
  /** 卡片描边透明度 */
  borderAlpha: number;
};

export type ThemeTemplate = {
  id: string;
  /** 预览用强调色 */
  accent: string;
  /** 字体族覆盖，留空则使用全局字体 */
  fontFamily?: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};
