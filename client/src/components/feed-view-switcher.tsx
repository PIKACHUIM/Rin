import { useTranslation } from "react-i18next";
import { FEED_LAYOUT_OPTIONS, type FeedLayout } from "./feed-layout-options";

const LAYOUT_ICONS: Record<FeedLayout, string> = {
  list: "ri-list-check-2",
  masonry: "ri-layout-masonry-line",
  grid: "ri-grid-fill",
  magazine: "ri-newspaper-line",
};

/**
 * 首页视图切换器：只有访客侧的本地偏好，不写回站点配置。
 * 想让全站换默认视图，去后台「文章列表布局」里改。
 */
export function FeedViewSwitcher({
  value,
  onChange,
}: {
  value: FeedLayout;
  onChange: (layout: FeedLayout) => void;
}) {
  const { t } = useTranslation();
  const label = t("feed_layout.switcher_label");

  return (
    <div className="rin-view-switcher" role="group" aria-label={label}>
      {FEED_LAYOUT_OPTIONS.map((layout) => {
        const active = value === layout;
        const name = t(`feed_layout.options.${layout}`);
        return (
          <button
            key={layout}
            type="button"
            aria-pressed={active}
            title={name}
            aria-label={name}
            onClick={() => onChange(layout)}
            className={`rin-view-switcher-item ${active ? "is-active" : ""}`}
          >
            <i className={`${LAYOUT_ICONS[layout]} text-base leading-none`} aria-hidden="true" />
            <span className="rin-view-switcher-label">{name}</span>
          </button>
        );
      })}
    </div>
  );
}
