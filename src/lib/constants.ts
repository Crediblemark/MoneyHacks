import type { Category } from '@/lib/types';
import type { LucideIcon } from 'lucide-react';
import { UtensilsCrossed, CarFront, ShoppingBasket, Ellipsis, LayoutDashboard, BarChartBig, Sparkles } from 'lucide-react';

export const APP_NAME = "ChatExpense";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  "Makanan": UtensilsCrossed,
  "Transport": CarFront,
  "Belanja": ShoppingBasket,
  "Lainnya": Ellipsis,
};

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/reports", label: "Monthly Reports", icon: BarChartBig },
  { href: "/predictions", label: "AI Predictions", icon: Sparkles },
];
