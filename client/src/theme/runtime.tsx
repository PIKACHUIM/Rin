import { useEffect } from "react";
import { useColorMode } from "../utils/darkModeUtils";
import { applyThemeTemplate, applyThemeWallpaper } from "./apply";

/**
 * 主题运行时：把模板与壁纸配置写入 :root，并在明暗模式切换时重新应用。
 * 挂载在 AppProviders 内部，配置变化后自动生效。
 */
export function ThemeRuntime({
  template,
  wallpaper,
}: {
  template: string | undefined | null;
  wallpaper: string | undefined | null;
}) {
  const colorMode = useColorMode();

  useEffect(() => {
    applyThemeTemplate(template, colorMode);
  }, [template, colorMode]);

  useEffect(() => {
    applyThemeWallpaper(wallpaper);
  }, [wallpaper]);

  return null;
}
