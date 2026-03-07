import {
  ShieldAlert,
  Network,
  TrendingUp,
  Monitor,
  Briefcase,
  Heart,
  DoorOpen,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "info-products": ShieldAlert,
  mlm: Network,
  investment: TrendingUp,
  "online-salon": Monitor,
  "side-job-school": Briefcase,
  "beauty-health": Heart,
  "door-to-door": DoorOpen,
  religion: Landmark,
  other: LayoutGrid,
};

export const DEFAULT_ICON = LayoutGrid;

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] || DEFAULT_ICON;
}
