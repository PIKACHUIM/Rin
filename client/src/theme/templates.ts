import type { ThemeTemplate } from "./types";

/**
 * 内置主题模板注册表。
 * 新增模板只需在此追加一项，设置页与运行时会自动识别（模板化配置）。
 */
export const THEME_TEMPLATES: ThemeTemplate[] = [
  {
    id: "aurora",
    accent: "#fc466b",
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
    id: "fuwari",
    accent: "#e93796",
    light: {
      canvas: "247 247 251",
      surface: "255 255 255",
      surfaceMuted: "246 244 250",
      surfaceHover: "240 238 248",
      surfaceActive: "229 226 240",
      text: "30 27 40",
      textMuted: "110 106 128",
      border: "30 27 40",
      radiusControl: "0.9rem",
      radiusSurface: "1.5rem",
      shadowSurface: "0 20px 45px -30px rgb(76 60 120 / 0.45), 0 2px 6px -3px rgb(76 60 120 / 0.12)",
      shadowOverlay: "0 26px 80px rgb(30 27 40 / 0.2), 0 4px 18px rgb(30 27 40 / 0.1)",
      glassAlpha: 0.78,
      heroGradient:
        "linear-gradient(180deg, rgba(233, 55, 150, 0.14), rgba(247, 247, 251, 0) 72%), radial-gradient(80% 80% at 80% 0%, rgba(120, 119, 198, 0.16), transparent 60%)",
      pageMaxWidth: "68rem",
      borderAlpha: 0.06,
    },
    dark: {
      canvas: "23 22 30",
      surface: "31 30 41",
      surfaceMuted: "39 37 51",
      surfaceHover: "47 45 61",
      surfaceActive: "57 54 73",
      text: "246 243 252",
      textMuted: "178 172 196",
      border: "255 255 255",
      radiusControl: "0.9rem",
      radiusSurface: "1.5rem",
      shadowSurface: "0 24px 50px -30px rgb(0 0 0 / 0.9), 0 2px 8px -3px rgb(0 0 0 / 0.55)",
      shadowOverlay: "0 30px 90px rgb(0 0 0 / 0.55), 0 4px 22px rgb(0 0 0 / 0.35)",
      glassAlpha: 0.7,
      heroGradient:
        "linear-gradient(180deg, rgba(233, 55, 150, 0.2), rgba(23, 22, 30, 0) 70%), radial-gradient(80% 80% at 82% 0%, rgba(120, 119, 198, 0.2), transparent 62%)",
      pageMaxWidth: "68rem",
      borderAlpha: 0.1,
    },
  },
  {
    id: "noir",
    accent: "#111111",
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
];

export const THEME_TEMPLATE_IDS = THEME_TEMPLATES.map((template) => template.id);

export type ThemeTemplateId = string;

export const DEFAULT_THEME_TEMPLATE = "aurora";

export function normalizeThemeTemplate(value: string | undefined | null): ThemeTemplateId {
  if (value && THEME_TEMPLATE_IDS.includes(value)) {
    return value;
  }
  return DEFAULT_THEME_TEMPLATE;
}

export function getThemeTemplate(value: string | undefined | null): ThemeTemplate {
  const id = normalizeThemeTemplate(value);
  return THEME_TEMPLATES.find((template) => template.id === id) ?? THEME_TEMPLATES[0];
}
