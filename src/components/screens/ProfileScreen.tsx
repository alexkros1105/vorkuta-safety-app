'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface SalaryItem { type: string; name: string; amount: number; }
interface ProfileData {
  employee: { name: string; position: string; section: string; points: number };
  salary: { period: string; gross_amount: number; net_amount: number; items: SalaryItem[]; paid_at: string } | null;
  testHistory: Array<{ title: string; score: number; total_questions: number; passed: boolean; completed_at: string }>;
  vacation: { days_left: number; next_vacation: string; vacation_end: string };
}

export default function ProfileScreen() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [tab, setTab] = useState<'salary' | 'tests' | 'vacation'>('salary');

  useEffect(() => {
    fetch('/api/profile').then(r => r.json()).then(setData);
  }, []);

  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;

  const { employee, salary, testHistory, vacation } = data;

  return (
    <div style={{ paddingBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: '16px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ width: 52, height: 52, borderRadius: 26, background: 'var(--orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Unbounded', fontWeight: 700, fontSize: 18, color: '#fff', flexShrink: 0 }}>АИ</div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{employee.name}</p>
          <p style={{ margin: '2px 0', fontSize: 12, color: 'var(--text-muted)' }}>{employee.position}</p>
          <p style={{ margin: 0, fontSize: 11, color: 'var(--text-dim)' }}>{employee.section}</p>
        </div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 20, fontWeight: 700, color: 'var(--orange)' }}>{employee.points}</p>
          <p style={{ margin: '1px 0 0', fontSize: 10, color: 'var(--text-muted)' }}>баллов</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)' }}>
        {([['salary', '💰 Зарплата'], ['vacation', '🏖 Отпуск'], ['tests', '📋 Тесты']] as const).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 4px', border: 'none', cursor: 'pointer',
            background: 'transparent',
            color: tab === t ? 'var(--orange)' : 'var(--text-muted)',
            fontSize: 12, fontWeight: 600, fontFamily: 'Golos Text',
            borderBottom: tab === t ? '2px solid var(--orange)' : '2px solid transparent',
          }}>{label}</button>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        {/* SALARY */}
        {tab === 'salary' && salary && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>К выплате · {salary.period}</p>
                <p style={{ margin: '4px 0 0', fontFamily: 'Unbounded', fontSize: 28, fontWeight: 700, color: 'var(--text)' }}>
                  {Math.round(salary.net_amount).toLocaleString('ru-RU')} ₽
                </p>
              </div>
              <div style={{ background: 'rgba(34,197,94,0.1)', borderRadius: 'var(--radius-sm)', padding: '6px 12px' }}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--green)', fontWeight: 600 }}>Выплачено</p>
              </div>
            </div>

            <div className="card" style={{ marginBottom: 10 }}>
              <div style={{ padding: '12px 14px 8px' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>НАЧИСЛЕНИЯ</p>
              </div>
              {salary.items.filter(i => i.type === 'accrual').map((item, idx) => (
                <div key={idx} style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--green)' }}>+{item.amount.toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
            </div>

            <div className="card">
              <div style={{ padding: '12px 14px 8px' }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>УДЕРЖАНИЯ</p>
              </div>
              {salary.items.filter(i => i.type === 'deduction').map((item, idx) => (
                <div key={idx} style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: 'var(--text)' }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>{item.amount.toLocaleString('ru-RU')} ₽</span>
                </div>
              ))}
              <div style={{ padding: '12px 14px', borderTop: '2px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Итого к выплате</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{Math.round(salary.net_amount).toLocaleString('ru-RU')} ₽</span>
              </div>
            </div>
          </div>
        )}

        {/* VACATION */}
        {tab === 'vacation' && (
          <div>
            <div className="card" style={{ padding: 20, marginBottom: 12, textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Остаток дней отпуска</p>
              <p style={{ margin: '8px 0', fontFamily: 'Unbounded', fontSize: 48, fontWeight: 700, color: 'var(--orange)', lineHeight: 1 }}>{vacation.days_left}</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>календарных дней</p>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Плановый отпуск</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Начало</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  {new Date(vacation.next_vacation).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Окончание</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
                  {new Date(vacation.vacation_end).toLocaleDateString('ru-RU')}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TEST HISTORY */}
        {tab === 'tests' && (
          <div>
            {testHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <p style={{ fontSize: 32, marginBottom: 8 }}>📋</p>
                <p style={{ color: 'var(--text-muted)' }}>Вы ещё не проходили тесты</p>
                <Link href="/tests" style={{ color: 'var(--orange)', fontSize: 14 }}>Перейти к тестам →</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {testHistory.map((r, i) => (
                  <div key={i} className="card" style={{ padding: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{r.title}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: r.passed ? 'var(--green)' : 'var(--red)' }}>
                        {Math.round(r.score / r.total_questions * 100)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.score}/{r.total_questions} верных</span>
                      <span style={{ fontSize: 11, color: 'var(--text-dim)' }}>{new Date(r.completed_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="progress-bar" style={{ marginTop: 8 }}>
                      <div className="progress-fill" style={{ width: `${Math.round(r.score / r.total_questions * 100)}%`, background: r.passed ? 'var(--green)' : 'var(--red)' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
