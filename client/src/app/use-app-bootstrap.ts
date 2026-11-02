import { useEffect, useRef, useState } from "react";
import { ConfigWrapper } from "@rin/config";
import type { Profile } from "../state/profile";
import { defaultClientConfig } from "../state/config";
import { applyThemeColor } from "../utils/theme-color";
import { applyThemeTemplate, applyThemeWallpaper } from "../theme/apply";
import { readBootstrappedClientConfig } from "./bootstrap-config";
import { client } from "./runtime";

function applyViewportScaling() {
  const highResolutionThreshold = 2560;
  document.documentElement.style.fontSize = window.screen.width >= highResolutionThreshold ? "125%" : "100%";
}

export function useAppBootstrap() {
  const initializedRef = useRef(false);
  const [profile, setProfile] = useState<Profile | undefined | null>(undefined);
  const [config, setConfig] = useState<ConfigWrapper>(new ConfigWrapper({}, new Map()));

  useEffect(() => {
    applyViewportScaling();

    if (initializedRef.current) {
      return;
    }

    const updateClientConfig = (nextConfig: Record<string, unknown>) => {
      sessionStorage.setItem("config", JSON.stringify(nextConfig));
      setConfig(new ConfigWrapper(nextConfig, defaultClientConfig));
      applyThemeColor(typeof nextConfig["theme.color"] === "string" ? nextConfig["theme.color"] : undefined);
      applyThemeTemplate(typeof nextConfig["theme.template"] === "string" ? nextConfig["theme.template"] : undefined);
      applyThemeWallpaper(typeof nextConfig["theme.wallpaper"] === "string" ? nextConfig["theme.wallpaper"] : undefined);
    };

    client.user.profile().then(({ data, error }) => {
      if (data) {
        setProfile({
          id: data.id,
          avatar: data.avatar || "",
          permission: data.permission,
          name: data.username,
        });
      } else if (error) {
        setProfile(null);
      }
    });

    const cachedConfig = sessionStorage.getItem("config");
    const bootstrappedConfig = readBootstrappedClientConfig();

    if (bootstrappedConfig) {
      updateClientConfig(bootstrappedConfig);
    } else if (cachedConfig) {
      const configObject = JSON.parse(cachedConfig) as Record<string, unknown>;
      updateClientConfig(configObject);
    }

    initializedRef.current = true;
  }, []);

  return { config, profile };
}
