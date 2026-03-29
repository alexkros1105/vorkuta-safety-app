import { NextResponse } from 'next/server';
import { CASES, EMPLOYEE } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json({ cases: CASES, points: EMPLOYEE.points, history: [] });
}

export async function POST(req: Request) {
  const { case_id } = await req.json();
  const cs = CASES.find(c => c.id === Number(case_id));
  if (!cs) return NextResponse.json({ error: 'Case not found' }, { status: 404 });

  const rewards = cs.rewards;
  const rand = Math.random();
  let cumulative = 0;
  let reward = rewards[rewards.length - 1];
  for (const r of rewards) {
    cumulative += r.probability;
    if (rand <= cumulative) { reward = r; break; }
  }

  return NextResponse.json({ reward });
}
