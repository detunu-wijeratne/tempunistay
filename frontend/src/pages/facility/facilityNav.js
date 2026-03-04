import { LayoutDashboard, Inbox, Briefcase, TrendingUp, MessageSquare, Settings } from 'lucide-react';

export const navItems = [
  { to: '/facility/dashboard', label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/facility/requests',  label: 'Requests',    icon: Inbox },
  { to: '/facility/jobs',      label: 'Job Schedule',icon: Briefcase },
  { to: '/facility/reports',   label: 'Reports',     icon: TrendingUp },
  { to: '/facility/messages',  label: 'Messages',    icon: MessageSquare },
  { to: '/facility/settings',  label: 'Settings',    icon: Settings },
];
