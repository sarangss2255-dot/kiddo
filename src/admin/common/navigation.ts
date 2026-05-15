import { BarChart3, Gift, LayoutDashboard, Settings, Trophy, Users } from 'lucide-react';

export const marketingNavItems = [
  { label: 'Features', href: '#features' },
  { label: 'Screens', href: '#screens' },
  { label: 'Roles', href: '#roles' },
  { label: 'Downloads', href: '/kiddo-app.apk' },
  { label: 'Admin', href: '#admin' },
];

export const adminNavItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/tasks', label: 'Tasks', icon: BarChart3 },
  { to: '/admin/rewards', label: 'Rewards', icon: Gift },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];
