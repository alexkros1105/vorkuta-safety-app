'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface RacItem {
  id: number;
  title: string;
  problem: string;
  solution: string;
  expected_effect: string;
  status: string;
  rejection_reason: string | null;
  submitted_at: string;
  author_name: string;
}

const statusLabel: Record<string, string> = { review: 'На рассмотрении', accepted: 'Принято', rejected: 'Отклонено' };
const statusClass: Record<string, string> = { review: 'badge-injury', accepted: 'badge-micro', rejected: 'badge-accident' };

export default function RacScreen() {
  const [items, setItems] = useState<RacItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', problem: '', solution: '', expected_effect: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch('/api/rac').then(r => r.json()).then(setItems);
  }, []);

  const submit = async () => {
    if (!form.title || !form.problem || !form.solution) return;
    setSubmitting(true);
    await fetch('/api/rac', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSuccess(true);
    setSubmitting(false);
    setForm({ title: '', problem: '', solution: '', expected_effect: '' });
    fetch('/api/rac').then(r => r.json()).then(setItems);
    setTimeout(() => { setSuccess(false); setShowForm(false); }, 2000);
  };

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>РАЦ-предложения</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{
          background: 'var(--orange)', border: 'none', borderRadius: 20,
          padding: '6px 14px', color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer',
          fontFamily: 'Golos Text',
        }}>+ Подать</button>
      </div>

      {showForm && (
        <div style={{ margin: '8px 16px 12px', padding: 14 }} className="card">
          <p style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>Новое предложение</p>
          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ fontSize: 32, margin: '0 0 8px' }}>✅</p>
              <p style={{ color: 'var(--green)', fontWeight: 600 }}>Предложение подано! +50 баллов</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input className="input" placeholder="Заголовок" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <textarea className="textarea" placeholder="Описание проблемы" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))} />
              <textarea className="textarea" placeholder="Предлагаемое решение" value={form.solution} onChange={e => setForm(f => ({ ...f, solution: e.target.value }))} />
              <textarea className="textarea" placeholder="Ожидаемый эффект" value={form.expected_effect} onChange={e => setForm(f => ({ ...f, expected_effect: e.target.value }))} style={{ minHeight: 60 }} />
              <button className="btn-primary" onClick={submit} disabled={submitting || !form.title || !form.problem}>
                {submitting ? 'Отправка...' : 'Подать предложение'}
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>{item.title}</p>
              <span className={`badge ${statusClass[item.status]}`} style={{ flexShrink: 0 }}>{statusLabel[item.status]}</span>
            </div>
            <p style={{ margin: '0 0 4px', fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              <strong style={{ color: 'var(--text-dim)', fontSize: 11 }}>Проблема: </strong>{item.problem.substring(0, 80)}...
            </p>
            {item.status === 'rejected' && item.rejection_reason && (
              <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(239,68,68,0.08)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)' }}>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--red)' }}>{item.rejection_reason}</p>
              </div>
            )}
            <p style={{ margin: '8px 0 0', fontSize: 11, color: 'var(--text-dim)' }}>
              {item.author_name} · {new Date(item.submitted_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
