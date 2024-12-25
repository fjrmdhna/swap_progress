import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import * as XLSX from 'xlsx'
import pool from '@/lib/db'
import formidable from 'formidable'
import { validateExcelData } from '@/lib/validators'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface RowData {
  site_id: string;
  site_name: string;
  mc_cluster: string;
  province: string;
  dati_ii: string;
  scope_of_work: string;
  lat: number;
  long: number;
  system_key: string;
  'SBOQ.project_type': string;
  program_name: string;
  wbs_status: string;
  vendor_name: string;
  vendor_code: string;
  site_category: string;
  ran_score: string;
  unique_id: string;
  new_site_id: string;
  new_site_name: string;
  site_type: string;
  existing_configuration: string;
  rf_config: string;
  sales_area: string;
  kecamatan: string;
  region: string;
  region_circle: string;
}

function parseDate(dateStr: string | null): Date | null {
  if (!dateStr) return null;
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method tidak diizinkan' })
  }

  try {
    // Konfigurasi formidable untuk menerima file
    const form = new IncomingForm({
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    })

    // Parse request
    const [, files] = await new Promise<[any, formidable.Files]>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error('Error parsing form:', err)
          reject(err)
        }
        resolve([fields, files])
      })
    })

    // Validasi file
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file
    if (!uploadedFile) {
      console.error('No file uploaded')
      return res.status(400).json({ error: 'Tidak ada file yang diunggah' })
    }

    // Log file info
    console.log('File received:', {
      name: uploadedFile.originalFilename,
      type: uploadedFile.mimetype,
      size: uploadedFile.size
    })

    try {
      // Baca file Excel
      const workbook = XLSX.readFile(uploadedFile.filepath)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]

      // Validasi data
      const validation = validateExcelData(worksheet)
      if (!validation.isValid) {
        return res.status(400).json({
          error: 'Validasi gagal',
          details: validation.errors
        })
      }

      // Proses data yang valid
      const client = await pool.connect()
      try {
        await client.query('BEGIN')

        for (const row of validation.data!) {
          // Pastikan system_key ada dan tidak kosong
          if (!row.system_key) continue;

          await client.query(
            `INSERT INTO "Site" (
              system_key, vendor_name, vendor_code, year, scope_of_work,
              ran_score, unique_id, site_id, site_name, longitude, latitude,
              site_type, dati_ii, province, mc_cluster, caf_approved,
              site_status, cutover_bf, cutover_ff, cutover_af, survey_ff,
              survey_af, caf_status, caf_submitted, mos_af, mos_bf,
              mos_ff, ic_000040_af, ic_000040_bf, ic_000040_ff, imp_integ_af,
              imp_integ_bf, imp_integ_ff, rfs_af, rfs_ff, rfs_bf,
              nano_cluster, scope_category, ran_scope, site_dismantle_af,
              site_dismantle_bf, site_dismantle_ff, site_trm_type,
              summary_scope, cx_post_mr_af, cx_post_mr_ff, swap_time,
              downtime_actual, area_spider
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
              $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26,
              $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38,
              $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49
            )
            ON CONFLICT (system_key) 
            DO UPDATE SET
              vendor_name = EXCLUDED.vendor_name,
              vendor_code = EXCLUDED.vendor_code,
              year = EXCLUDED.year,
              scope_of_work = EXCLUDED.scope_of_work,
              ran_score = EXCLUDED.ran_score,
              unique_id = EXCLUDED.unique_id,
              site_id = EXCLUDED.site_id,
              site_name = EXCLUDED.site_name,
              longitude = EXCLUDED.longitude,
              latitude = EXCLUDED.latitude,
              site_type = EXCLUDED.site_type,
              dati_ii = EXCLUDED.dati_ii,
              province = EXCLUDED.province,
              mc_cluster = EXCLUDED.mc_cluster,
              caf_approved = EXCLUDED.caf_approved,
              site_status = EXCLUDED.site_status,
              cutover_bf = EXCLUDED.cutover_bf,
              cutover_ff = EXCLUDED.cutover_ff,
              cutover_af = EXCLUDED.cutover_af,
              survey_ff = EXCLUDED.survey_ff,
              survey_af = EXCLUDED.survey_af,
              caf_status = EXCLUDED.caf_status,
              caf_submitted = EXCLUDED.caf_submitted,
              mos_af = EXCLUDED.mos_af,
              mos_bf = EXCLUDED.mos_bf,
              mos_ff = EXCLUDED.mos_ff,
              ic_000040_af = EXCLUDED.ic_000040_af,
              ic_000040_bf = EXCLUDED.ic_000040_bf,
              ic_000040_ff = EXCLUDED.ic_000040_ff,
              imp_integ_af = EXCLUDED.imp_integ_af,
              imp_integ_bf = EXCLUDED.imp_integ_bf,
              imp_integ_ff = EXCLUDED.imp_integ_ff,
              rfs_af = EXCLUDED.rfs_af,
              rfs_ff = EXCLUDED.rfs_ff,
              rfs_bf = EXCLUDED.rfs_bf,
              nano_cluster = EXCLUDED.nano_cluster,
              scope_category = EXCLUDED.scope_category,
              ran_scope = EXCLUDED.ran_scope,
              site_dismantle_af = EXCLUDED.site_dismantle_af,
              site_dismantle_bf = EXCLUDED.site_dismantle_bf,
              site_dismantle_ff = EXCLUDED.site_dismantle_ff,
              site_trm_type = EXCLUDED.site_trm_type,
              summary_scope = EXCLUDED.summary_scope,
              cx_post_mr_af = EXCLUDED.cx_post_mr_af,
              cx_post_mr_ff = EXCLUDED.cx_post_mr_ff,
              swap_time = EXCLUDED.swap_time,
              downtime_actual = EXCLUDED.downtime_actual,
              area_spider = EXCLUDED.area_spider`,
            [
              row.system_key, row.vendor_name, row.vendor_code, row.year,
              row.scope_of_work, row.ran_score, row.unique_id, row.site_id,
              row.site_name, row.long ? parseFloat(row.long) : null,
              row.lat ? parseFloat(row.lat) : null,
              row.site_type, row.dati_ii, row.province, row.mc_cluster,
              parseDate(row.caf_approved),
              row.site_status,
              parseDate(row.cutover_bf),
              parseDate(row.cutover_ff),
              parseDate(row.cutover_af),
              parseDate(row.survey_ff),
              parseDate(row.survey_af),
              row.caf_status,
              parseDate(row.caf_submitted),
              parseDate(row.mos_af),
              parseDate(row.mos_bf),
              parseDate(row.mos_ff),
              parseDate(row.ic_000040_af),
              parseDate(row.ic_000040_bf),
              parseDate(row.ic_000040_ff),
              parseDate(row.imp_integ_af),
              parseDate(row.imp_integ_bf),
              parseDate(row.imp_integ_ff),
              parseDate(row.rfs_af),
              parseDate(row.rfs_ff),
              parseDate(row.rfs_bf),
              row.nano_cluster,
              row.scope_category,
              row.ran_scope,
              parseDate(row.site_dismantle_af),
              parseDate(row.site_dismantle_bf),
              parseDate(row.site_dismantle_ff),
              row.site_trm_type,
              row.summary_scope,
              row.cx_post_mr_af,
              row.cx_post_mr_ff,
              row.swap_time,
              row.downtime_actual,
              row.area_spider
            ]
          )
        }

        await client.query('COMMIT')
        return res.status(200).json({
          message: 'File berhasil diunggah dan divalidasi',
          dataCount: validation.data!.length
        })

      } catch (dbError) {
        await client.query('ROLLBACK')
        console.error('Database error:', dbError)
        throw dbError
      } finally {
        client.release()
      }

    } catch (parseError) {
      console.error('Error parsing Excel:', parseError)
      return res.status(400).json({
        error: 'Gagal membaca file Excel',
        details: [(parseError as Error).message]
      })
    }

  } catch (error) {
    console.error('Server error:', error)
    return res.status(500).json({
      error: 'Terjadi kesalahan saat mengunggah file',
      details: [error instanceof Error ? error.message : 'Unknown error']
    })
  }
} 