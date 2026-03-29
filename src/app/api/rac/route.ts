import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const items = await query(`
    SELECT r.*, e.name as author_name FROM rac_proposals r
    JOIN employees e ON e.id = r.employee_id
    ORDER BY r.submitted_at DESC
  `);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { title, problem, solution, expected_effect } = await req.json();
  await query(
    `INSERT INTO rac_proposals (employee_id, title, problem, solution, expected_effect) VALUES (1, $1, $2, $3, $4)`,
    [title, problem, solution, expected_effect]
  );
  await query(`UPDATE employees SET points = points + 50 WHERE id = 1`);
  return NextResponse.json({ ok: true });
}
