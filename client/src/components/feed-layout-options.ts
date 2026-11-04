export const FEED_LAYOUT_OPTIONS = ["list", "masonry", "grid", "magazine"] as const;

export type FeedLayout = (typeof FEED_LAYOUT_OPTIONS)[number];

export function normalizeFeedLayout(value: string | undefined | null): FeedLayout {
  return FEED_LAYOUT_OPTIONS.includes(value as FeedLayout) ? (value as FeedLayout) : "list";
}

/**
 * 统一的列表容器类名。
 * 所有使用 FeedCard 的页面都走这里，保证设置页切换布局后各页表现一致。
 */
export function feedListClassName(layout: FeedLayout) {
  return `rin-feed-list rin-feed-list--${normalizeFeedLayout(layout)}`;
}

const FEED_LAYOUT_STORAGE_KEY = "rin.feed.view";

/** 访客在首页手动选择的视图，优先级高于站点默认值 */
export function readStoredFeedLayout(): FeedLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(FEED_LAYOUT_STORAGE_KEY);
    return FEED_LAYOUT_OPTIONS.includes(value as FeedLayout) ? (value as FeedLayout) : null;
  } catch {
    return null;
  }
}

export function storeFeedLayout(layout: FeedLayout) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FEED_LAYOUT_STORAGE_KEY, layout);
  } catch {
    // 隐私模式下 localStorage 会被禁用，忽略即可
  }
}
