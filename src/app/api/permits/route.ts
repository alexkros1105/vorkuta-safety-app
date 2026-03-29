import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const items = await query(`
    SELECT p.*, e.name as creator_name FROM work_permits p
    JOIN employees e ON e.id = p.created_by
    ORDER BY p.created_at DESC
  `);
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { work_type, location, start_time, end_time, brigade, safety_measures } = await req.json();
  const result = await query(
    `INSERT INTO work_permits (work_type, location, start_time, end_time, brigade, safety_measures, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, 1) RETURNING id`,
    [work_type, location, start_time, end_time, JSON.stringify(brigade), JSON.stringify(safety_measures)]
  );
  return NextResponse.json(result[0]);
}
