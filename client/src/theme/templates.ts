import { DEFAULT_THEME_PRESET, THEME_PRESETS } from "@rin/config";
import { CUSTOM_THEME_TEMPLATES } from "./custom-templates";
import type { ThemeTemplate } from "./types";

/**
 * 运行时主题模板注册表。
 * 预置主题来自 @rin/config（后端与客户端共用同一份定义），
 * 站点自定义主题仍然放在 ./custom-templates.ts，两者合并后按 id 去重。
 */
function mergeTemplates(...groups: ThemeTemplate[][]) {
  const merged: ThemeTemplate[] = [];
  const seen = new Set<string>();

  for (const group of groups) {
    for (const template of group) {
      if (!template?.id || seen.has(template.id)) continue;
      seen.add(template.id);
      merged.push(template);
    }
  }

  return merged;
}

/** 运行时可用模板：预置 + 自定义（按 id 去重，预置优先） */
export const THEME_TEMPLATES: ThemeTemplate[] = mergeTemplates(
  THEME_PRESETS,
  CUSTOM_THEME_TEMPLATES,
);

/** 设置页展示顺序：官方在前，四套主推风格紧随其后 */
const FEATURED_TEMPLATE_ORDER = ["official", "fresh", "cute", "tech", "minimal"];

THEME_TEMPLATES.sort((a, b) => {
  const aIndex = FEATURED_TEMPLATE_ORDER.indexOf(a.id);
  const bIndex = FEATURED_TEMPLATE_ORDER.indexOf(b.id);
  if (aIndex === -1 && bIndex === -1) return 0;
  if (aIndex === -1) return 1;
  if (bIndex === -1) return -1;
  return aIndex - bIndex;
});

/**
 * 运行时注册一套主题，返回是否注册成功（id 重复会被忽略）。
 * 适合插件或按远端配置动态加载主题的场景。
 */
export function registerThemeTemplate(template: ThemeTemplate) {
  if (!template?.id || THEME_TEMPLATES.some((item) => item.id === template.id)) {
    return false;
  }
  THEME_TEMPLATES.push(template);
  return true;
}

export function listThemeTemplates() {
  return THEME_TEMPLATES;
}

export type ThemeTemplateId = string;

export const DEFAULT_THEME_TEMPLATE = DEFAULT_THEME_PRESET;

export function normalizeThemeTemplate(value: string | undefined | null): ThemeTemplateId {
  if (value && THEME_TEMPLATES.some((template) => template.id === value)) {
    return value;
  }
  return DEFAULT_THEME_TEMPLATE;
}

export function getThemeTemplate(value: string | undefined | null): ThemeTemplate {
  const id = normalizeThemeTemplate(value);
  return THEME_TEMPLATES.find((template) => template.id === id) ?? THEME_TEMPLATES[0];
}
