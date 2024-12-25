'use server'

import pool from '@/lib/db'

export async function fetchSiteData() {
  const client = await pool.connect()
  try {
    const result = await client.query(`
      SELECT * FROM "Site" ORDER BY site_id ASC
    `)
    return result.rows
  } finally {
    client.release()
  }
} 