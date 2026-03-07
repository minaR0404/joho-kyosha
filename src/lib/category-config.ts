import {
  ShieldAlert,
  Network,
  TrendingUp,
  Bitcoin,
  Building,
  Monitor,
  Briefcase,
  GraduationCap,
  Heart,
  Users,
  DoorOpen,
  Gem,
  Banknote,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "info-products": ShieldAlert,
  mlm: Network,
  "investment-school": TrendingUp,
  "crypto-fx": Bitcoin,
  "real-estate": Building,
  "online-salon": Monitor,
  "side-job": Briefcase,
  school: GraduationCap,
  "beauty-health": Heart,
  marriage: Users,
  "door-to-door": DoorOpen,
  "precious-metals": Gem,
  factoring: Banknote,
  religion: Landmark,
  other: LayoutGrid,
};

export const DEFAULT_ICON = LayoutGrid;

export function getCategoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] || DEFAULT_ICON;
}
