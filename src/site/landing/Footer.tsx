import React from 'react';
import { SITE_HOST, SITE_NAME } from '@/src/lib/site-config';

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'For Parents', href: '/parents' },
    { label: 'For Kids', href: '/kids' },
    { label: 'Safety', href: '/#safety' },
    { label: 'Download', href: '/download' },
  ],
  Company: [
    { label: 'About', href: '/#faq' },
    { label: 'Contact', href: '#' },
  ],
  Legal: [
    { label: 'Privacy', href: '#' },
    { label: 'Terms', href: '#' },
    { label: 'Child Safety', href: '/#safety' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-kiddo-navy text-white/80 py-14">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <img src="/kiddo-logo-64.png" alt={SITE_NAME} className="h-9 w-9 rounded-xl" />
              <span className="text-[22px] font-extrabold text-white">{SITE_NAME}</span>
            </div>
            <p className="text-[15px] leading-relaxed text-white/60">
              Good Habits Today.
              <br />
              Great Kids Tomorrow.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-bold text-white uppercase tracking-wide mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[15px] text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          <p className="text-sm text-white/40">{SITE_HOST}</p>
        </div>
      </div>
    </footer>
  );
}

