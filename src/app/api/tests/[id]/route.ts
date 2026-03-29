import { NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = await queryOne('SELECT * FROM tests WHERE id = $1', [id]);
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const questions = await query(
    'SELECT * FROM test_questions WHERE test_id = $1 ORDER BY order_index',
    [id]
  );
  return NextResponse.json({ test, questions });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { score, total, passed } = await req.json();
  await query(
    `INSERT INTO test_results (employee_id, test_id, score, total_questions, passed) VALUES (1, $1, $2, $3, $4)`,
    [id, score, total, passed]
  );
  const pts = passed ? 100 : 30;
  await query(`UPDATE employees SET points = points + $1 WHERE id = 1`, [pts]);
  return NextResponse.json({ ok: true, points_earned: pts });
}
