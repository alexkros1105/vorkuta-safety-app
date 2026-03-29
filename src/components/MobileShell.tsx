'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  {
    href: '/',
    label: 'Главная',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    href: '/lightning',
    label: 'Молнии',
    badge: 2,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    href: '/tests',
    label: 'Инструктажи',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/>
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    ),
  },
  {
    href: '/more',
    label: 'Ещё',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Профиль',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

export default function MobileShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('app-theme');
    if (saved === 'light') setTheme('light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('app-theme', next);
  };

  const getActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <div className="phone-outer">
      {/* Theme toggle — above the phone */}
      <button
        onClick={toggleTheme}
        title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 200,
          background: theme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.12)',
          border: '1px solid ' + (theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'),
          borderRadius: 20, width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', fontSize: 18, backdropFilter: 'blur(8px)',
          transition: 'all 0.2s',
        }}
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>

      <div className={`phone-frame${theme === 'light' ? ' light' : ''}`}>
        {/* Status bar */}
        <div className="status-bar">
          <span>9:41</span>
          <div className="notch" />
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
              <rect x="0" y="4" width="3" height="8" rx="1" opacity="0.4"/>
              <rect x="4" y="2.5" width="3" height="9.5" rx="1" opacity="0.6"/>
              <rect x="8" y="1" width="3" height="11" rx="1" opacity="0.8"/>
              <rect x="12" y="0" width="3" height="12" rx="1"/>
            </svg>
            <svg width="15" height="12" viewBox="0 0 15 12" fill="currentColor">
              <path d="M7.5 2.5C5.2 2.5 3.1 3.4 1.6 5L0 3.3C2 1.2 4.6 0 7.5 0s5.5 1.2 7.5 3.3L13.4 5C11.9 3.4 9.8 2.5 7.5 2.5z" opacity="0.4"/>
              <path d="M7.5 5.5c-1.4 0-2.7.6-3.6 1.5L2.3 5.4C3.6 4.1 5.5 3.2 7.5 3.2s3.9.9 5.2 2.2L11.1 7C10.2 6.1 8.9 5.5 7.5 5.5z" opacity="0.7"/>
              <circle cx="7.5" cy="10" r="1.8"/>
            </svg>
            <span style={{ fontSize: '12px', fontWeight: 600 }}>100%</span>
          </div>
        </div>

        {/* Screen content */}
        <div className="screen">
          {children}
        </div>

        {/* Bottom navigation */}
        <nav className="bottom-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${getActive(item.href) ? 'active' : ''}`}
            >
              {item.icon}
              {item.badge && !getActive(item.href) && (
                <span className="nav-badge">{item.badge}</span>
              )}
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
