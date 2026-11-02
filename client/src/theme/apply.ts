import { getThemeTemplate, normalizeThemeTemplate } from "./templates";
import type { ThemeMode, ThemeTokens } from "./types";

const TOKEN_VARIABLES: Array<[keyof ThemeTokens, string]> = [
  ["canvas", "--rin-canvas-rgb"],
  ["surface", "--rin-surface-rgb"],
  ["surfaceMuted", "--rin-surface-muted-rgb"],
  ["surfaceHover", "--rin-surface-hover-rgb"],
  ["surfaceActive", "--rin-surface-active-rgb"],
  ["text", "--rin-text-rgb"],
  ["textMuted", "--rin-text-muted-rgb"],
  ["border", "--rin-border-rgb"],
  ["radiusControl", "--rin-radius-control"],
  ["radiusSurface", "--rin-radius-surface"],
  ["shadowSurface", "--rin-shadow-surface"],
  ["shadowOverlay", "--rin-shadow-overlay"],
  ["heroGradient", "--rin-hero-gradient"],
  ["pageMaxWidth", "--rin-page-max-width"],
];

function currentMode(): ThemeMode {
  const mode = document.documentElement.getAttribute("data-color-mode");
  return mode === "dark" ? "dark" : "light";
}

/** 把模板令牌写入 :root，供 @rin/ui、tailwind 与自定义样式共享 */
export function applyThemeTemplate(templateId: string | undefined | null, mode?: ThemeMode) {
  if (typeof document === "undefined") return;

  const template = getThemeTemplate(templateId);
  const tokens = template[mode ?? currentMode()];
  const root = document.documentElement;

  root.setAttribute("data-theme-template", template.id);

  for (const [token, variable] of TOKEN_VARIABLES) {
    root.style.setProperty(variable, tokens[token] as string);
  }

  root.style.setProperty("--rin-glass-alpha", String(tokens.glassAlpha));
  root.style.setProperty("--rin-border-alpha", String(tokens.borderAlpha));
  root.style.setProperty(
    "--rin-font-display",
    template.fontFamily ?? 'Cantarell, "Source Han Serif CN VF", "Noto Sans SC", "PingFang SC", sans-serif',
  );
  root.style.setProperty(
    "--rin-glass-surface",
    `rgb(${tokens.surface} / ${tokens.glassAlpha})`,
  );
}

/** 首页 / 顶栏壁纸：为空时仅保留模板渐变 */
export function applyThemeWallpaper(url: string | undefined | null) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  const trimmed = (url ?? "").trim();

  if (trimmed) {
    root.style.setProperty("--rin-wallpaper-image", `url("${trimmed.replace(/"/g, '\\"')}")`);
    root.setAttribute("data-theme-wallpaper", "on");
  } else {
    root.style.removeProperty("--rin-wallpaper-image");
    root.removeAttribute("data-theme-wallpaper");
  }
}

export function currentThemeTemplate() {
  if (typeof document === "undefined") return normalizeThemeTemplate(undefined);
  return normalizeThemeTemplate(document.documentElement.getAttribute("data-theme-template"));
}
