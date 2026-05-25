import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Proof', href: '/#proof', section: 'proof' },
  { label: 'Compare', href: '/#compare', section: 'compare' },
  { label: 'Process', href: '/#process', section: 'process' },
  { label: 'Contact', href: '/#contact', section: 'contact' },
];

export function SiteHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const routeState = useMemo(() => {
    if (location.pathname === '/download') return 'download';
    if (location.pathname === '/login') return 'login';
    if (location.pathname === '/signup') return 'signup';
    return activeSection;
  }, [activeSection, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== '/') return;
    const ids = ['proof', 'compare', 'process', 'contact'];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const onScroll = () => {
      let current = 'home';
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 140) current = section.id;
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [location.pathname]);

  const navClass = (key: string) =>
    routeState === key ? 'bg-[#ccff00] text-black' : 'bg-white text-black';

  return (
    <header className="sticky top-0 z-50 border-b-4 border-black bg-white">
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rotate-[3deg] border-4 border-black bg-black text-white">
            <span className="font-display text-2xl leading-none">K</span>
          </div>
          <div className="text-[30px] font-extrabold leading-none text-black">KidDo</div>
        </Link>

        <nav className="hidden items-center gap-3 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`font-label border-4 border-black px-4 py-3 text-sm font-bold leading-none ${navClass(item.section)}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="neo-shadow-black flex items-center gap-3 border-4 border-black bg-white px-4 py-2">
            <span className="h-3 w-3 rounded-full bg-[#ccff00]" />
            <span className="font-label text-xs font-bold text-black">System Online</span>
          </div>
          <Link
            to="/signup"
            className={`neo-shadow-black rounded-lg border-4 border-black px-5 py-3 font-label text-sm font-bold leading-none transition-transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${
              routeState === 'signup' ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00] text-black'
            }`}
          >
            Join Beta
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="inline-flex h-12 w-12 items-center justify-center border-4 border-black bg-[#ccff00] text-black lg:hidden"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t-4 border-black bg-white p-4 lg:hidden">
          <div className="grid gap-3">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`border-4 border-black px-4 py-3 font-label text-sm font-bold leading-none ${navClass(item.section)}`}
              >
                {item.label}
              </a>
            ))}
            <Link
              to="/signup"
              className={`border-4 border-black px-4 py-3 font-label text-sm font-bold leading-none ${
                routeState === 'signup' ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00] text-black'
              }`}
            >
              Join Beta
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
