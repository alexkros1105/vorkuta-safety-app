'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface DashData {
  instructionStats: { total_employees: number; completed_employees: number; completion_pct: number };
  notCompleted: Array<{ name: string; position: string; section: string }>;
  lightningStats: { total_lightning: number; avg_read_count: number; total_reads: number };
  sectionActivity: Array<{ section: string; total: number; avg_points: number }>;
  avgPoints: { avg: number };
}

export default function DashboardScreen() {
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    fetch('/api/dashboard').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;

  const { instructionStats, notCompleted, lightningStats, sectionActivity, avgPoints } = data;
  const pct = Number(instructionStats.completion_pct) || 0;

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <div>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Дашборд ОТ</h1>
          <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Участок №3 · Реальное время</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {/* Main metric */}
        <div className="card" style={{ padding: 16 }}>
          <p style={{ margin: '0 0 4px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ОХВАТ ИНСТРУКТАЖАМИ</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
            <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 36, fontWeight: 700, color: pct >= 80 ? 'var(--green)' : 'var(--yellow)', lineHeight: 1 }}>
              {pct}%
            </p>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-muted)' }}>
              {instructionStats.completed_employees} из {instructionStats.total_employees} сотрудников
            </p>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 80 ? 'var(--green)' : 'var(--yellow)', height: '100%' }} />
          </div>
          {pct < 80 && <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--yellow)' }}>⚠️ Цель — 80%. Нужно ещё {Math.ceil(instructionStats.total_employees * 0.8) - instructionStats.completed_employees} чел.</p>}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div className="card" style={{ padding: 14 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Молний опубликовано</p>
            <p style={{ margin: '4px 0 0', fontFamily: 'Unbounded', fontSize: 24, fontWeight: 700, color: 'var(--orange)' }}>{lightningStats.total_lightning}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>Avg охват {lightningStats.avg_read_count} чел.</p>
          </div>
          <div className="card" style={{ padding: 14 }}>
            <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Средний балл</p>
            <p style={{ margin: '4px 0 0', fontFamily: 'Unbounded', fontSize: 24, fontWeight: 700, color: 'var(--blue)' }}>{avgPoints.avg ?? 0}</p>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>по участку</p>
          </div>
        </div>

        {/* Not completed */}
        {notCompleted.length > 0 && (
          <div className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>НЕ ПРОШЛИ ИНСТРУКТАЖ</p>
              <span className="badge badge-accident">{notCompleted.length}</span>
            </div>
            {notCompleted.map((e, i) => (
              <div key={i} style={{ padding: '8px 0', borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{e.name}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: 'var(--text-muted)' }}>{e.position}</p>
              </div>
            ))}
          </div>
        )}

        {/* Section activity */}
        <div className="card" style={{ padding: 14 }}>
          <p style={{ margin: '0 0 10px', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>АКТИВНОСТЬ ПО УЧАСТКАМ</p>
          {sectionActivity.map((s, i) => {
            const maxPts = Math.max(...sectionActivity.map(a => Number(a.avg_points)));
            const w = maxPts > 0 ? (Number(s.avg_points) / maxPts * 100) : 0;
            return (
              <div key={i} style={{ marginBottom: i < sectionActivity.length - 1 ? 12 : 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text)' }}>{s.section.split('(')[0].trim()}</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--orange)' }}>Ø {Math.round(Number(s.avg_points))} б.</p>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${w}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Export button */}
        <button className="btn-secondary" style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'center' }}>
          📥 Экспорт отчёта для Ростехнадзора
        </button>
      </div>
    </div>
  );
}
