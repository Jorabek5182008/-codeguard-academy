'use client';

import { useState, useEffect } from 'react';

const THEME_KEY = 'codeguard_theme';

// Reused on every page (homepage, /news, /news/[slug], future pages) so
// navigation and the dark/light toggle behave the same everywhere.
// Links to homepage sections use "/#id" so they work correctly from any page.
export default function SiteNav() {
  const [theme, setTheme] = useState('auto');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved) {
        setTheme(saved);
        document.documentElement.setAttribute('data-theme', saved);
      }
    } catch {
      // ignore
    }
  }, []);

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // ignore
    }
  }

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <a href="/" className="brand">🐍 CodeGuard<span className="dot">.</span></a>
          <div className="nav-links">
            <a href="/courses">Kurslar</a>
            <a href="/news">Yangiliklar</a>
            <a href="/#xizmatlar">Xizmatlar</a>
            <a href="/pricing">Tariflar</a>
            <a href="/academy">Akademiya</a>
            <a href="/contact">Aloqa</a>
            <a href="/#instagram">Instagram</a>
            <a href="/account">Akkaunt</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a href="/search" className="theme-toggle" aria-label="Qidiruv">🔍</a>
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Rejimni almashtirish">
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <a href="/#royxat" className="nav-cta">Ro'yxatdan o'tish</a>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="bottom-nav">
        <a href="/" className="bottom-nav-item">
          <span className="bottom-nav-icon">🏠</span>
          <span>Bosh sahifa</span>
        </a>
        <a href="/courses" className="bottom-nav-item">
          <span className="bottom-nav-icon">📚</span>
          <span>Kurslar</span>
        </a>
        <a href="/#royxat" className="bottom-nav-item bottom-nav-cta">
          <span className="bottom-nav-icon">✍️</span>
          <span>Yozilish</span>
        </a>
        <a href="/pricing" className="bottom-nav-item">
          <span className="bottom-nav-icon">💳</span>
          <span>Tariflar</span>
        </a>
        <a href="/account" className="bottom-nav-item">
          <span className="bottom-nav-icon">👤</span>
          <span>Akkaunt</span>
        </a>
      </div>
    </>
  );
}
