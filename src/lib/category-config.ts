import {
  ShieldAlert,
  Network,
  TrendingUp,
  Monitor,
  Landmark,
  LayoutGrid,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const CATEGORY_CONFIG: Record<string, { order: number; icon: LucideIcon }> = {
  "info-products": { order: 0, icon: ShieldAlert },
  mlm:             { order: 1, icon: Network },
  investment:      { order: 2, icon: TrendingUp },
  "online-salon":  { order: 3, icon: Monitor },
  religion:        { order: 4, icon: Landmark },
  other:           { order: 5, icon: LayoutGrid },
};

export const DEFAULT_ICON = LayoutGrid;
