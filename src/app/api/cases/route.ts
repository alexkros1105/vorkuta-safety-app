import { NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export async function GET() {
  const cases = await query(`SELECT * FROM cases ORDER BY cost_points`);
  const employee = await queryOne(`SELECT points FROM employees WHERE id = 1`);
  const history = await query(`
    SELECT co.*, c.name as case_name FROM case_openings co
    JOIN cases c ON c.id = co.case_id
    WHERE co.employee_id = 1
    ORDER BY co.opened_at DESC LIMIT 5
  `);
  return NextResponse.json({ cases, points: (employee as { points: number })?.points ?? 0, history });
}

export async function POST(req: Request) {
  const { case_id } = await req.json();
  const cs = await queryOne<{ id: number; cost_points: number; rewards: Array<{ name: string; rarity: string; probability: number; icon: string }> }>(
    `SELECT * FROM cases WHERE id = $1`, [case_id]
  );
  if (!cs) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  const emp = await queryOne<{ points: number }>(`SELECT points FROM employees WHERE id = 1`);
  if (!emp || emp.points < cs.cost_points) {
    return NextResponse.json({ error: 'Недостаточно баллов' }, { status: 400 });
  }

  // Pick reward by probability
  const rewards = cs.rewards;
  const rand = Math.random();
  let cumulative = 0;
  let reward = rewards[rewards.length - 1];
  for (const r of rewards) {
    cumulative += r.probability;
    if (rand <= cumulative) { reward = r; break; }
  }

  await query(`UPDATE employees SET points = points - $1 WHERE id = 1`, [cs.cost_points]);
  await query(
    `INSERT INTO case_openings (employee_id, case_id, reward) VALUES (1, $1, $2)`,
    [case_id, JSON.stringify(reward)]
  );

  return NextResponse.json({ reward });
}
