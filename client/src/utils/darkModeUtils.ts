import { useEffect, useState } from "react";

export type ColorMode = "light" | "dark";
export type ThemeModePreference = ColorMode | "system";

const THEME_STORAGE_KEY = "theme";

function systemColorMode(): ColorMode {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** 读取访客保存的偏好；非法值一律回落为跟随系统 */
export function readThemeModePreference(): ThemeModePreference {
  if (typeof window === "undefined") return "system";
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
}

export function resolveColorMode(preference: ThemeModePreference): ColorMode {
  return preference === "system" ? systemColorMode() : preference;
}

/**
 * 应用明暗模式。
 * persist=true 时同步写入 localStorage 并广播事件，供全站组件与主题运行时响应。
 */
export function applyThemeMode(
  preference: ThemeModePreference,
  { persist = true }: { persist?: boolean } = {},
) {
  if (typeof document === "undefined") return;

  if (persist) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // 隐私模式下写入失败不影响当前会话观感
    }
  }

  document.documentElement.setAttribute("data-color-mode", resolveColorMode(preference));

  if (persist) {
    window.dispatchEvent(new Event("colorSchemeChange"));
  }
}

/**
 * 启动时立即应用已保存的偏好（避免暗色用户看到一帧白屏），
 * 之后再跟随系统模式变化。
 */
export function listenSystemMode() {
  if (typeof window === "undefined") return;

  applyThemeMode(readThemeModePreference(), { persist: false });

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const onSystemModeChange = () => {
    if (readThemeModePreference() === "system") {
      applyThemeMode("system", { persist: false });
      window.dispatchEvent(new Event("colorSchemeChange"));
    }
  };

  mediaQuery.addEventListener("change", onSystemModeChange);
}

export function getCurrentColorMode(): ColorMode {
  return (
    (document.documentElement.getAttribute("data-color-mode") as ColorMode) || "light"
  );
}

export function useColorMode() {
  const [colorMode, setColorMode] = useState<ColorMode>(getCurrentColorMode);

  useEffect(() => {
    const updateColorMode = () => {
      setColorMode(getCurrentColorMode());
    };

    updateColorMode();
    window.addEventListener("colorSchemeChange", updateColorMode);

    return () => {
      window.removeEventListener("colorSchemeChange", updateColorMode);
    };
  }, []);

  return colorMode;
}

/** 三态偏好（亮 / 跟随系统 / 暗），供顶栏与页脚共用 */
export function useThemeModePreference() {
  const [preference, setPreference] = useState<ThemeModePreference>(readThemeModePreference);

  useEffect(() => {
    const sync = () => setPreference(readThemeModePreference());
    window.addEventListener("colorSchemeChange", sync);
    return () => window.removeEventListener("colorSchemeChange", sync);
  }, []);

  const update = (next: ThemeModePreference) => {
    applyThemeMode(next);
    setPreference(next);
  };

  return [preference, update] as const;
}
