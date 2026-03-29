import { NextResponse } from 'next/server';
import { NEWS } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(NEWS);
}
