'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CaseItem {
  id: number;
  name: string;
  tier: string;
  cost_points: number;
  rewards: Array<{ name: string; rarity: string; probability: number; icon: string }>;
}

interface Reward {
  name: string;
  rarity: string;
  icon: string;
}

const tierColors: Record<string, string> = { basic: '#60a5fa', advanced: '#c084fc', rare: '#fbbf24' };
const tierLabels: Record<string, string> = { basic: 'Базовый', advanced: 'Продвинутый', rare: 'Редкий' };
const rarityColors: Record<string, string> = { common: '#9ca3af', uncommon: '#60a5fa', rare: '#c084fc', legendary: '#fbbf24', epic: '#f97316' };

export default function CasesScreen() {
  const [data, setData] = useState<{ cases: CaseItem[]; points: number; history: Array<{ case_name: string; reward: Reward; opened_at: string }> } | null>(null);
  const [opening, setOpening] = useState<number | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [animating, setAnimating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/cases').then(r => r.json()).then(setData);
  }, []);

  const openCase = async (caseId: number) => {
    setOpening(caseId);
    setAnimating(true);
    setError('');
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ case_id: caseId }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? 'Ошибка');
      setAnimating(false);
      setOpening(null);
      return;
    }
    setTimeout(() => {
      setAnimating(false);
      setReward(json.reward);
      fetch('/api/cases').then(r => r.json()).then(setData);
    }, 2000);
  };

  const closeReward = () => {
    setReward(null);
    setOpening(null);
  };

  if (!data) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>Загрузка...</div>;

  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 8px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/more" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 15, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Накоплено баллов</h1>
      </div>

      {/* Balance */}
      <div style={{ margin: '4px 16px 12px', padding: '14px 16px', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>Ваш баланс</p>
          <p style={{ margin: '4px 0 0', fontFamily: 'Unbounded', fontSize: 24, fontWeight: 700, color: 'var(--orange)' }}>{data.points} <span style={{ fontSize: 14 }}>баллов</span></p>
        </div>
        <div style={{ fontSize: 36 }}>🏆</div>
      </div>

      {error && <p style={{ margin: '0 16px 8px', fontSize: 13, color: 'var(--red)' }}>⚠️ {error}</p>}

      {/* Cases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 16px' }}>
        {data.cases.map(cs => {
          const canOpen = data.points >= cs.cost_points;
          const isOpening = opening === cs.id;
          const color = tierColors[cs.tier];

          return (
            <div key={cs.id} className="card" style={{ padding: 16, border: `1px solid ${color}30` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 13, fontWeight: 700, color }}>{tierLabels[cs.tier]}</p>
                  <p style={{ margin: '2px 0 0', fontFamily: 'Unbounded', fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{cs.name}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 16, fontWeight: 700, color }}>
                    {cs.cost_points}
                  </p>
                  <p style={{ margin: 0, fontSize: 10, color: 'var(--text-muted)' }}>баллов</p>
                </div>
              </div>

              {/* CS2-style case visual */}
              <div style={{
                height: 100, borderRadius: 'var(--radius-sm)',
                background: `linear-gradient(135deg, ${color}15, ${color}05)`,
                border: `1px solid ${color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 12, position: 'relative', overflow: 'hidden',
              }}>
                {isOpening && animating ? (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: 40,
                      animation: 'spin 0.4s linear infinite',
                      display: 'inline-block',
                    }}>🎲</div>
                    <p style={{ margin: '6px 0 0', fontSize: 12, color, fontWeight: 600 }}>Открываем...</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', padding: 8 }}>
                    {cs.rewards.map((r, i) => (
                      <div key={i} style={{ textAlign: 'center', opacity: 0.8 }}>
                        <span style={{ fontSize: 22 }}>{r.icon}</span>
                        <p style={{ margin: '2px 0 0', fontSize: 9, color: rarityColors[r.rarity], fontWeight: 600 }}>
                          {Math.round(r.probability * 100)}%
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="btn-primary"
                onClick={() => openCase(cs.id)}
                disabled={!canOpen || isOpening}
                style={{ background: canOpen ? color : 'var(--surface3)', color: canOpen ? '#fff' : 'var(--text-dim)' }}
              >
                {isOpening && animating ? 'Открываем...' : canOpen ? `Открыть — ${cs.cost_points} баллов` : `Нужно ещё ${cs.cost_points - data.points} баллов`}
              </button>
            </div>
          );
        })}
      </div>

      {/* History */}
      {data.history.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 8 }}>
            <span className="section-title">История открытий</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
            {data.history.map((h, i) => (
              <div key={i} className="card" style={{ padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <span style={{ fontSize: 20 }}>{h.reward.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{h.reward.name}</p>
                    <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>{h.case_name}</p>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-dim)' }}>{new Date(h.opened_at).toLocaleDateString('ru-RU')}</p>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Reward modal */}
      {reward && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 24,
        }} onClick={closeReward}>
          <div style={{ textAlign: 'center', animation: 'fadeInUp 0.5s ease' }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>{reward.icon}</div>
            <p style={{ fontFamily: 'Unbounded', fontSize: 14, color: rarityColors[reward.rarity], margin: '0 0 8px', fontWeight: 700 }}>
              {reward.rarity.toUpperCase()}
            </p>
            <h2 style={{ fontFamily: 'Unbounded', fontSize: 20, color: '#fff', margin: '0 0 20px' }}>{reward.name}</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>Нажмите, чтобы закрыть</p>
          </div>
        </div>
      )}
    </div>
  );
}
