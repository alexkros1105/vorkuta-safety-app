import { NextResponse } from 'next/server';
import { WORK_PERMITS } from '@/lib/mockData';

const permits = [...WORK_PERMITS];
let nextId = permits.length + 1;

export async function GET() {
  return NextResponse.json(permits);
}

export async function POST(req: Request) {
  const { work_type, location, start_time, end_time, brigade, safety_measures } = await req.json();
  const permit = {
    id: nextId++,
    work_type,
    location,
    start_time,
    end_time,
    brigade,
    safety_measures,
    status: 'review',
    created_at: new Date().toISOString(),
    creator_name: 'Иванов Александр Петрович',
  };
  permits.unshift(permit);
  return NextResponse.json(permit);
}
