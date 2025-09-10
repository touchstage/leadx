"use client";

import { NotificationCenter } from "@/components/notification-center";
import { SpotlightSearch } from "@/components/spotlight-search";
import { useSpotlight } from "@/hooks/use-spotlight";

export function GlobalLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, closeSpotlight } = useSpotlight();

  return (
    <>
      {children}
      <NotificationCenter />
      <SpotlightSearch isOpen={isOpen} onClose={closeSpotlight} />
    </>
  );
}
