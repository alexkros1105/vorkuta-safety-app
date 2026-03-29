import { NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await queryOne('SELECT * FROM lightning_feed WHERE id = $1', [id]);
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Employee 1 (demo user) acknowledges
  await query(
    `INSERT INTO lightning_acknowledgments (employee_id, lightning_id) VALUES (1, $1) ON CONFLICT DO NOTHING`,
    [id]
  );
  await query(`UPDATE lightning_feed SET read_count = read_count + 1 WHERE id = $1`, [id]);
  // Award points
  await query(`UPDATE employees SET points = points + 20 WHERE id = 1`);
  return NextResponse.json({ ok: true });
}
