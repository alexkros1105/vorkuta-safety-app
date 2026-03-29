import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  const [instructionStats] = await query(`
    SELECT
      COUNT(DISTINCT e.id) as total_employees,
      COUNT(DISTINCT r.employee_id) as completed_employees,
      ROUND(COUNT(DISTINCT r.employee_id)::numeric / NULLIF(COUNT(DISTINCT e.id),0) * 100) as completion_pct
    FROM employees e
    LEFT JOIN test_results r ON r.employee_id = e.id AND r.passed = true
  `);

  const notCompleted = await query(`
    SELECT e.name, e.position, e.section FROM employees e
    WHERE e.id NOT IN (SELECT DISTINCT employee_id FROM test_results WHERE passed = true)
  `);

  const [lightningStats] = await query(`
    SELECT
      COUNT(DISTINCT l.id) as total_lightning,
      ROUND(AVG(l.read_count)::numeric) as avg_read_count,
      SUM(l.read_count) as total_reads
    FROM lightning_feed l
  `);

  const sectionActivity = await query(`
    SELECT e.section,
      COUNT(DISTINCT e.id) as total,
      AVG(e.points) as avg_points
    FROM employees e
    GROUP BY e.section
    ORDER BY avg_points DESC
  `);

  const [avgPoints] = await query(`SELECT ROUND(AVG(points)) as avg FROM employees`);

  return NextResponse.json({
    instructionStats,
    notCompleted,
    lightningStats,
    sectionActivity,
    avgPoints,
  });
}
