import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const items = await query(`SELECT * FROM news ORDER BY published_at DESC`);
  return NextResponse.json(items);
}
