"use client"

import { useMemo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { useSiteData } from '@/app/context/SiteDataContext'

export function CardBarChart() {
  const { filteredData } = useSiteData()

  const chartData = useMemo(() => {
    const monthlyData: Record<string, any> = {}
    
    // Fungsi untuk format tanggal
    const formatMonthYear = (dateStr: string) => {
      if (!dateStr) return null
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) return null
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
    }

    // Kumpulkan semua bulan yang unik
    const allMonths = new Set<string>()
    filteredData.forEach(item => {
      [
        item.survey_ff, item.survey_af,
        item.mos_ff, item.mos_af,
        item.cutover_ff, item.cutover_af,
        item.site_dismantle_ff, item.site_dismantle_af
      ].forEach(date => {
        const monthYear = formatMonthYear(date)
        if (monthYear) allMonths.add(monthYear)
      })
    })

    // Inisialisasi data untuk semua bulan
    Array.from(allMonths).sort().forEach(monthYear => {
      monthlyData[monthYear] = {
        monthYear,
        'Survey BF': 0,
        'Survey AF': 0,
        'MOS BF': 0,
        'MOS AF': 0,
        'Swap BF': 0,
        'Swap AF': 0,
        'Dismantle BF': 0,
        'Dismantle AF': 0
      }
    })

    // Hitung data
    filteredData.forEach(item => {
      // Survey
      const surveyBFMonth = formatMonthYear(item.survey_ff)
      const surveyAFMonth = formatMonthYear(item.survey_af)
      if (surveyBFMonth && monthlyData[surveyBFMonth]) monthlyData[surveyBFMonth]['Survey BF']++
      if (surveyAFMonth && monthlyData[surveyAFMonth]) monthlyData[surveyAFMonth]['Survey AF']++

      // MOS
      const mosBFMonth = formatMonthYear(item.mos_ff)
      const mosAFMonth = formatMonthYear(item.mos_af)
      if (mosBFMonth && monthlyData[mosBFMonth]) monthlyData[mosBFMonth]['MOS BF']++
      if (mosAFMonth && monthlyData[mosAFMonth]) monthlyData[mosAFMonth]['MOS AF']++

      // Swap
      const swapBFMonth = formatMonthYear(item.cutover_ff)
      const swapAFMonth = formatMonthYear(item.cutover_af)
      if (swapBFMonth && monthlyData[swapBFMonth]) monthlyData[swapBFMonth]['Swap BF']++
      if (swapAFMonth && monthlyData[swapAFMonth]) monthlyData[swapAFMonth]['Swap AF']++

      // Dismantle
      const dismantleBFMonth = formatMonthYear(item.site_dismantle_ff)
      const dismantleAFMonth = formatMonthYear(item.site_dismantle_af)
      if (dismantleBFMonth && monthlyData[dismantleBFMonth]) monthlyData[dismantleBFMonth]['Dismantle BF']++
      if (dismantleAFMonth && monthlyData[dismantleAFMonth]) monthlyData[dismantleAFMonth]['Dismantle AF']++
    })

    console.log('Chart Data:', monthlyData) // Untuk debugging

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.monthYear).getTime() - new Date(b.monthYear).getTime()
    )
  }, [filteredData])

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-medium mb-4">Site Progress by Month</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
            />
            <XAxis 
              dataKey="monthYear"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tickMargin={30}
              axisLine={{ strokeWidth: 2 }}
            />
            <YAxis axisLine={{ strokeWidth: 2 }} />
            <Tooltip />
            <Legend 
              verticalAlign="top"
              height={36}
            />
            <Bar dataKey="Survey BF" fill="#8884d8" name="Survey BF" barSize={20} />
            <Bar dataKey="Survey AF" fill="#8884d888" name="Survey AF" barSize={20} />
            <Bar dataKey="MOS BF" fill="#82ca9d" name="MOS BF" barSize={20} />
            <Bar dataKey="MOS AF" fill="#82ca9d88" name="MOS AF" barSize={20} />
            <Bar dataKey="Swap BF" fill="#ffc658" name="Swap BF" barSize={20} />
            <Bar dataKey="Swap AF" fill="#ffc65888" name="Swap AF" barSize={20} />
            <Bar dataKey="Dismantle BF" fill="#ff8042" name="Dismantle BF" barSize={20} />
            <Bar dataKey="Dismantle AF" fill="#ff804288" name="Dismantle AF" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 