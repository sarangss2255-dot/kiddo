import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, LogOut, Menu, RefreshCw, Shield } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/Tooltip';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '../../components/ui/Sheet';
import { cn } from '../../lib/utils';
import { brandContent } from '../common/content';
import { adminNavSections } from '../common/navigation';
import { dispatchAdminRefresh } from '../common/useAdminRefresh';
import { useAuth } from '../context/AuthContext';

interface SidebarContentProps {
  pathname: string;
  userName: string;
  initials: string | null;
  onNavigate?: () => void;
  onLogout: () => void;
}

function SidebarContent({ pathname, userName, initials, onNavigate, onLogout }: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col gap-5 p-4">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 pt-1">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-kiddo-navy/10 bg-white shadow-sm">
          <img src="/kiddo-logo.png" alt="KidDo" className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0">
          <span className="block font-display text-lg font-bold leading-tight text-kiddo-navy">
            {brandContent.name}
          </span>
          <Badge
            variant="accent"
            className="mt-0.5 px-1.5 py-0 text-[8px] font-black uppercase tracking-widest"
          >
            {brandContent.adminLabel}
          </Badge>
        </div>
      </div>

      {/* Admin Profile */}
      <div className="rounded-2xl border border-kiddo-blue/20 bg-kiddo-blue/10 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-kiddo-navy text-sm font-bold uppercase text-white shadow-sm">
            {initials ?? <Shield size={16} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-kiddo-navy">{userName}</p>
            <span className="mt-0.5 inline-flex items-center rounded-full bg-white/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-kiddo-muted">
              Administrator
            </span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
        {adminNavSections.map((section) => (
          <div key={section.label}>
            <span className="mb-2 block px-3 text-[10px] font-black uppercase tracking-[0.2em] text-kiddo-muted/80">
              {section.label}
            </span>
            <div className="space-y-1">
              {section.items.map((link) => {
                const isActive = pathname === link.to;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    href={link.to}
                    onClick={onNavigate}
                    aria-current={isActive ? 'page' : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors duration-200',
                      isActive
                        ? 'bg-kiddo-navy text-white shadow-sm shadow-kiddo-navy/20'
                        : 'text-kiddo-muted hover:bg-kiddo-navy/5 hover:text-kiddo-navy',
                    )}
                  >
                    <Icon
                      size={18}
                      className={cn(
                        'shrink-0 transition-colors',
                        isActive ? 'text-white' : 'text-kiddo-muted group-hover:text-kiddo-navy',
                      )}
                    />
                    <span className="truncate">{link.label}</span>
                    {isActive && <ChevronRight size={14} className="ml-auto shrink-0 opacity-50" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className="border-t border-kiddo-navy/10 pt-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start gap-2.5 rounded-xl px-3 font-bold text-kiddo-muted hover:text-kiddo-navy"
        >
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </div>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userName = user ? `${user.firstName} ${user.lastName}`.trim() || 'Admin' : 'Admin';
  const initials = user?.firstName?.[0]?.toUpperCase() ?? null;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex h-dvh overflow-hidden bg-kiddo-warm font-sans text-kiddo-navy antialiased">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden w-64 shrink-0 border-r border-kiddo-navy/10 bg-white lg:block">
          <SidebarContent
            pathname={pathname}
            userName={userName}
            initials={initials}
            onLogout={logout}
          />
        </aside>

        {/* MOBILE / TABLET DRAWER */}
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="left"
            className="w-[280px] max-w-[85vw] border-r border-kiddo-navy/10 bg-white p-0"
          >
            <SheetTitle className="sr-only">
              {brandContent.name} {brandContent.adminLabel}
            </SheetTitle>
            <SheetDescription className="sr-only">
              Admin workspace navigation
            </SheetDescription>
            <SidebarContent
              pathname={pathname}
              userName={userName}
              initials={initials}
              onNavigate={() => setSidebarOpen(false)}
              onLogout={logout}
            />
          </SheetContent>
        </Sheet>

        {/* MAIN WORKSPACE */}
        <main className="flex min-w-0 flex-1 flex-col">
          {/* Sticky Top Bar */}
          <header className="z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-kiddo-navy/10 bg-white/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                className="h-9 w-9 shrink-0 rounded-xl border-kiddo-navy/10 lg:hidden"
              >
                <Menu size={18} />
              </Button>
              <h1 className="truncate font-display text-base font-bold text-kiddo-navy sm:text-lg">
                {brandContent.adminLabel}
              </h1>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              <Badge
                variant="success"
                className="hidden items-center gap-2 border-none bg-kiddo-green/10 px-3 py-1 font-bold normal-case tracking-normal sm:inline-flex"
              >
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-kiddo-green" />
                System Live
              </Badge>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={dispatchAdminRefresh}
                    aria-label="Refresh data"
                    className="h-9 w-9 rounded-xl text-kiddo-muted hover:bg-kiddo-warm hover:text-kiddo-navy"
                  >
                    <RefreshCw size={17} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh data</TooltipContent>
              </Tooltip>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={pathname}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
    </TooltipProvider>
  );
}
