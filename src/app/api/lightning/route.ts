import { NextResponse } from 'next/server';
import { LIGHTNING_FEED } from '@/lib/mockData';

export async function GET() {
  return NextResponse.json(LIGHTNING_FEED);
}
