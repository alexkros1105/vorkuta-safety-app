'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Permit {
  id: number;
  work_type: string;
  location: string;
  start_time: string;
  end_time: string;
  brigade: Array<{ name: string; position: string; role: string }>;
  safety_measures: string[];
  status: string;
  creator_name: string;
  created_at: string;
}

const statusLabel: Record<string, string> = { draft: 'Черновик', review: 'На согласовании', approved: 'Согласован', closed: 'Закрыт' };
const statusClass: Record<string, string> = { draft: 'badge-company', review: 'badge-injury', approved: 'badge-micro', closed: 'badge-accident' };

export default function PermitsScreen() {
  const [items, setItems] = useState<Permit[]>([]);
  const [selected, setSelected] = useState<Permit | null>(null);

  useEffect(() => {
    fetch('/api/permits').then(r => r.json()).then(setItems);
  }, []);

  if (selected) {
    return (
      <div style={{ paddingBottom: 16 }}>
        <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', padding: 0 }}>‹</button>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Наряд-допуск #{selected.id}</h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>СТАТУС</p>
              <span className={`badge ${statusClass[selected.status]}`}>{statusLabel[selected.status]}</span>
            </div>

            {/* Status flow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
              {(['draft', 'review', 'approved', 'closed'] as const).map((s, i) => {
                const statuses = ['draft', 'review', 'approved', 'closed'];
                const currentIdx = statuses.indexOf(selected.status);
                const sIdx = statuses.indexOf(s);
                const done = sIdx <= currentIdx;
                return [
                  <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ width: 20, height: 20, borderRadius: 10, background: done ? 'var(--orange)' : 'var(--surface3)', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {done && <span style={{ fontSize: 10, color: '#fff' }}>✓</span>}
                    </div>
                    <p style={{ margin: 0, fontSize: 9, color: done ? 'var(--text)' : 'var(--text-dim)' }}>{statusLabel[s]}</p>
                  </div>,
                  i < 3 && <div key={`line-${i}`} style={{ width: 16, height: 1, background: 'var(--border)', flexShrink: 0 }} />,
                ];
              })}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div><p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Вид работ</p><p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{selected.work_type}</p></div>
              <div><p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Место проведения</p><p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text)' }}>{selected.location}</p></div>
              <div style={{ display: 'flex', gap: 12 }}>
                <div><p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Начало</p><p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text)' }}>{new Date(selected.start_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
                <div><p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Окончание</p><p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--text)' }}>{new Date(selected.end_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p></div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: 14 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>БРИГАДА</p>
            {selected.brigade.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <div>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{m.name}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{m.position}</p>
                </div>
                <span style={{ fontSize: 11, color: 'var(--orange)', fontWeight: 600 }}>{m.role}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 14 }}>
            <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>МЕРЫ БЕЗОПАСНОСТИ</p>
            {selected.safety_measures.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, padding: '6px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <span style={{ color: 'var(--orange)', flexShrink: 0 }}>✓</span>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{m}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Наряды-допуски</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {items.map(permit => (
          <div key={permit.id} className="card" style={{ padding: 14, cursor: 'pointer' }} onClick={() => setSelected(permit)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{permit.work_type}</p>
              <span className={`badge ${statusClass[permit.status]}`} style={{ flexShrink: 0 }}>{statusLabel[permit.status]}</span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: 'var(--text-muted)' }}>📍 {permit.location}</p>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-dim)' }}>
              {new Date(permit.start_time).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })} · {permit.brigade.length} чел.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
