import type { NextApiRequest, NextApiResponse } from 'next'
import pool from '@/lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method tidak diizinkan' })
  }

  try {
    const client = await pool.connect()
    try {
      const result = await client.query(`
        SELECT 
          site_id,
          site_name,
          mc_cluster,
          province,
          dati_ii as city,
          scope_category,
          scope_of_work,
          ran_scope,
          nano_cluster,
          latitude,
          longitude,
          survey_ff,
          survey_af,
          mos_ff,
          mos_af,
          cutover_ff,
          cutover_af,
          site_dismantle_ff,
          site_dismantle_af
        FROM "Site"
        ORDER BY site_id ASC
      `)

      return res.status(200).json({
        data: result.rows
      })

    } finally {
      client.release()
    }

  } catch (error) {
    console.error('Error fetching data:', error)
    return res.status(500).json({ 
      error: 'Terjadi kesalahan saat mengambil data' 
    })
  }
} 