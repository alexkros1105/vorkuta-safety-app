import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    instructionStats: {
      total_employees: 5,
      completed_employees: 2,
      completion_pct: 40,
    },
    notCompleted: [
      { name: 'Петров Николай Иванович', position: 'Горнорабочий', section: 'Участок №3 (Шахта Воркутинская)' },
      { name: 'Козлов Дмитрий Алексеевич', position: 'Слесарь ВШТ', section: 'Участок №5 (Шахта Северная)' },
      { name: 'Новиков Сергей Владимирович', position: 'Взрывник', section: 'Участок №3 (Шахта Воркутинская)' },
    ],
    lightningStats: {
      total_lightning: 6,
      avg_read_count: 88,
      total_reads: 526,
    },
    sectionActivity: [
      { section: 'Участок №3 (Шахта Воркутинская)', total: 4, avg_points: 710 },
      { section: 'Участок №5 (Шахта Северная)', total: 1, avg_points: 150 },
    ],
    avgPoints: { avg: 626 },
  });
}
