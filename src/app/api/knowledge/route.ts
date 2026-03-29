import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q') || '';
  const items = await query(
    `SELECT * FROM knowledge_base WHERE (title ILIKE $1 OR content ILIKE $1) ORDER BY created_at DESC`,
    [`%${search}%`]
  );
  return NextResponse.json(items);
}
