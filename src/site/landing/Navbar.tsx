import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/src/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/src/components/ui/Sheet';
import { cn } from '@/src/lib/utils';

const navLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'For Parents', href: '/parents' },
  { label: 'For Kids', href: '/kids' },
  { label: 'For Teachers', href: '/#teachers' },
  { label: 'Safety', href: '/#safety' },
  { label: 'About', href: '/#faq' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled
          ? 'bg-kiddo-warm/85 backdrop-blur-md border-slate-200/70 shadow-[0_1px_12px_rgba(27,58,75,0.06)]'
          : 'bg-transparent border-transparent'
      )}
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-[68px]">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="KidDo home">
            <img src="/kiddo-logo-64.png" alt="" className="h-9 w-9 rounded-xl shadow-sm" />
            <span className="text-[22px] font-extrabold tracking-tight text-kiddo-navy">KidDo</span>
          </Link>

          {/* Desktop nav */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    asChild
                    className="px-3.5 py-2 text-sm font-semibold text-kiddo-muted hover:text-kiddo-navy rounded-xl hover:bg-muted transition-colors"
                  >
                    <Link href={link.href}>{link.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="hidden lg:flex items-center gap-2.5">
            <Button asChild variant="ghost" size="default">
                      <Link href="/auth">Log in</Link>
            </Button>
            <Button asChild variant="default" size="default">
                      <Link href="/download">Get the App</Link>
            </Button>
          </div>

          {/* Mobile trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <img src="/kiddo-logo-64.png" alt="" className="h-8 w-8 rounded-lg" />
                    KidDo
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 flex flex-col gap-1">
                  {navLinks.map((link) => (
                    <SheetClose key={link.label} asChild>
                      <Link
                        href={link.href}
                        className="rounded-xl px-4 py-3 text-base font-semibold text-kiddo-muted hover:bg-muted hover:text-kiddo-navy transition-colors"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
                <div className="mt-6 space-y-3">
                  <SheetClose asChild>
                    <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/auth">Log in</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant="default" size="lg" className="w-full">
              <Link href="/download">Get the App</Link>
                    </Button>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
