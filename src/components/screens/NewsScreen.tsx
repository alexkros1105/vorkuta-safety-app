'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface NewsItem {
  id: number;
  title: string;
  content: string;
  level: string;
  section: string | null;
  published_at: string;
}

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)} мин назад`;
  if (s < 86400) return `${Math.floor(s / 3600)} ч назад`;
  return `${Math.floor(s / 86400)} дн назад`;
}

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
    if (line.startsWith('—')) return (
      <p key={i} style={{ margin: '4px 0', paddingLeft: 12, borderLeft: '2px solid var(--orange)', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
        {line}
      </p>
    );
    return <p key={i} style={{ margin: '4px 0', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{line}</p>;
  });
}

export default function NewsScreen() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [tab, setTab] = useState<'all' | 'company' | 'section'>('all');
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(setItems);
  }, []);

  const filtered = tab === 'all' ? items : items.filter(i => i.level === tab);

  if (selected) {
    return (
      <div style={{ paddingBottom: 24 }}>
        <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', padding: 0 }}>‹</button>
          <span className={`badge ${selected.level === 'company' ? 'badge-company' : 'badge-section'}`}>
            {selected.level === 'company' ? 'Компания' : 'Участок'}
          </span>
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          {/* Header image */}
          <div style={{
            height: 140, borderRadius: 'var(--radius)',
            background: selected.level === 'company'
              ? 'linear-gradient(135deg, #0a1020 0%, #0f1a2a 100%)'
              : 'linear-gradient(135deg, #1a0f00 0%, #150a00 100%)',
            marginBottom: 16, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 8,
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.015) 0, rgba(255,255,255,0.015) 1px, transparent 0, transparent 50%)',
              backgroundSize: '12px 12px',
            }} />
            <div style={{ fontSize: 36, position: 'relative' }}>{selected.level === 'company' ? '🏭' : '⛏️'}</div>
            <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '3px 12px', backdropFilter: 'blur(4px)', position: 'relative' }}>
              <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 9, fontWeight: 700, color: selected.level === 'company' ? '#60a5fa' : 'var(--orange)', letterSpacing: '0.1em' }}>
                АО «ВОРКУТАУГОЛЬ»
              </p>
            </div>
          </div>

          <h2 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: '0 0 8px', color: 'var(--text)', lineHeight: 1.4 }}>
            {selected.title}
          </h2>
          <p style={{ margin: '0 0 16px', fontSize: 11, color: 'var(--text-dim)' }}>{timeAgo(selected.published_at)}</p>

          <div className="card" style={{ padding: '14px 14px 10px' }}>
            {renderContent(selected.content)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text)' }}>📰 Новости</h1>
      </div>

      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        {(['all', 'company', 'section'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: tab === t ? 'var(--orange)' : 'var(--surface2)',
            color: tab === t ? '#fff' : 'var(--text-muted)',
            fontSize: 12, fontWeight: 600, fontFamily: 'Golos Text',
          }}>
            {t === 'all' ? 'Все' : t === 'company' ? 'Компания' : 'Участок'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="card" style={{ padding: 14, cursor: 'pointer' }} onClick={() => setSelected(item)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{item.title}</h3>
              <span className={`badge ${item.level === 'company' ? 'badge-company' : 'badge-section'}`} style={{ flexShrink: 0 }}>
                {item.level === 'company' ? 'Компания' : 'Участок'}
              </span>
            </div>
            <p style={{ margin: '0 0 8px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {item.content.split('\n')[0]}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontSize: 11, color: 'var(--text-dim)' }}>{timeAgo(item.published_at)}</p>
              <span style={{ fontSize: 12, color: 'var(--orange)' }}>Читать →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
