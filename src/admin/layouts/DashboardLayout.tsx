import { LogOut, Shield, Download } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { brandContent } from '../common/content';
import { adminNavItems } from '../common/navigation';
import { useAuth } from '../context/AuthContext';

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <div className="brand">
          <Shield size={20} />
          <div>
            <strong>{brandContent.name}</strong>
            <span>{brandContent.adminLabel}</span>
          </div>
        </div>

        <nav className="nav">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className={active ? 'nav-link active' : 'nav-link'}>
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <a href="/kiddo-app.apk" className="nav-link" download>
            <Download size={18} />
            <span>Download App</span>
          </a>
        </nav>

        <button className="logout-button" onClick={logout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <p className="eyebrow">System Administration</p>
            <h1>Welcome back, {user?.firstName}</h1>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
