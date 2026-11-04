/**
 * 后端预置主题注册表。
 *
 * 这套令牌同时被服务端（写入站点默认配置）与客户端（渲染）消费，
 * 因此新增主题只需要在这里追加一条记录，设置页与首页会自动识别。
 *
 * 约定：
 * - 颜色一律写成 "r g b" 形式，配合 rgb(var(--x) / alpha) 使用；
 * - radius / shadow / gradient 属于视觉签名，宁可克制也不要随手调；
 * - accent 是该主题的推荐强调色，选择主题时由设置页一并应用。
 */
export type ThemeMode = "light" | "dark";

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
  /** 首页 hero 渐变（可叠加网格、噪点等图层） */
  heroGradient: string;
  /** 内容区最大宽度 */
  pageMaxWidth: string;
  /** 卡片描边透明度 */
  borderAlpha: number;
};

export type ThemePreset = {
  id: string;
  /** 推荐强调色，也是设置页预览的主色 */
  accent: string;
  /** 展示字体族覆盖，留空则使用全局字体 */
  fontFamily?: string;
  light: ThemeTokens;
  dark: ThemeTokens;
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "official",
    accent: "#fc466b",
    fontFamily: '"Source Han Serif CN VF", "Noto Serif SC", "Songti SC", Georgia, serif',
    light: {
      canvas: "245 245 245",
      surface: "255 255 255",
      surfaceMuted: "245 245 245",
      surfaceHover: "229 229 229",
      surfaceActive: "212 212 212",
      text: "23 23 23",
      textMuted: "82 82 91",
      border: "24 24 27",
      radiusControl: "0.75rem",
      radiusSurface: "1rem",
      shadowSurface: "0 1px 3px rgb(24 24 27 / 0.06)",
      shadowOverlay: "0 24px 80px rgb(0 0 0 / 0.22), 0 4px 20px rgb(0 0 0 / 0.12)",
      glassAlpha: 1,
      heroGradient: "none",
      pageMaxWidth: "72rem",
      borderAlpha: 0.06,
    },
    dark: {
      canvas: "28 28 30",
      surface: "51 51 51",
      surfaceMuted: "64 64 64",
      surfaceHover: "82 82 82",
      surfaceActive: "115 115 115",
      text: "250 250 250",
      textMuted: "212 212 216",
      border: "255 255 255",
      radiusControl: "0.75rem",
      radiusSurface: "1rem",
      shadowSurface: "0 1px 3px rgb(0 0 0 / 0.35)",
      shadowOverlay: "0 28px 90px rgb(0 0 0 / 0.5), 0 4px 24px rgb(0 0 0 / 0.3)",
      glassAlpha: 1,
      heroGradient: "none",
      pageMaxWidth: "72rem",
      borderAlpha: 0.1,
    },
  },
  {
    id: "aurora",
    accent: "#fc466b",
    fontFamily: 'Cantarell, "Noto Sans SC", "PingFang SC", sans-serif',
    light: {
      canvas: "244 246 251",
      surface: "255 255 255",
      surfaceMuted: "241 244 250",
      surfaceHover: "234 238 248",
      surfaceActive: "223 229 243",
      text: "17 20 32",
      textMuted: "94 101 122",
      border: "24 24 27",
      radiusControl: "0.75rem",
      radiusSurface: "1.25rem",
      shadowSurface: "0 18px 42px -26px rgb(15 23 42 / 0.42), 0 2px 8px -4px rgb(15 23 42 / 0.12)",
      shadowOverlay: "0 24px 80px rgb(0 0 0 / 0.22), 0 4px 20px rgb(0 0 0 / 0.12)",
      glassAlpha: 0.72,
      heroGradient:
        "radial-gradient(120% 120% at 12% 0%, rgb(var(--theme-rgb) / 0.22), transparent 55%), radial-gradient(90% 90% at 88% 4%, rgba(84, 51, 255, 0.16), transparent 62%)",
      pageMaxWidth: "72rem",
      borderAlpha: 0.08,
    },
    dark: {
      canvas: "16 17 23",
      surface: "26 28 37",
      surfaceMuted: "33 35 46",
      surfaceHover: "42 45 58",
      surfaceActive: "52 56 71",
      text: "244 246 252",
      textMuted: "166 172 190",
      border: "255 255 255",
      radiusControl: "0.75rem",
      radiusSurface: "1.25rem",
      shadowSurface: "0 22px 48px -28px rgb(0 0 0 / 0.85), 0 2px 10px -4px rgb(0 0 0 / 0.6)",
      shadowOverlay: "0 28px 90px rgb(0 0 0 / 0.5), 0 4px 24px rgb(0 0 0 / 0.3)",
      glassAlpha: 0.66,
      heroGradient:
        "radial-gradient(120% 120% at 10% 0%, rgb(var(--theme-rgb) / 0.28), transparent 55%), radial-gradient(90% 90% at 90% 0%, rgba(84, 51, 255, 0.22), transparent 60%)",
      pageMaxWidth: "72rem",
      borderAlpha: 0.12,
    },
  },
  {
    id: "noir",
    accent: "#111111",
    fontFamily: '"IBM Plex Sans", "Public Sans", "Noto Sans SC", "PingFang SC", sans-serif',
    light: {
      canvas: "250 250 250",
      surface: "255 255 255",
      surfaceMuted: "244 244 244",
      surfaceHover: "238 238 238",
      surfaceActive: "228 228 228",
      text: "10 10 10",
      textMuted: "82 82 82",
      border: "0 0 0",
      radiusControl: "0.35rem",
      radiusSurface: "0.5rem",
      shadowSurface: "0 1px 0 rgb(0 0 0 / 0.08)",
      shadowOverlay: "0 18px 60px rgb(0 0 0 / 0.18)",
      glassAlpha: 0.9,
      heroGradient: "linear-gradient(180deg, rgba(0, 0, 0, 0.06), rgba(250, 250, 250, 0) 70%)",
      pageMaxWidth: "76rem",
      borderAlpha: 0.22,
    },
    dark: {
      canvas: "10 10 10",
      surface: "18 18 18",
      surfaceMuted: "26 26 26",
      surfaceHover: "35 35 35",
      surfaceActive: "46 46 46",
      text: "245 245 245",
      textMuted: "160 160 160",
      border: "255 255 255",
      radiusControl: "0.35rem",
      radiusSurface: "0.5rem",
      shadowSurface: "0 1px 0 rgb(255 255 255 / 0.08)",
      shadowOverlay: "0 20px 70px rgb(0 0 0 / 0.7)",
      glassAlpha: 0.88,
      heroGradient: "linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(10, 10, 10, 0) 70%)",
      pageMaxWidth: "76rem",
      borderAlpha: 0.28,
    },
  },
  {
    id: "zen",
    accent: "#b4532a",
    fontFamily: '"Source Han Serif CN VF", "Noto Serif SC", "Songti SC", Georgia, serif',
    light: {
      canvas: "247 243 235",
      surface: "253 251 246",
      surfaceMuted: "243 238 229",
      surfaceHover: "238 231 219",
      surfaceActive: "230 222 208",
      text: "43 36 28",
      textMuted: "120 108 92",
      border: "43 36 28",
      radiusControl: "0.6rem",
      radiusSurface: "1rem",
      shadowSurface: "0 16px 36px -28px rgb(76 60 38 / 0.55), 0 1px 3px -1px rgb(76 60 38 / 0.18)",
      shadowOverlay: "0 24px 70px rgb(60 46 30 / 0.22)",
      glassAlpha: 0.8,
      heroGradient:
        "radial-gradient(110% 110% at 15% 0%, rgba(180, 83, 42, 0.16), transparent 58%), linear-gradient(180deg, rgba(247, 243, 235, 0) 40%, rgb(247 243 235 / 1) 100%)",
      pageMaxWidth: "70rem",
      borderAlpha: 0.14,
    },
    dark: {
      canvas: "26 22 18",
      surface: "34 29 24",
      surfaceMuted: "43 37 31",
      surfaceHover: "52 45 38",
      surfaceActive: "63 55 46",
      text: "244 238 228",
      textMuted: "176 163 146",
      border: "244 238 228",
      radiusControl: "0.6rem",
      radiusSurface: "1rem",
      shadowSurface: "0 18px 40px -28px rgb(0 0 0 / 0.9), 0 1px 4px -1px rgb(0 0 0 / 0.6)",
      shadowOverlay: "0 26px 80px rgb(0 0 0 / 0.6)",
      glassAlpha: 0.74,
      heroGradient:
        "radial-gradient(110% 110% at 12% 0%, rgba(180, 83, 42, 0.24), transparent 58%), linear-gradient(180deg, rgba(26, 22, 18, 0) 40%, rgb(26 22 18 / 1) 100%)",
      pageMaxWidth: "70rem",
      borderAlpha: 0.18,
    },
  },
  {
    id: "fresh",
    accent: "#0f9d8f",
    fontFamily: '"Nunito Sans", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    light: {
      canvas: "243 250 247",
      surface: "255 255 255",
      surfaceMuted: "236 246 241",
      surfaceHover: "227 241 234",
      surfaceActive: "214 233 224",
      text: "17 38 30",
      textMuted: "88 116 105",
      border: "15 42 33",
      radiusControl: "0.9rem",
      radiusSurface: "1.35rem",
      shadowSurface: "0 20px 44px -32px rgb(15 60 47 / 0.42), 0 2px 6px -3px rgb(15 60 47 / 0.1)",
      shadowOverlay: "0 26px 70px rgb(12 48 38 / 0.2), 0 4px 18px rgb(12 48 38 / 0.1)",
      glassAlpha: 0.74,
      heroGradient:
        "radial-gradient(110% 110% at 8% -6%, rgb(var(--theme-rgb) / 0.2), transparent 56%), radial-gradient(90% 80% at 92% 2%, rgba(94, 234, 212, 0.24), transparent 62%), linear-gradient(180deg, rgba(243, 250, 247, 0) 55%, rgb(243 250 247 / 1) 100%)",
      pageMaxWidth: "74rem",
      borderAlpha: 0.07,
    },
    dark: {
      canvas: "11 20 17",
      surface: "17 29 25",
      surfaceMuted: "22 37 32",
      surfaceHover: "28 46 40",
      surfaceActive: "36 58 50",
      text: "234 248 242",
      textMuted: "154 182 171",
      border: "255 255 255",
      radiusControl: "0.9rem",
      radiusSurface: "1.35rem",
      shadowSurface: "0 22px 48px -30px rgb(0 0 0 / 0.85), 0 2px 8px -3px rgb(0 0 0 / 0.5)",
      shadowOverlay: "0 28px 80px rgb(0 0 0 / 0.55), 0 4px 20px rgb(0 0 0 / 0.3)",
      glassAlpha: 0.68,
      heroGradient:
        "radial-gradient(110% 110% at 8% -6%, rgb(var(--theme-rgb) / 0.3), transparent 56%), radial-gradient(90% 80% at 92% 0%, rgba(45, 212, 191, 0.2), transparent 62%), linear-gradient(180deg, rgba(11, 20, 17, 0) 55%, rgb(11 20 17 / 1) 100%)",
      pageMaxWidth: "74rem",
      borderAlpha: 0.12,
    },
  },
  {
    id: "cute",
    accent: "#ff6fa5",
    fontFamily: '"Baloo 2", "Nunito", "Quicksand", "PingFang SC", "Microsoft YaHei", sans-serif',
    light: {
      canvas: "255 247 251",
      surface: "255 255 255",
      surfaceMuted: "253 240 246",
      surfaceHover: "251 230 240",
      surfaceActive: "247 216 230",
      text: "58 31 43",
      textMuted: "143 106 123",
      border: "58 31 43",
      radiusControl: "1.05rem",
      radiusSurface: "1.75rem",
      shadowSurface: "0 22px 48px -30px rgb(190 84 130 / 0.45), 0 2px 8px -4px rgb(190 84 130 / 0.18)",
      shadowOverlay: "0 28px 76px rgb(120 40 80 / 0.22), 0 4px 18px rgb(120 40 80 / 0.12)",
      glassAlpha: 0.82,
      heroGradient:
        "radial-gradient(70% 60% at 6% 0%, rgb(var(--theme-rgb) / 0.28), transparent 60%), radial-gradient(70% 60% at 92% 4%, rgba(167, 139, 250, 0.26), transparent 62%), radial-gradient(50% 50% at 60% 26%, rgba(253, 186, 116, 0.2), transparent 70%)",
      pageMaxWidth: "72rem",
      borderAlpha: 0.08,
    },
    dark: {
      canvas: "27 19 25",
      surface: "37 26 34",
      surfaceMuted: "46 32 42",
      surfaceHover: "58 40 52",
      surfaceActive: "72 50 64",
      text: "253 238 246",
      textMuted: "195 163 179",
      border: "255 255 255",
      radiusControl: "1.05rem",
      radiusSurface: "1.75rem",
      shadowSurface: "0 24px 52px -28px rgb(0 0 0 / 0.9), 0 2px 10px -4px rgb(0 0 0 / 0.55)",
      shadowOverlay: "0 30px 88px rgb(0 0 0 / 0.55), 0 4px 22px rgb(0 0 0 / 0.35)",
      glassAlpha: 0.74,
      heroGradient:
        "radial-gradient(70% 60% at 6% 0%, rgb(var(--theme-rgb) / 0.36), transparent 60%), radial-gradient(70% 60% at 92% 0%, rgba(167, 139, 250, 0.32), transparent 62%), radial-gradient(50% 50% at 60% 26%, rgba(251, 146, 60, 0.16), transparent 70%)",
      pageMaxWidth: "72rem",
      borderAlpha: 0.12,
    },
  },
  {
    id: "tech",
    accent: "#22d3ee",
    fontFamily: '"Space Mono", "JetBrains Mono", "Cascadia Mono", Consolas, "PingFang SC", "Microsoft YaHei", ui-monospace, monospace',
    light: {
      canvas: "242 246 255",
      surface: "255 255 255",
      surfaceMuted: "233 239 251",
      surfaceHover: "223 232 250",
      surfaceActive: "210 221 245",
      text: "9 18 32",
      textMuted: "86 100 128",
      border: "11 18 32",
      radiusControl: "0.5rem",
      radiusSurface: "0.85rem",
      shadowSurface: "0 18px 40px -30px rgb(15 40 90 / 0.5), 0 1px 4px -2px rgb(15 40 90 / 0.12)",
      shadowOverlay: "0 24px 70px rgb(10 30 70 / 0.24), 0 4px 18px rgb(10 30 70 / 0.12)",
      glassAlpha: 0.7,
      heroGradient:
        "radial-gradient(90% 80% at 10% -8%, rgb(var(--theme-rgb) / 0.24), transparent 58%), radial-gradient(70% 70% at 94% 2%, rgba(99, 102, 241, 0.18), transparent 62%), repeating-linear-gradient(0deg, rgba(37, 99, 235, 0.055) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgba(37, 99, 235, 0.055) 0 1px, transparent 1px 56px)",
      pageMaxWidth: "78rem",
      borderAlpha: 0.1,
    },
    dark: {
      canvas: "6 10 20",
      surface: "12 19 32",
      surfaceMuted: "17 26 42",
      surfaceHover: "22 34 54",
      surfaceActive: "29 44 68",
      text: "230 244 255",
      textMuted: "138 160 189",
      border: "255 255 255",
      radiusControl: "0.5rem",
      radiusSurface: "0.85rem",
      shadowSurface: "0 22px 48px -28px rgb(0 0 0 / 0.95), 0 2px 10px -4px rgb(0 0 0 / 0.6)",
      shadowOverlay: "0 28px 88px rgb(0 0 0 / 0.6), 0 4px 22px rgb(0 0 0 / 0.4)",
      glassAlpha: 0.6,
      heroGradient:
        "radial-gradient(90% 80% at 10% -8%, rgb(var(--theme-rgb) / 0.3), transparent 58%), radial-gradient(70% 70% at 94% 0%, rgba(99, 102, 241, 0.26), transparent 62%), repeating-linear-gradient(0deg, rgba(34, 211, 238, 0.09) 0 1px, transparent 1px 56px), repeating-linear-gradient(90deg, rgba(34, 211, 238, 0.09) 0 1px, transparent 1px 56px)",
      pageMaxWidth: "78rem",
      borderAlpha: 0.16,
    },
  },
  {
    id: "minimal",
    accent: "#1c1917",
    fontFamily: '"Archivo", "Public Sans", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif',
    light: {
      canvas: "251 250 248",
      surface: "255 255 255",
      surfaceMuted: "244 242 238",
      surfaceHover: "236 233 227",
      surfaceActive: "226 222 214",
      text: "23 22 20",
      textMuted: "111 107 99",
      border: "23 22 20",
      radiusControl: "0.35rem",
      radiusSurface: "0.6rem",
      shadowSurface: "0 1px 0 rgb(23 22 20 / 0.06)",
      shadowOverlay: "0 20px 60px rgb(23 22 20 / 0.16), 0 2px 8px rgb(23 22 20 / 0.06)",
      glassAlpha: 0.95,
      heroGradient:
        "radial-gradient(120% 90% at 50% -30%, rgb(var(--theme-rgb) / 0.05), transparent 60%), linear-gradient(180deg, rgba(251, 250, 248, 0) 60%, rgb(251 250 248 / 1) 100%)",
      pageMaxWidth: "70rem",
      borderAlpha: 0.14,
    },
    dark: {
      canvas: "12 12 11",
      surface: "20 20 18",
      surfaceMuted: "28 28 26",
      surfaceHover: "38 38 35",
      surfaceActive: "50 50 46",
      text: "242 240 235",
      textMuted: "157 154 146",
      border: "255 255 255",
      radiusControl: "0.35rem",
      radiusSurface: "0.6rem",
      shadowSurface: "0 1px 0 rgb(255 255 255 / 0.07)",
      shadowOverlay: "0 22px 64px rgb(0 0 0 / 0.7), 0 2px 10px rgb(0 0 0 / 0.4)",
      glassAlpha: 0.92,
      heroGradient:
        "radial-gradient(120% 90% at 50% -30%, rgb(var(--theme-rgb) / 0.18), transparent 60%), linear-gradient(180deg, rgba(12, 12, 11, 0) 60%, rgb(12 12 11 / 1) 100%)",
      pageMaxWidth: "70rem",
      borderAlpha: 0.2,
    },
  },
];

export const DEFAULT_THEME_PRESET = "official";

export function normalizeThemePreset(value: string | undefined | null): string {
  if (value && THEME_PRESETS.some((preset) => preset.id === value)) {
    return value;
  }
  return DEFAULT_THEME_PRESET;
}

export function getThemePreset(value: string | undefined | null): ThemePreset {
  const id = normalizeThemePreset(value);
  return THEME_PRESETS.find((preset) => preset.id === id) ?? THEME_PRESETS[0];
}
