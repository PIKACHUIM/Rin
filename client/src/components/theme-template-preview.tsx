import { getThemeTemplate } from "../theme/templates";

/**
 * 主题模板预览卡片：用模板自身的令牌绘制缩略界面，避免依赖全局主题变量。
 */
export function ThemeTemplatePreview({
  templateId,
  accentColor,
  selected,
  title,
  description,
  onClick,
}: {
  templateId: string;
  accentColor?: string;
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  const template = getThemeTemplate(templateId);
  const tokens = template.light;
  const accent = accentColor || template.accent;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full flex-col rounded-2xl border p-3 text-left transition-all ${
        selected
          ? "border-theme bg-theme/5 shadow-sm shadow-theme/10"
          : "border-black/10 hover:border-black/20 hover:shadow-sm dark:border-white/10 dark:hover:border-white/20"
      }`}
    >
      <div
        className="relative w-full overflow-hidden p-3"
        style={{
          borderRadius: tokens.radiusSurface,
          backgroundColor: `rgb(${tokens.canvas})`,
          backgroundImage: tokens.heroGradient.replace(/var\(--theme-rgb\)/g, hexToRgbSpace(accent)),
          border: `1px solid rgb(${tokens.border} / ${tokens.borderAlpha})`,
        }}
      >
        <div
          className="flex items-center justify-between gap-2 px-2 py-1.5"
          style={{
            borderRadius: 9999,
            backgroundColor: `rgb(${tokens.surface} / ${tokens.glassAlpha})`,
            boxShadow: tokens.shadowSurface,
          }}
        >
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span
              className="inline-block h-1.5 w-10 rounded-full"
              style={{ backgroundColor: `rgb(${tokens.text} / 0.75)` }}
            />
          </span>
          <span className="flex items-center gap-1">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="inline-block h-1.5 rounded-full"
                style={{
                  width: index === 0 ? 14 : 10,
                  backgroundColor:
                    index === 0 ? accent : `rgb(${tokens.textMuted} / 0.65)`,
                }}
              />
            ))}
          </span>
        </div>

        <div
          className="mt-3 flex flex-col gap-2 p-2.5"
          style={{
            borderRadius: tokens.radiusControl,
            backgroundColor: `rgb(${tokens.surface})`,
            boxShadow: tokens.shadowSurface,
          }}
        >
          <span
            className="inline-block h-2 w-3/5 rounded-full"
            style={{ backgroundColor: `rgb(${tokens.text} / 0.85)` }}
          />
          <span
            className="inline-block h-1.5 w-full rounded-full"
            style={{ backgroundColor: `rgb(${tokens.textMuted} / 0.45)` }}
          />
          <span
            className="inline-block h-1.5 w-4/5 rounded-full"
            style={{ backgroundColor: `rgb(${tokens.textMuted} / 0.35)` }}
          />
          <span
            className="mt-1 inline-block h-4 w-16 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-medium t-primary">{title}</span>
        {selected ? <i className="ri-check-line text-theme" /> : null}
      </div>
      <p className="mt-1 text-xs leading-relaxed t-secondary">{description}</p>
    </button>
  );
}

function hexToRgbSpace(hex: string) {
  const normalized = hex.replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  const r = Number.parseInt(full.slice(0, 2), 16) || 0;
  const g = Number.parseInt(full.slice(2, 4), 16) || 0;
  const b = Number.parseInt(full.slice(4, 6), 16) || 0;
  return `${r} ${g} ${b}`;
}
