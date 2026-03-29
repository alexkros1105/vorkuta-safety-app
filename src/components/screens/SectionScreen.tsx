'use client';

import Link from 'next/link';
import { useState } from 'react';

type ShiftType = 'shift1' | 'shift2' | 'shift3' | 'shift4' | 'day_off';
const SHIFT_CONFIG: Record<ShiftType, { label: string; color: string; textColor: string; time: string }> = {
  shift1: { label: '1', color: 'rgba(59,130,246,0.25)',  textColor: '#60a5fa',  time: '08–14' },
  shift2: { label: '2', color: 'rgba(20,184,166,0.25)', textColor: '#2dd4bf',  time: '14–20' },
  shift3: { label: '3', color: 'rgba(139,92,246,0.25)', textColor: '#a78bfa',  time: '20–02' },
  shift4: { label: '4', color: 'rgba(99,102,241,0.25)', textColor: '#818cf8',  time: '02–08' },
  day_off: { label: '—', color: 'var(--surface2)', textColor: 'var(--text-dim)', time: '' },
};
const SHIFT_CYCLE: ShiftType[] = ['shift1', 'shift2', 'shift3', 'shift4', 'day_off', 'day_off'];

const today = new Date();
const SHIFTS: Record<string, ShiftType> = {};
for (let d = -10; d < 25; d++) {
  const dt = new Date(today);
  dt.setDate(dt.getDate() + d);
  const key = dt.toISOString().split('T')[0];
  SHIFTS[key] = SHIFT_CYCLE[((d + 120)) % 6];
}

const ANNOUNCEMENTS = [
  { id: 1, text: 'Медицинская комиссия начинается с 31 марта. Всем взять направление в нарядной до 28 марта. Без прохождения комиссии — допуск к подземным работам приостанавливается.', date: '29 марта', important: true, author: 'Нач. участка Сидоров М.Г.' },
];

const CONTACTS = [
  { name: 'Сидоров Михаил Геннадьевич', role: 'Начальник участка', phone: '+7 (8212) 75-14-03' },
  { name: 'Воронин Алексей Петрович', role: 'Горный мастер (день)', phone: '+7 (8212) 75-14-07' },
  { name: 'Зуев Вадим Иванович', role: 'Горный мастер (ночь)', phone: '+7 (8212) 75-14-09' },
];

export default function SectionScreen() {
  const [activeTab, setActiveTab] = useState<'feed' | 'schedule' | 'contacts'>('feed');

  const daysInMonth = () => {
    const result = [];
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      result.push(new Date(d));
    }
    return result;
  };

  const days = daysInMonth();

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <div>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Мой участок</h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Участок №3 · Шахта Воркутинская</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 16px 12px' }}>
        {([['feed', 'Объявления'], ['schedule', 'График смен'], ['contacts', 'Контакты']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '6px 12px', borderRadius: 20, border: 'none', cursor: 'pointer',
            background: activeTab === t ? 'var(--orange)' : 'var(--surface2)',
            color: activeTab === t ? '#fff' : 'var(--text-muted)',
            fontSize: 11, fontWeight: 600, fontFamily: 'Golos Text', whiteSpace: 'nowrap',
          }}>{label}</button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
          {ANNOUNCEMENTS.map(a => (
            <div key={a.id} className="card" style={{ padding: 14, borderLeft: a.important ? '3px solid var(--orange)' : '1px solid var(--border)' }}>
              <p style={{ margin: '0 0 6px', fontSize: 14, color: 'var(--text)', lineHeight: 1.4 }}>{a.text}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {a.author ? <p style={{ margin: 0, fontSize: 11, color: 'var(--orange)' }}>{a.author}</p> : <span />}
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-dim)' }}>{a.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'schedule' && (
        <div style={{ padding: '0 16px' }}>
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {(Object.entries(SHIFT_CONFIG) as [ShiftType, typeof SHIFT_CONFIG[ShiftType]][]).filter(([k]) => k !== 'day_off').map(([k, c]) => (
              <div key={k} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color, border: `1px solid ${c.textColor}40` }} />
                <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{c.label}-я смена {c.time}</span>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--surface3)' }} />
              <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>Выходной</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
            ))}
            {Array.from({ length: (days[0].getDay() + 6) % 7 }, (_, i) => (
              <div key={`e${i}`} />
            ))}
            {days.map(day => {
              const key = day.toISOString().split('T')[0];
              const shiftType = SHIFTS[key] ?? 'day_off';
              const cfg = SHIFT_CONFIG[shiftType];
              const isToday = key === today.toISOString().split('T')[0];
              return (
                <div key={key} style={{
                  background: cfg.color, borderRadius: 6, padding: '6px 2px', textAlign: 'center',
                  border: isToday ? '1px solid var(--orange)' : '1px solid transparent',
                }}>
                  <p style={{ margin: 0, fontSize: 11, color: isToday ? 'var(--orange)' : 'var(--text)', fontWeight: isToday ? 700 : 400 }}>{day.getDate()}</p>
                  <p style={{ margin: '1px 0 0', fontSize: 9, color: cfg.textColor }}>{cfg.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
          {CONTACTS.map((c, i) => (
            <div key={i} className="card" style={{ padding: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 20, background: 'var(--surface3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>👤</div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{c.name}</p>
                <p style={{ margin: '2px 0', fontSize: 12, color: 'var(--text-muted)' }}>{c.role}</p>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--orange)' }}>{c.phone}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
