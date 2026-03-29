import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const tests = await query(`
    SELECT t.*,
      COUNT(q.id) as question_count,
      MAX(r.completed_at) as last_completed,
      MAX(r.score) as best_score,
      MAX(r.total_questions) as total_q
    FROM tests t
    LEFT JOIN test_questions q ON q.test_id = t.id
    LEFT JOIN test_results r ON r.test_id = t.id AND r.employee_id = 1
    GROUP BY t.id
    ORDER BY t.id
  `);
  return NextResponse.json(tests);
}
