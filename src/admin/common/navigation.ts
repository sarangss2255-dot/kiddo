import {
  LayoutDashboard,
  Users,
  Award,
  GraduationCap,
  ClipboardList,
  Gift,
  ShoppingBag,
  User,
  Trophy,
  Gamepad2,
  CreditCard,
  TrendingUp,
  Settings,
} from 'lucide-react';

export interface AdminNavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
}

export interface AdminNavSection {
  label: string;
  items: AdminNavItem[];
}

export const adminNavSections: AdminNavSection[] = [
  {
    label: 'Navigation',
    items: [{ to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    label: 'Users',
    items: [
      { to: '/admin/parents', label: 'Parents', icon: Users },
      { to: '/admin/children', label: 'Children', icon: Award },
      { to: '/admin/teachers', label: 'Teachers', icon: GraduationCap },
    ],
  },
  {
    label: 'KidDo',
    items: [
      { to: '/admin/missions', label: 'Missions', icon: ClipboardList },
      { to: '/admin/rewards', label: 'Rewards', icon: Gift },
      { to: '/admin/marketplace', label: 'Marketplace', icon: ShoppingBag },
      { to: '/admin/avatars', label: 'Avatars', icon: User },
      { to: '/admin/leaderboard', label: 'Leaderboard', icon: Trophy },
      { to: '/admin/games', label: 'Games', icon: Gamepad2 },
    ],
  },
  {
    label: 'Reports',
    items: [{ to: '/admin/reports', label: 'Growth Reports', icon: TrendingUp }],
  },
  {
    label: 'System',
    items: [
      { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
    ],
  },
];
