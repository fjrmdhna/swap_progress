"use client"

import { useState } from 'react'
import * as XLSX from 'xlsx'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loading } from './Loading'
import { useLoading } from '@/app/context/LoadingContext'

export function Upload() {
  const { loading, setLoading } = useLoading()
  const router = useRouter()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)

      // Read Excel file
      const reader = new FileReader()
      reader.onload = async (e) => {
        try {
          const data = e.target?.result
          const workbook = XLSX.read(data, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const sheet = workbook.Sheets[sheetName]
          
          // Skip row 1, mulai dari row 2 untuk header
          const jsonData = XLSX.utils.sheet_to_json(sheet, { range: 1 })

          console.log('Excel data:', jsonData[0])

          // Transform data
          const transformedData = jsonData.map((row: any) => {
            // Helper function untuk konversi Excel date number ke format ISO string
            const excelDateToISO = (excelDate: any) => {
              if (!excelDate) return null;
              try {
                // Excel dates are number of days since 1900-01-01
                const date = new Date(Math.round((excelDate - 25569) * 86400 * 1000));
                return date.toISOString();
              } catch (error) {
                console.log('Invalid date:', excelDate);
                return null;
              }
            };

            return {
              system_key: row.system_key || null,
              site_id: row.site_id || null,
              site_name: row.site_name || null,
              mc_cluster: row.mc_cluster || null,
              province: row.province || null,
              dati_ii: row.dati_ii || null,
              scope_category: row.scope_category || null,
              scope_of_work: row.scope_of_work || null,
              ran_scope: row.ran_scope || null,
              latitude: isNaN(Number(row.lat)) ? null : Number(row.lat),
              longitude: isNaN(Number(row.long)) ? null : Number(row.long),
              nano_cluster: row.nano_cluster || null,
              // Konversi semua field tanggal
              survey_ff: excelDateToISO(row.survey_ff),
              survey_af: excelDateToISO(row.survey_af),
              mos_ff: excelDateToISO(row.mos_ff),
              mos_bf: excelDateToISO(row.mos_bf),
              mos_af: excelDateToISO(row.mos_af),
              cutover_ff: excelDateToISO(row.cutover_ff),
              cutover_bf: excelDateToISO(row.cutover_bf),
              cutover_af: excelDateToISO(row.cutover_af),
              site_dismantle_ff: excelDateToISO(row.site_dismantle_ff),
              site_dismantle_bf: excelDateToISO(row.site_dismantle_bf),
              site_dismantle_af: excelDateToISO(row.site_dismantle_af)
            };
          });

          console.log('Transformed data:', transformedData[0])

          // Upload to Supabase
          try {
            console.log('Attempting to upload to table:', 'site_data')
            const { data: uploadedData, error } = await supabase
              .from('site_data')
              .upsert(transformedData, { 
                onConflict: 'system_key',
                ignoreDuplicates: false 
              })
              .select()

            if (error) {
              throw new Error(`Supabase error: ${error.message}`)
            }

            if (!uploadedData) {
              throw new Error('No data returned from Supabase')
            }

            console.log('Upload success, rows:', uploadedData.length)
            router.refresh()
            window.location.reload()
            alert(`Data berhasil diupload! ${uploadedData.length} rows affected.`)
          } finally {
            setLoading(false)
          }
        } catch (error) {
          setLoading(false)
          console.error('Error detail:', error)
          alert('Gagal memproses file: ' + (error as Error).message)
        }
      }

      reader.readAsBinaryString(file)
    } catch (error) {
      setLoading(false)
      console.error('Upload error:', error)
      alert('Gagal mengupload file: ' + (error as Error).message)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        disabled={loading}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
          file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100 disabled:opacity-50"
      />
    </div>
  )
} 