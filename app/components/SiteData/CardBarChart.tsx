"use client"

import dynamic from 'next/dynamic'
import { WeeklyProgress } from './WeeklyProgress'
import { useSiteData } from '@/app/context/SiteDataContext'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts'

interface ChartData {
  month: string
  'Swap BF': number
  'Swap AF': number
}

export function CardBarChart() {
  const { filteredData } = useSiteData()
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    // Hitung data untuk chart
    const monthlyData = filteredData.reduce((acc: { [key: string]: { bf: number; af: number } }, item) => {
      // Handle Swap BF (cutover_ff)
      if (item.cutover_ff) {
        const date = new Date(item.cutover_ff)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!acc[monthKey]) {
          acc[monthKey] = { bf: 0, af: 0 }
        }
        acc[monthKey].bf++
      }

      // Handle Swap AF (cutover_af)
      if (item.cutover_af) {
        const date = new Date(item.cutover_af)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!acc[monthKey]) {
          acc[monthKey] = { bf: 0, af: 0 }
        }
        acc[monthKey].af++
      }

      return acc
    }, {})

    // Convert to chart format
    const formattedData = Object.entries(monthlyData)
      .map(([month, counts]) => ({
        month,
        'Swap BF': counts.bf,
        'Swap AF': counts.af
      }))
      .sort((a, b) => a.month.localeCompare(b.month))

    setChartData(formattedData)
  }, [filteredData])

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-[10px] font-medium text-white/90 mb-1">Site Progress by Month</h3>
      
      <div className="flex-1 min-h-0 bg-white/95 rounded-lg p-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(0,0,0,0.1)"
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="rgba(0,0,0,0.5)"
              tick={{ fill: 'rgba(0,0,0,0.8)', fontSize: 8 }}
              tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
            />
            <YAxis
              stroke="rgba(0,0,0,0.5)"
              tick={{ fill: 'rgba(0,0,0,0.8)', fontSize: 8 }}
              tickLine={{ stroke: 'rgba(0,0,0,0.2)' }}
              axisLine={{ stroke: 'rgba(0,0,0,0.2)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '4px',
                fontSize: '10px',
                padding: '4px 8px'
              }}
              labelStyle={{ color: 'black', fontWeight: 'bold', fontSize: '10px' }}
              itemStyle={{ color: 'rgba(0,0,0,0.8)', fontSize: '10px' }}
            />
            <Bar 
              dataKey="Swap BF" 
              fill="rgba(255,165,0,0.8)"
              radius={[2, 2, 0, 0]}
            >
              <LabelList 
                dataKey="Swap BF"
                position="top"
                fill="rgba(0,0,0,0.8)"
                fontSize={8}
              />
            </Bar>
            <Bar 
              dataKey="Swap AF" 
              fill="rgba(255,20,147,0.8)"
              radius={[2, 2, 0, 0]}
            >
              <LabelList 
                dataKey="Swap AF"
                position="top"
                fill="rgba(0,0,0,0.8)"
                fontSize={8}
              />
            </Bar>
            <Legend
              wrapperStyle={{
                fontSize: '8px',
                paddingTop: '4px'
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
} 