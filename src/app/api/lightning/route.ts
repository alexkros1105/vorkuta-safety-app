import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const items = await query(`
    SELECT l.*,
      COUNT(a.id) as ack_count
    FROM lightning_feed l
    LEFT JOIN lightning_acknowledgments a ON a.lightning_id = l.id
    GROUP BY l.id
    ORDER BY l.published_at DESC
  `);
  return NextResponse.json(items);
}
