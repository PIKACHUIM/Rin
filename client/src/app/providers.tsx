import type { ReactNode } from "react";
import { Helmet } from "react-helmet";
import type { ConfigWrapper } from "@rin/config";
import type { Profile } from "../state/profile";
import { ClientConfigContext } from "../state/config";
import { ProfileContext } from "../state/profile";
import { ThemeRuntime } from "../theme/runtime";

export function AppProviders({
  children,
  config,
  profile,
}: {
  children: ReactNode;
  config: ConfigWrapper;
  profile: Profile | undefined | null;
}) {
  return (
    <ClientConfigContext.Provider value={config}>
      <ProfileContext.Provider value={profile}>
        <ThemeRuntime
          template={config.get<string>("theme.template")}
          wallpaper={config.get<string>("theme.wallpaper")}
        />
        <Helmet>
          <link rel="icon" href="/favicon.ico" />
        </Helmet>
        {children}
      </ProfileContext.Provider>
    </ClientConfigContext.Provider>
  );
}
