import { NextResponse } from 'next/server';
import { LIGHTNING_FEED } from '@/lib/mockData';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = LIGHTNING_FEED.find(l => l.id === Number(id));
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(item);
}

export async function POST(_req: Request, _ctx: { params: Promise<{ id: string }> }) {
  return NextResponse.json({ ok: true });
}
