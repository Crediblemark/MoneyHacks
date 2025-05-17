
import type { Category } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { UtensilsCrossed, CarFront, ShoppingBasket, Ellipsis, LayoutDashboard, BarChartBig, Sparkles } from 'lucide-react';

// APP_NAME_KEY will be used to look up translations
export const APP_NAME_KEY = "appName";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  "Makanan": UtensilsCrossed,
  "Transport": CarFront,
  "Belanja": ShoppingBasket,
  "Lainnya": Ellipsis,
};

// NAV_ITEMS now use labelKey for translation
export const NAV_ITEMS = [
  { href: "/", labelKey: "navDashboard", icon: LayoutDashboard },
  { href: "/reports", labelKey: "navMonthlyReports", icon: BarChartBig },
  { href: "/predictions", labelKey: "navAIPredictions", icon: Sparkles },
];

// Helper to get translated category name
export const getTranslatedCategory = (category: Category, t: any): string => {
  switch (category) {
    case "Makanan": return t.categoryMakanan;
    case "Transport": return t.categoryTransport;
    case "Belanja": return t.categoryBelanja;
    case "Lainnya": return t.categoryLainnya;
    default: return category;
  }
};
