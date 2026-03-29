'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

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

function renderMarkdown(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{line.slice(2, -2)}</p>;
      }
      if (line.startsWith('- ')) {
        return <p key={i} style={{ margin: '4px 0', paddingLeft: 12, borderLeft: '2px solid var(--orange)', color: 'var(--text-muted)', fontSize: 14 }}>
          {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}
        </p>;
      }
      if (line.trim() === '') return <div key={i} style={{ height: 8 }} />;
      return <p key={i} style={{ margin: '4px 0', color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.5 }}>
        {line.replace(/\*\*(.*?)\*\*/g, '$1')}
      </p>;
    });
}

export default function LightningDetail({ id }: { id: string }) {
  const [item, setItem] = useState<LightningItem | null>(null);
  const [timer, setTimer] = useState(5);
  const [acknowledged, setAcknowledged] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    fetch(`/api/lightning/${id}`).then(r => r.json()).then(setItem);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [id]);

  const acknowledge = async () => {
    if (timer > 0 || acknowledged || loading) return;
    setLoading(true);
    await fetch(`/api/lightning/${id}`, { method: 'POST' });
    setAcknowledged(true);
    setLoading(false);
  };

  if (!item) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200 }}>
      <p style={{ color: 'var(--text-muted)' }}>Загрузка...</p>
    </div>
  );

  return (
    <div style={{ paddingBottom: 24 }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 12px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link href="/lightning" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <span className={`badge ${severityClass[item.severity]}`}>{severityLabel[item.severity]}</span>
      </div>

      <div style={{ padding: '0 16px 16px' }}>
        <h2 style={{ fontFamily: 'Unbounded', fontSize: 16, fontWeight: 700, margin: '0 0 8px', color: 'var(--text)', lineHeight: 1.3 }}>{item.title}</h2>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>📍 {item.section}</span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
            {new Date(item.published_at).toLocaleDateString('ru-RU')}
          </span>
        </div>

        {/* Safety notice image */}
        {(() => {
          const cfg: Record<string, { bg: string; stripe: string; icon: string; label: string; labelColor: string }> = {
            micro:    { bg: 'linear-gradient(135deg, #1a2a0a 0%, #0f1a0a 100%)', stripe: 'rgba(34,197,94,0.08)', icon: '🩹', label: 'МИКРОТРАВМА', labelColor: '#22c55e' },
            injury:   { bg: 'linear-gradient(135deg, #2a1a00 0%, #1a1000 100%)', stripe: 'rgba(245,158,11,0.08)', icon: '🏥', label: 'ТРАВМА', labelColor: '#f59e0b' },
            accident: { bg: 'linear-gradient(135deg, #2a0a0a 0%, #1a0505 100%)', stripe: 'rgba(239,68,68,0.1)',  icon: '🚨', label: 'НЕСЧАСТНЫЙ СЛУЧАЙ', labelColor: '#ef4444' },
            fatal:    { bg: 'linear-gradient(135deg, #1a0505 0%, #0f0000 100%)', stripe: 'rgba(239,68,68,0.15)', icon: '⛔', label: 'СМЕРТЕЛЬНЫЙ СЛУЧАЙ', labelColor: '#ef4444' },
          };
          const c = cfg[item.severity] ?? cfg.micro;
          return (
            <div style={{
              height: 160, borderRadius: 'var(--radius)', background: c.bg,
              marginBottom: 16, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              border: '1px solid var(--border)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `repeating-linear-gradient(45deg, ${c.stripe} 0, ${c.stripe} 1px, transparent 0, transparent 50%)`,
                backgroundSize: '12px 12px',
              }} />
              <div style={{ fontSize: 40, position: 'relative' }}>{c.icon}</div>
              <div style={{ background: 'rgba(0,0,0,0.5)', borderRadius: 6, padding: '4px 14px', backdropFilter: 'blur(4px)', position: 'relative' }}>
                <p style={{ margin: 0, fontFamily: 'Unbounded', fontSize: 10, fontWeight: 700, color: c.labelColor, letterSpacing: '0.1em' }}>
                  {c.label}
                </p>
              </div>
              <p style={{ margin: 0, fontSize: 10, color: 'rgba(255,255,255,0.3)', position: 'relative' }}>АО «Воркутауголь» · Служба ОТиПБ</p>
            </div>
          );
        })()}

        {/* Content */}
        <div className="card" style={{ padding: '14px 14px 10px' }}>
          {renderMarkdown(item.content)}
        </div>

        {/* Acknowledge button */}
        <div style={{ marginTop: 16 }}>
          {acknowledged ? (
            <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 'var(--radius-sm)', padding: '14px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: 'var(--green)', fontWeight: 600 }}>✓ Вы ознакомились</p>
              <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>+20 баллов начислено</p>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={acknowledge}
              disabled={timer > 0 || loading}
              style={{ position: 'relative' }}
            >
              {timer > 0 ? (
                <>
                  <span>Ознакомиться</span>
                  <span style={{
                    marginLeft: 'auto',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: 20,
                    padding: '2px 10px',
                    fontSize: 13,
                    fontWeight: 700
                  }}>{timer}с</span>
                </>
              ) : '✓ Ознакомился'}
            </button>
          )}
          {timer > 0 && !acknowledged && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
              Прочитайте материал полностью перед подтверждением
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
