import { LayoutDashboard, UtensilsCrossed, ClipboardList, PlusCircle, TrendingUp, MessageSquare, Settings } from 'lucide-react';

export const navItems = [
  { to: '/meal/dashboard', label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/meal/menu',      label: 'Menu',         icon: UtensilsCrossed },
  { to: '/meal/orders',    label: 'Orders',       icon: ClipboardList },
  { to: '/meal/add-item',  label: 'Add Item',     icon: PlusCircle },
  { to: '/meal/sales',     label: 'Sales Report', icon: TrendingUp },
  { to: '/meal/messages',  label: 'Messages',     icon: MessageSquare },
  { to: '/meal/settings',  label: 'Settings',     icon: Settings },
];
