import { useTranslation } from "react-i18next";
import Popup from "reactjs-popup";
import {
  useThemeModePreference,
  type ThemeModePreference,
} from "../../../utils/darkModeUtils";
import { HEADER_POPUP_PANEL_CLASS } from "../shared";

const MODE_OPTIONS: Array<{ value: ThemeModePreference; icon: string }> = [
  { value: "light", icon: "ri-sun-line" },
  { value: "system", icon: "ri-computer-line" },
  { value: "dark", icon: "ri-moon-line" },
];

const MODE_ICONS: Record<ThemeModePreference, string> = {
  light: "ri-sun-line",
  system: "ri-computer-line",
  dark: "ri-moon-line",
};

/**
 * 明暗模式切换：亮 / 跟随系统 / 暗 三态，与页脚共用同一份偏好。
 * - 默认：顶栏图标 + 弹层；
 * - inline：移动端菜单里直接铺开三个按钮，避免弹层嵌套。
 */
export function ThemeModeSwitch({
  className = "",
  plain = false,
  popoverUp = false,
  inline = false,
}: {
  className?: string;
  plain?: boolean;
  popoverUp?: boolean;
  inline?: boolean;
}) {
  const { t } = useTranslation();
  const [mode, setMode] = useThemeModePreference();
  const title = t("settings.theme_mode.title");

  if (inline) {
    return (
      <div
        className={className + " inline-flex flex-row items-center gap-0.5 rounded-full border border-black/10 p-0.5 dark:border-white/10"}
        role="group"
        aria-label={title}
      >
        {MODE_OPTIONS.map(({ value, icon }) => {
          const active = mode === value;
          const name = t(`settings.theme_mode.${value}`);
          return (
            <button
              key={value}
              type="button"
              title={name}
              aria-label={name}
              aria-pressed={active}
              onClick={() => setMode(value)}
              className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                active
                  ? "bg-theme/10 text-theme"
                  : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
              }`}
            >
              <i className={`${icon} text-base`} aria-hidden="true" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={className + " flex flex-row items-center"}>
      <Popup
        arrow={false}
        position={popoverUp ? "top left" : "bottom right"}
        closeOnDocumentClick
        trigger={
          <button
            type="button"
            title={`${title}: ${t(`settings.theme_mode.${mode}`)}`}
            aria-label={title}
            className={
              plain
                ? "flex aspect-[1] items-center justify-center px-1.5 text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                : "flex aspect-[1] items-center justify-center rounded-full border bg-w px-2 t-primary bg-button dark:border-neutral-600"
            }
          >
            <i className={`${MODE_ICONS[mode]}`} aria-hidden="true" />
          </button>
        }
      >
        <div className={`${HEADER_POPUP_PANEL_CLASS} mt-2 min-w-40`}>
          <p className="px-3 pt-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
            {title}
          </p>
          {MODE_OPTIONS.map(({ value, icon }) => {
            const active = mode === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={active}
                onClick={() => setMode(value)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm t-primary transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              >
                <i className={`${icon} text-base`} aria-hidden="true" />
                <span className="flex-1">{t(`settings.theme_mode.${value}`)}</span>
                {active ? <i className="ri-check-line text-theme" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      </Popup>
    </div>
  );
}
