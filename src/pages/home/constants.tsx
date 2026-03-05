import type { ReactNode } from "react";
import { Table2, FileCode2, Palette, Share2 } from "lucide-react";

const iconClass = "size-4";

export type NavLinkHash = {
  label: string;
  href: `#${string}`;
};

export type NavLinkRoute = {
  label: string;
  to: string;
};

export type NavLink = NavLinkHash | NavLinkRoute;

export function isNavLinkRoute(link: NavLink): link is NavLinkRoute {
  return "to" in link && !!link.to;
}

export type FeatureTab = {
  value: string;
  label: string;
  title: string;
  description: string;
  icon: ReactNode;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "Templates", to: "/template" },
  { label: "Docs", href: "#docs" },
  { label: "Editor", to: "/editor" },
];

export const FEATURE_TABS: FeatureTab[] = [
  {
    value: "diagram",
    label: "Diagram",
    title: "Diagrams/Bank schema",
    description: "Last saved: now",
    icon: <Table2 className={iconClass} />,
  },
  {
    value: "sql",
    label: "SQL Export",
    title: "SQL Output",
    description: "Generated: now",
    icon: <FileCode2 className={iconClass} />,
  },
  {
    value: "customize",
    label: "Customize",
    title: "Editor Settings",
    description: "Theme: Dark",
    icon: <Palette className={iconClass} />,
  },
  {
    value: "share",
    label: "Share",
    title: "Share Diagram",
    description: "Link copied",
    icon: <Share2 className={iconClass} />,
  },
];
