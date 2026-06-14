import type { LucideIcon } from "lucide-react";
import { Palette, Code2, Megaphone, Eye, Users } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  palette: Palette,
  code: Code2,
  megaphone: Megaphone,
  eye: Eye,
  users: Users,
};

export const CATEGORY_COLOR_STYLES: Record<
  string,
  {
    iconBg: string;
    iconText: string;
    badgeBg: string;
    badgeText: string;
    progress: string;
  }
> = {
  "dark-blue": {
    iconBg: "bg-[#eef2ff]",
    iconText: "text-[#0b3c95]",
    badgeBg: "bg-[#eef2ff]",
    badgeText: "text-[#0b3c95]",
    progress: "bg-[#0b3c95]",
  },
  brown: {
    iconBg: "bg-[#fef3e7]",
    iconText: "text-[#5c2407]",
    badgeBg: "bg-[#fef3e7]",
    badgeText: "text-[#5c2407]",
    progress: "bg-[#5c2407]",
  },
  slate: {
    iconBg: "bg-[#f1f5f9]",
    iconText: "text-[#4e5d73]",
    badgeBg: "bg-[#f1f5f9]",
    badgeText: "text-[#4e5d73]",
    progress: "bg-[#4e5d73]",
  },
  "royal-blue": {
    iconBg: "bg-[#eff6ff]",
    iconText: "text-[#1d4ed8]",
    badgeBg: "bg-[#eff6ff]",
    badgeText: "text-[#1d4ed8]",
    progress: "bg-[#1d4ed8]",
  },
  "red-brown": {
    iconBg: "bg-[#fef2f2]",
    iconText: "text-[#b92c1c]",
    badgeBg: "bg-[#fef2f2]",
    badgeText: "text-[#b92c1c]",
    progress: "bg-[#b92c1c]",
  },
};

export function getCategoryIcon(iconId: string) {
  return CATEGORY_ICONS[iconId] ?? Palette;
}

export function getCategoryColorStyles(colorId: string) {
  return CATEGORY_COLOR_STYLES[colorId] ?? CATEGORY_COLOR_STYLES["dark-blue"];
}
