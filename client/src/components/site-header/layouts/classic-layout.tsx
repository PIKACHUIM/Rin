import { BrandLink, HeaderActions, Menu, NavBar } from "..";
import { PreviewActions, PreviewBrand, PreviewCanvas, PreviewContent, PreviewNav } from "../preview-primitives";
import type { HeaderLayoutDefinition } from "../layout-types";

const PREVIEW_ITEMS = ["Home", "Timeline", "Moments"];

export const classicLayoutDefinition: HeaderLayoutDefinition = {
  kind: "top",
  renderDesktop({ children, profile, siteConfig }) {
    return (
      <div className="rin-classic-header hidden w-full items-center justify-between gap-8 md:flex">
        <BrandLink
          siteConfig={siteConfig}
          className="rin-header-brand mr-auto hidden min-w-0 flex-row items-center md:flex"
          avatarClassName="h-10 w-10 rounded-full"
          titleClassName="text-base font-semibold tracking-tight t-primary"
          descriptionClassName="max-w-48"
        />
        <nav aria-label="Main navigation" className="rin-main-nav flex min-w-0 flex-1 items-center justify-center">
          <div className="scrollbar-none min-w-0 max-w-full overflow-x-auto">
            <div className="flex min-w-max flex-row items-center whitespace-nowrap">
              <NavBar menu={false} itemClassName="rin-nav-link whitespace-nowrap px-3 py-3 md:px-3 md:py-4 text-sm" />
            </div>
          </div>
        </nav>
        <div className="rin-header-actions ml-auto hidden shrink-0 flex-row items-center gap-1 md:flex">
          {children ? <div className="flex items-center text-sm t-primary">{children}</div> : null}
          <HeaderActions profile={profile} plain className="flex flex-row items-center gap-1" />
        </div>
      </div>
    );
  },
  renderMobile({ children, profile, siteConfig }) {
    return (
      <div className="rin-mobile-header flex w-full flex-row items-center justify-between gap-3 py-2 md:hidden">
        <BrandLink
          siteConfig={siteConfig}
          compact
          className="visible min-w-0 flex flex-row items-center opacity-100 duration-300 md:hidden"
          avatarClassName="h-9 w-9 rounded-full"
          titleClassName="text-sm font-semibold t-primary"
          descriptionClassName="max-w-48"
        />
        <div className="flex shrink-0 items-center gap-1">
          {children ? <div className="flex items-center text-sm t-primary">{children}</div> : null}
          <Menu profile={profile} />
        </div>
      </div>
    );
  },
  renderPreview(data) {
    return (
      <PreviewCanvas className="w-full overflow-hidden rounded-[22px] p-3">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          <PreviewBrand data={data} />
          <div className="mx-2 flex min-w-0 items-center justify-center">
            <div className="max-w-full rounded-full bg-white px-2 py-2 shadow-lg shadow-black/5 ring-1 ring-black/5 dark:bg-white/[0.08] dark:shadow-black/20 dark:ring-white/10">
              <PreviewNav center items={PREVIEW_ITEMS} themeColor={data.themeColor} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-black/[0.04] dark:bg-white/[0.08]" />
            <PreviewActions themeColor={data.themeColor} />
          </div>
        </div>
        <PreviewContent />
      </PreviewCanvas>
    );
  },
  renderRouteShell({ header, content, footer }) {
    return (
      <>
        {header}
        {content}
        {footer}
      </>
    );
  },
};
