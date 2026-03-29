import { NextResponse } from 'next/server';
import { queryOne, query } from '@/lib/db';

export async function GET() {
  const employee = await queryOne(`SELECT * FROM employees WHERE id = 1`);
  const salary = await queryOne(`SELECT * FROM salary_slips WHERE employee_id = 1 ORDER BY id DESC LIMIT 1`);
  const testHistory = await query(`
    SELECT r.*, t.title, t.type FROM test_results r
    JOIN tests t ON t.id = r.test_id
    WHERE r.employee_id = 1
    ORDER BY r.completed_at DESC
    LIMIT 10
  `);
  const vacation = { days_left: 28, next_vacation: '2026-07-01', vacation_end: '2026-07-28' };
  return NextResponse.json({ employee, salary, testHistory, vacation });
}
