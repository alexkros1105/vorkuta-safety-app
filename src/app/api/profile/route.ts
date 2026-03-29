import { NextResponse } from 'next/server';
import { EMPLOYEE, SALARY, TESTS, generateShiftSchedule } from '@/lib/mockData';

export async function GET() {
  const testHistory = TESTS.filter(t => t.last_completed).map(t => ({
    title: t.title,
    type: t.type,
    score: t.best_score,
    total_questions: t.total_q,
    passed: true,
    completed_at: t.last_completed,
  }));

  const schedule = generateShiftSchedule();
  const vacation = { days_left: 28, next_vacation: '2026-07-01', vacation_end: '2026-07-28' };

  return NextResponse.json({ employee: EMPLOYEE, salary: SALARY, testHistory, vacation, schedule });
}
