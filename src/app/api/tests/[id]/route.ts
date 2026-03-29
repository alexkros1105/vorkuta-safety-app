import { NextResponse } from 'next/server';
import { TESTS, TEST_QUESTIONS } from '@/lib/mockData';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const test = TESTS.find(t => t.id === Number(id));
  if (!test) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const questions = TEST_QUESTIONS[Number(id)] ?? [];
  return NextResponse.json({ test, questions });
}

export async function POST(req: Request, _ctx: { params: Promise<{ id: string }> }) {
  const { passed } = await req.json();
  const pts = passed ? 100 : 30;
  return NextResponse.json({ ok: true, points_earned: pts });
}
