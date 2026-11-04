/**
 * 主题类型统一由 @rin/config 提供（后端预置主题注册表），
 * 客户端只做兼容性转出，避免两处定义漂移。
 */
export type { ThemeMode, ThemePreset as ThemeTemplate, ThemeTokens } from "@rin/config";
