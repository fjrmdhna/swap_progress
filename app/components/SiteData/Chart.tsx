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

export default function Chart() {
  const { filteredData } = useSiteData()
  
  const chartData = useMemo(() => {
    const monthlyData: Record<string, any> = {}
    
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
        item.cutover_ff, item.cutover_af
      ].forEach(date => {
        const monthYear = formatMonthYear(date)
        if (monthYear) allMonths.add(monthYear)
      })
    })

    // Inisialisasi data untuk semua bulan
    Array.from(allMonths).sort().forEach(monthYear => {
      monthlyData[monthYear] = {
        monthYear,
        'Swap BF': 0,
        'Swap AF': 0
      }
    })

    // Hitung data
    filteredData.forEach(item => {
      // Swap
      const swapBFMonth = formatMonthYear(item.cutover_ff)
      const swapAFMonth = formatMonthYear(item.cutover_af)
      if (swapBFMonth && monthlyData[swapBFMonth]) monthlyData[swapBFMonth]['Swap BF']++
      if (swapAFMonth && monthlyData[swapAFMonth]) monthlyData[swapAFMonth]['Swap AF']++
    })

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.monthYear).getTime() - new Date(b.monthYear).getTime()
    )
  }, [filteredData])

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="monthYear" angle={-45} textAnchor="end" height={100} interval={0} tickMargin={30} axisLine={{ strokeWidth: 2 }} />
          <YAxis axisLine={{ strokeWidth: 2 }} />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          <Bar dataKey="Swap BF" fill="#ffc658" name="Swap BF" barSize={20} />
          <Bar dataKey="Swap AF" fill="#F2059F" name="Swap AF" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
} 