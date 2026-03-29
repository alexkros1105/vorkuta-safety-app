'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface KBItem {
  id: number;
  title: string;
  content: string;
  category: string;
  position: string;
  format: string;
}

const formatIcon: Record<string, string> = { text: '📄', pdf: '📑', video: '🎥', scheme: '📊' };

export default function KnowledgeScreen() {
  const [items, setItems] = useState<KBItem[]>([]);
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    const q = search ? `?q=${encodeURIComponent(search)}` : '';
    fetch(`/api/knowledge${q}`).then(r => r.json()).then(setItems);
  }, [search]);

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>База знаний</h1>
      </div>
      <p style={{ margin: '-2px 16px 10px', fontSize: 12, color: 'var(--text-muted)' }}>Специальность: Слесарь ВШТ</p>

      <div style={{ padding: '0 16px 12px' }}>
        <input
          className="input"
          placeholder="🔍 Поиск по материалам..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ overflow: 'visible' }}>
            <div
              style={{ padding: 14, cursor: 'pointer', display: 'flex', gap: 10, alignItems: 'flex-start' }}
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
            >
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{formatIcon[item.format]}</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.3 }}>{item.title}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{item.category}</p>
              </div>
              <span style={{ color: 'var(--text-dim)', fontSize: 14 }}>{expanded === item.id ? '▲' : '▼'}</span>
            </div>
            {expanded === item.id && (
              <div style={{ padding: '0 14px 14px', borderTop: '1px solid var(--border)' }}>
                <div style={{ paddingTop: 12, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {item.content.split('\n').map((line, i) => {
                    if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{ fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{line.slice(2, -2)}</p>;
                    if (line.startsWith('- ')) return <p key={i} style={{ margin: '4px 0', paddingLeft: 12 }}>• {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                    if (line.trim() === '') return <div key={i} style={{ height: 6 }} />;
                    return <p key={i} style={{ margin: '4px 0' }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
