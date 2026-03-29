'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LightningItem {
  id: number;
  title: string;
  severity: string;
  section: string;
  published_at: string;
  read_count: number;
}

interface NewsItem {
  id: number;
  title: string;
  level: string;
  published_at: string;
}

const severityLabel: Record<string, string> = {
  micro: 'Микротравма',
  injury: 'Травма',
  accident: 'НС',
  fatal: 'Смертельный',
};

const severityClass: Record<string, string> = {
  micro: 'badge-micro',
  injury: 'badge-injury',
  accident: 'badge-accident',
  fatal: 'badge-fatal',
};

function timeAgo(date: string) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'только что';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} мин назад`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} ч назад`;
  return `${Math.floor(seconds / 86400)} дн назад`;
}

export default function HomeScreen() {
  const [lightning, setLightning] = useState<LightningItem[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetch('/api/lightning').then(r => r.json()).then(setLightning);
    fetch('/api/news').then(r => r.json()).then(setNews);
  }, []);

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
              <path d="M16 2L29 9.5V22.5L16 30L3 22.5V9.5L16 2Z" fill="#ff5f00"/>
              <path d="M16 8C16 8 11 14.5 11 18a5 5 0 0010 0c0-3.5-5-10-5-10z" fill="white" opacity="0.95"/>
              <ellipse cx="16" cy="23" rx="3" ry="1.2" fill="white" opacity="0.3"/>
            </svg>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0, fontWeight: 600, letterSpacing: '0.03em' }}>ВОРКУТАУГОЛЬ</p>
          </div>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 18, fontWeight: 700, margin: '2px 0 0', color: 'var(--text)' }}>
            Добрый день, Александр
          </h1>
        </div>
        <div style={{
          width: 40, height: 40, borderRadius: 20,
          background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Unbounded', fontWeight: 700, fontSize: 14, color: '#fff', flexShrink: 0
        }}>АИ</div>
      </div>

      {/* Notification demo card */}
      <div style={{ margin: '8px 16px', padding: '12px 14px', background: 'rgba(255,95,0,0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,95,0,0.2)', display: 'flex', gap: 10 }}>
        <div style={{ fontSize: 20 }}>⚡</div>
        <div>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Новая молния — нужно ознакомиться</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>Внеплановый инструктаж по взрывным работам</p>
        </div>
      </div>

      {/* Quick stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '8px 16px' }}>
        <div className="card" style={{ padding: '14px' }}>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Баллы</p>
          <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, fontFamily: 'Unbounded', color: 'var(--orange)' }}>780</p>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>накоплено</p>
        </div>
        <Link href="/tests" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '14px' }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Инструктажи</p>
            <p style={{ margin: '4px 0 0', fontSize: 24, fontWeight: 700, fontFamily: 'Unbounded', color: 'var(--green)' }}>2</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>на сегодня</p>
          </div>
        </Link>
      </div>

      {/* Lightning section */}
      <div className="section-header">
        <span className="section-title">⚡ Молнии</span>
        <Link href="/lightning" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none' }}>Все →</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {lightning.slice(0, 3).map((item) => (
          <Link key={item.id} href={`/lightning/${item.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{item.title}</p>
                <span className={`badge ${severityClass[item.severity]}`}>{severityLabel[item.severity]}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(item.published_at)}</span>
                <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>👁 {item.read_count}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* News section */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <span className="section-title">📰 Новости</span>
        <Link href="/news" style={{ fontSize: 13, color: 'var(--orange)', textDecoration: 'none' }}>Все →</Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {news.slice(0, 2).map((item) => (
          <div key={item.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{item.title}</p>
              <span className={`badge ${item.level === 'company' ? 'badge-company' : 'badge-section'}`}>
                {item.level === 'company' ? 'Компания' : 'Участок'}
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{timeAgo(item.published_at)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
