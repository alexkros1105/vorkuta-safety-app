import { NextResponse } from 'next/server';
import { RAC_PROPOSALS } from '@/lib/mockData';

const proposals = [...RAC_PROPOSALS];
let nextId = proposals.length + 1;

export async function GET() {
  return NextResponse.json(proposals);
}

export async function POST(req: Request) {
  const { title, problem, solution, expected_effect } = await req.json();
  const proposal = {
    id: nextId++,
    employee_id: 1,
    title,
    problem,
    solution,
    expected_effect,
    status: 'review',
    rejection_reason: null,
    submitted_at: new Date().toISOString(),
    author_name: 'Иванов Александр Петрович',
  };
  proposals.unshift(proposal);
  return NextResponse.json({ ok: true });
}
