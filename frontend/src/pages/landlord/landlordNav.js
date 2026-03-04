import { LayoutDashboard, Home, ClipboardCheck, Users, Wallet, Wrench, MessageSquare, Settings } from 'lucide-react';

export const navItems = [
  { to: '/landlord/dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
  { to: '/landlord/properties', label: 'Properties',       icon: Home },
  { to: '/landlord/bookings',   label: 'Bookings',         icon: ClipboardCheck },
  { to: '/landlord/tenants',    label: 'Tenants',          icon: Users },
  { to: '/landlord/payments',   label: 'Payments',         icon: Wallet },
  { to: '/landlord/requests',   label: 'Service Requests', icon: Wrench },
  { to: '/landlord/messages',   label: 'Messages',         icon: MessageSquare },
  { to: '/landlord/settings',   label: 'Settings',         icon: Settings },
];
