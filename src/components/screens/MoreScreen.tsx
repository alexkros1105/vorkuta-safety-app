'use client';

import Link from 'next/link';

const sections = [
  {
    title: 'Информация и обучение',
    items: [
      { href: '/news', icon: '📰', label: 'Новости', desc: 'Корпоративные и участковые' },
      { href: '/knowledge', icon: '📚', label: 'База знаний', desc: 'Инструкции по специальности' },
    ],
  },
  {
    title: 'Участок',
    items: [
      { href: '/section', icon: '⛏️', label: 'Мой участок', desc: 'Объявления, график, контакты' },
      { href: '/permits', icon: '📋', label: 'Наряды-допуски', desc: 'Разрешения на опасные работы' },
    ],
  },
  {
    title: 'Участие и призы',
    items: [
      { href: '/rac', icon: '💡', label: 'РАЦ-предложения', desc: 'Улучши процессы — получи баллы' },
      { href: '/cases', icon: '🎁', label: 'Призы', desc: 'Трать баллы — получи приз' },
    ],
  },
  {
    title: 'Управление',
    items: [
      { href: '/dashboard', icon: '📊', label: 'Дашборд ОТ', desc: 'Аналитика для руководителя' },
    ],
  },
];

export default function MoreScreen() {
  return (
    <div style={{ paddingBottom: 16 }}>
      <div style={{ padding: '16px 16px 12px' }}>
        <h1 style={{ fontFamily: 'Unbounded', fontSize: 18, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Меню</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '0 16px' }}>
        {sections.map(section => (
          <div key={section.title}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {section.title}
            </p>
            <div className="card" style={{ overflow: 'visible' }}>
              {section.items.map((item, i) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    padding: '14px 14px',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    display: 'flex', gap: 12, alignItems: 'center',
                  }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.label}</p>
                      <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{item.desc}</p>
                    </div>
                    <span style={{ color: 'var(--text-dim)', fontSize: 16 }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
