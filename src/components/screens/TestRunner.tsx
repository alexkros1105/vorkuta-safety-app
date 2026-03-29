'use client';

import Link from 'next/link';
import { useEffect, useState, useRef, useCallback } from 'react';

interface Question {
  id: number;
  type: string;
  text: string;
  options: string[] | null;
  correct_answers: number[] | null;
  explanation: string | null;
  slide_duration: number | null;
  order_index: number;
}

interface TestData {
  test: { id: number; title: string; type: string };
  questions: Question[];
}

type Phase = 'loading' | 'ready' | 'question' | 'wrong' | 'slide' | 'result';

export default function TestRunner({ id }: { id: string }) {
  const [data, setData] = useState<TestData | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [wrongExplanation, setWrongExplanation] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shuffledRef = useRef<Question[]>([]);

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then(r => r.json())
      .then((d: TestData) => {
        // Shuffle questions
        const shuffled = [...d.questions].sort(() => Math.random() - 0.5);
        shuffledRef.current = shuffled;
        setData(d);
        setPhase('ready');
      });
  }, [id]);

  const startTimer = useCallback((seconds: number, onDone: () => void) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(seconds);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          onDone();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const nextQuestion = useCallback(() => {
    setSelected(null);
    const next = qIndex + 1;
    if (next >= shuffledRef.current.length) {
      setPhase('result');
    } else {
      setQIndex(next);
      const q = shuffledRef.current[next];
      if (q.type === 'slide') {
        setPhase('slide');
        startTimer(q.slide_duration ?? 5, () => setPhase('question'));
      } else {
        setPhase('question');
      }
    }
  }, [qIndex, startTimer]);

  const startTest = () => {
    setQIndex(0);
    setScore(0);
    const first = shuffledRef.current[0];
    if (first.type === 'slide') {
      setPhase('slide');
      startTimer(first.slide_duration ?? 5, () => setPhase('question'));
    } else {
      setPhase('question');
    }
  };

  const handleAnswer = (optIdx: number) => {
    if (selected !== null) return;
    setSelected(optIdx);
    const q = shuffledRef.current[qIndex];
    const correct = q.correct_answers ?? [];
    if (correct.includes(optIdx)) {
      setScore(s => s + 1);
      setTimeout(nextQuestion, 600);
    } else {
      setWrongExplanation(q.explanation ?? '');
      setPhase('wrong');
      startTimer(10, () => {
        setPhase('question');
        nextQuestion();
      });
    }
  };

  const submitResult = async () => {
    const total = shuffledRef.current.filter(q => q.type === 'question').length;
    const passed = score / total >= 0.8;
    await fetch(`/api/tests/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score, total, passed }),
    });
  };

  useEffect(() => {
    if (phase === 'result') submitResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  if (phase === 'loading' || !data) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
      <p style={{ color: 'var(--text-muted)' }}>Загрузка теста...</p>
    </div>;
  }

  const questions = shuffledRef.current;
  const current = questions[qIndex];
  const questionQuestions = questions.filter(q => q.type === 'question');
  const totalQ = questionQuestions.length;
  const progress = phase === 'result' ? 100 : Math.round(qIndex / questions.length * 100);

  // READY screen
  if (phase === 'ready') {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Link href="/tests" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)' }}>{data.test.title}</h1>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <h2 style={{ fontFamily: 'Unbounded', fontSize: 16, margin: '0 0 8px', color: 'var(--text)' }}>Готовы к тесту?</h2>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.5 }}>
            {questions.length} вопросов · Нужно {Math.round(totalQ * 0.8)} правильных для зачёта
          </p>
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '10px 12px', marginBottom: 16, textAlign: 'left' }}>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
              ⏱ При ошибке — блокировка <strong style={{ color: 'var(--text)' }}>10 секунд</strong><br/>
              🔀 Вопросы перемешаны случайно<br/>
              🏆 За прохождение +100 баллов
            </p>
          </div>
        </div>
        <button className="btn-primary" onClick={startTest}>Начать тест</button>
      </div>
    );
  }

  // RESULT screen
  if (phase === 'result') {
    const passed = score / totalQ >= 0.8;
    return (
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Link href="/tests" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
          <h1 style={{ fontFamily: 'Unbounded', fontSize: 14, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Результат</h1>
        </div>
        <div className="card" style={{ padding: 24, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>{passed ? '🎉' : '📚'}</div>
          <h2 style={{ fontFamily: 'Unbounded', fontSize: 28, margin: '0 0 4px', color: passed ? 'var(--green)' : 'var(--yellow)' }}>
            {Math.round(score / totalQ * 100)}%
          </h2>
          <p style={{ fontSize: 14, color: passed ? 'var(--green)' : 'var(--yellow)', margin: '0 0 12px', fontWeight: 600 }}>
            {passed ? '✓ Зачтено' : '✗ Не зачтено'}
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
            {score} из {totalQ} правильных
          </p>
          <div style={{ marginTop: 16, background: 'var(--orange-dim)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--orange)', fontWeight: 600 }}>
              +{passed ? 100 : 30} баллов начислено
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/tests" style={{ flex: 1 }}>
            <button className="btn-secondary" style={{ width: '100%' }}>К тестам</button>
          </Link>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setQIndex(0); setScore(0); setPhase('ready'); }}>
            Пройти ещё раз
          </button>
        </div>
      </div>
    );
  }

  // SLIDE screen
  if (phase === 'slide') {
    return (
      <div style={{ padding: 16 }}>
        <div className="progress-bar" style={{ marginBottom: 16 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📊</div>
          <h3 style={{ fontFamily: 'Unbounded', fontSize: 13, margin: '0 0 12px', color: 'var(--text)' }}>{current.text}</h3>
          <div style={{ height: 140, background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Изображение схемы</p>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '10px 14px' }}>
            <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
              Изучите материал · {timer}с
            </p>
          </div>
        </div>
      </div>
    );
  }

  // WRONG screen
  if (phase === 'wrong') {
    return (
      <div style={{ padding: 16 }}>
        <div className="progress-bar" style={{ marginBottom: 16 }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ background: 'rgba(239,68,68,0.1)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16, border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--red)' }}>✗ Неверный ответ</p>
          </div>
          {wrongExplanation && (
            <div style={{ background: 'rgba(255,95,0,0.08)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 16, border: '1px solid var(--orange-dim)' }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, fontWeight: 600, color: 'var(--orange)' }}>Правильный ответ:</p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text)', lineHeight: 1.5 }}>{wrongExplanation}</p>
            </div>
          )}
          <div style={{ background: 'var(--surface2)', borderRadius: 'var(--radius-sm)', padding: '14px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, fontFamily: 'Unbounded', color: 'var(--yellow)' }}>{timer}</p>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>секунд до следующего вопроса</p>
          </div>
        </div>
      </div>
    );
  }

  // QUESTION screen
  if (!current || !current.options) return null;

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <Link href="/tests" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: 20 }}>‹</Link>
        <div style={{ flex: 1 }}>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          {qIndex + 1}/{questions.length}
        </span>
      </div>

      <div className="card" style={{ padding: 16, marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: 'var(--text)', lineHeight: 1.4 }}>{current.text}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {current.options.map((option, idx) => {
          const correct = current.correct_answers ?? [];
          let bg = 'var(--surface)';
          let border = '1px solid var(--border)';
          let color = 'var(--text)';
          if (selected !== null) {
            if (correct.includes(idx)) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid rgba(34,197,94,0.4)'; color = 'var(--green)'; }
            else if (idx === selected) { bg = 'rgba(239,68,68,0.1)'; border = '1px solid rgba(239,68,68,0.4)'; color = 'var(--red)'; }
          }
          return (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={selected !== null}
              style={{
                background: bg, border, borderRadius: 'var(--radius-sm)',
                padding: '14px 16px', textAlign: 'left', cursor: selected !== null ? 'default' : 'pointer',
                color, fontSize: 14, fontFamily: 'Golos Text', lineHeight: 1.4, transition: 'all 0.15s',
              }}
            >
              <span style={{ fontWeight: 700, marginRight: 8, color: 'var(--text-muted)' }}>
                {String.fromCharCode(65 + idx)}.
              </span>
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
