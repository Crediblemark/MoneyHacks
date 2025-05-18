
import type { DefaultCategory, Category } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { UtensilsCrossed, CarFront, ShoppingBasket, Ellipsis, LayoutDashboard, BarChartBig, Sparkles, Brain, ShieldCheck, Target, Tag, Settings } from 'lucide-react'; // Added Settings

// APP_NAME_KEY will be used to look up translations
export const APP_NAME_KEY = "appName";

export const DEFAULT_CATEGORY_ICONS: Record<DefaultCategory, LucideIcon> = {
  "Makanan": UtensilsCrossed,
  "Transport": CarFront,
  "Belanja": ShoppingBasket,
  "Lainnya": Ellipsis,
};

export const GENERIC_CATEGORY_ICON: LucideIcon = Tag; // Default icon for new categories

// NAV_ITEMS now use labelKey for translation
export const NAV_ITEMS = [
  { href: "/", labelKey: "navDashboard", icon: LayoutDashboard },
  { href: "/reports", labelKey: "navMonthlyReports", icon: BarChartBig },
  { href: "/predictions", labelKey: "navAIPredictions", icon: Sparkles },
  { href: "/analysis", labelKey: "navSelfReflectionAnalysis", icon: Brain },
  { href: "/goals", labelKey: "navFinancialGoals", icon: Target },
  { href: "/health-check", labelKey: "navHealthCheck", icon: ShieldCheck },
  { href: "/settings", labelKey: "navSettings", icon: Settings }, // Added Settings
];

// Helper to get translated category name
export const getTranslatedCategory = (category: Category, t: any): string => {
  switch (category) {
    case "Makanan": return t.categoryMakanan;
    case "Transport": return t.categoryTransport; // Assuming 'Transport' is the key used internally now
    case "Belanja": return t.categoryBelanja;
    case "Lainnya": return t.categoryLainnya;
    default: return category; // For dynamic categories, return the name itself
  }
};

export const NEEDS_CATEGORIES_FOR_REPORT: DefaultCategory[] = ["Makanan", "Transport"];

