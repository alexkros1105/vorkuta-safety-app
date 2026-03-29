import { NextResponse } from 'next/server';
import { KNOWLEDGE_BASE } from '@/lib/mockData';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = (searchParams.get('q') || '').toLowerCase();
  const items = search
    ? KNOWLEDGE_BASE.filter(
        k => k.title.toLowerCase().includes(search) || k.content.toLowerCase().includes(search)
      )
    : KNOWLEDGE_BASE;
  return NextResponse.json(items);
}
