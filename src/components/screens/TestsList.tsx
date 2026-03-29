'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TestItem {
  id: number;
  title: string;
  type: string;
  description: string;
  question_count: number;
  last_completed: string | null;
  best_score: number | null;
  total_q: number | null;
}

const typeLabel: Record<string, string> = { initial: 'Первичный', repeat: 'Повторный', unplanned: 'Внеплановый' };
const typeClass: Record<string, string> = { initial: 'badge-company', repeat: 'badge-micro', unplanned: 'badge-injury' };

const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

function TestCard({ test }: { test: TestItem }) {
  const done = test.last_completed != null;
  const pct = done && test.best_score != null && test.total_q ? Math.round(test.best_score / test.total_q * 100) : null;
  return (
    <Link href={`/tests/${test.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
          <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{test.title}</h3>
          <span className={`badge ${typeClass[test.type]}`} style={{ flexShrink: 0 }}>{typeLabel[test.type]}</span>
        </div>
        <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.4 }}>{test.description}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>{test.question_count} вопросов</span>
          {done ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: pct && pct >= 80 ? 'var(--green)' : 'var(--yellow)' }}>✓ {pct}%</span>
              <span style={{ fontSize: 12, color: 'var(--orange)' }}>Пройти ещё</span>
            </div>
          ) : (
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--orange)' }}>Начать →</span>
          )}
        </div>
        {done && pct != null && (
          <div className="progress-bar" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${pct}%`, background: pct >= 80 ? 'var(--green)' : 'var(--yellow)' }} />
          </div>
        )}
      </div>
    </Link>
  );
}

export default function TestsList() {
  const [tests, setTests] = useState<TestItem[]>([]);

  useEffect(() => {
    fetch('/api/tests').then(r => r.json()).then(setTests);
  }, []);

  const todayTests = tests.slice(0, 2);
  const archiveTests = tests.slice(2);

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px' }}>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Инструктажи</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-muted)' }}>Цифровые журналы инструктажей</p>
      </div>

      {/* Today's section */}
      <div className="section-header">
        <span className="section-title">📋 На сегодня — {today}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 4px' }}>
        {todayTests.map(test => <TestCard key={test.id} test={test} />)}
      </div>

      {/* Archive */}
      {archiveTests.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 8 }}>
            <span className="section-title">📁 Архив инструктажей</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
            {archiveTests.map(test => <TestCard key={test.id} test={test} />)}
          </div>
        </>
      )}
    </div>
  );
}
