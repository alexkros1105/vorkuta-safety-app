'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LightningItem {
  id: number;
  title: string;
  content: string;
  severity: string;
  section: string;
  published_at: string;
  read_count: number;
}

const severityLabel: Record<string, string> = { micro: 'Микротравма', injury: 'Травма', accident: 'НС', fatal: 'Смертельный' };
const severityClass: Record<string, string> = { micro: 'badge-micro', injury: 'badge-injury', accident: 'badge-accident', fatal: 'badge-fatal' };

function timeAgo(date: string) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 3600) return `${Math.floor(s / 60)} мин назад`;
  if (s < 86400) return `${Math.floor(s / 3600)} ч назад`;
  return `${Math.floor(s / 86400)} дн назад`;
}

export default function LightningList() {
  const [items, setItems] = useState<LightningItem[]>([]);

  useEffect(() => {
    fetch('/api/lightning').then(r => r.json()).then(setItems);
  }, []);

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 16, fontWeight: 700, margin: 0, color: 'var(--text)' }}>⚡ Лента молний</h1>
      </div>
      <p style={{ margin: '-4px 16px 12px', fontSize: 12, color: 'var(--text-muted)' }}>Инциденты и предупреждения — нажмите &quot;Ознакомился&quot; в каждой</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {items.map((item) => (
          <Link key={item.id} href={`/lightning/${item.id}`} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{item.title}</p>
                <span className={`badge ${severityClass[item.severity]}`} style={{ flexShrink: 0 }}>{severityLabel[item.severity]}</span>
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {item.content.replace(/\*\*/g, '').substring(0, 100)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.section}</span>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>👁 {item.read_count}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{timeAgo(item.published_at)}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
