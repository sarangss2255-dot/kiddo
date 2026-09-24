import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, LogOut, Menu, RefreshCw, Shield, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { cn } from '../../lib/utils';
import { brandContent } from '../common/content';
import { adminNavSections } from '../common/navigation';
import { dispatchAdminRefresh } from '../common/useAdminRefresh';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-kiddo-warm text-kiddo-navy font-sans antialiased overflow-hidden">
      {/* MOBILE SIDEBAR TRIGGER */}
      <div className="md:hidden fixed top-6 left-6 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-12 h-12 p-0 rounded-2xl bg-white border-kiddo-navy/10 shadow-xl"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* SIDEBAR NAVIGATION */}
      <aside
        className={cn(
          "fixed md:sticky top-0 bottom-0 left-0 z-40 w-72 bg-white border-r border-kiddo-navy/10 transition-all duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="h-full flex flex-col p-8">
          {/* Brand Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-10 h-10 rounded-2xl bg-white shadow-sm border border-kiddo-navy/10 flex items-center justify-center overflow-hidden">
              <img src="/kiddo-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-display font-bold text-xl block leading-tight">{brandContent.name}</span>
              <Badge variant="accent" className="px-1.5 py-0 text-[8px] font-black uppercase tracking-widest mt-0.5">
                {brandContent.adminLabel}
              </Badge>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="p-4 mb-6 rounded-2xl bg-kiddo-blue/10 border border-kiddo-blue/20 shadow-none">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-kiddo-navy text-white flex items-center justify-center text-xl font-bold shadow-sm uppercase shrink-0">
                {user?.firstName?.[0] ?? <Shield size={18} />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm truncate">
                  {user ? `${user.firstName} ${user.lastName}`.trim() : 'Administrator'}
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="info" className="text-[9px] px-1.5 py-0 normal-case tracking-normal">
                    Administrator
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Menu */}
          <nav className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {adminNavSections.map((section) => (
              <div key={section.label} className="space-y-2">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-kiddo-muted px-4 mb-3">
                  {section.label}
                </span>
                {section.items.map((link) => {
                  const isActive = pathname === link.to;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      href={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center justify-between group px-4 py-3.5 rounded-2xl transition-all duration-200",
                        isActive
                          ? "bg-kiddo-navy text-white shadow-xl shadow-kiddo-navy/10"
                          : "text-kiddo-muted hover:text-kiddo-navy hover:bg-kiddo-navy/5"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <Icon size={20} className={cn(isActive ? "text-white" : "text-kiddo-muted group-hover:text-kiddo-navy")} />
                        <span className="font-bold text-sm">{link.label}</span>
                      </div>
                      {isActive && <ChevronRight size={14} className="opacity-40" />}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="pt-6 space-y-4 border-t border-kiddo-navy/10">
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full h-10 rounded-xl font-black uppercase tracking-widest text-[10px]"
            >
              <LogOut size={14} /> Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        {/* Top Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-kiddo-navy/10 flex items-center justify-between px-8 md:px-12 sticky top-0 z-30">
          <div>
            <h2 className="text-xl md:text-2xl">{brandContent.adminLabel}</h2>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-3">
              <Badge variant="success" className="px-3 py-1 bg-kiddo-green/10 normal-case tracking-normal font-bold">
                <span className="w-2 h-2 rounded-full bg-kiddo-green animate-pulse mr-2 inline-block" />
                System Live
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={dispatchAdminRefresh}
              className="w-10 h-10 p-0 rounded-xl hover:bg-kiddo-warm text-kiddo-muted"
              title="Refresh data"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
