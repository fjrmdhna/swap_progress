"use client"

import { Fragment, useMemo, useState } from 'react'
import { useSiteData } from '@/app/context/SiteDataContext'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface MatrixData {
  zone: string
  mcCluster: string
  months: {
    [key: string]: {
      total: number
      weeks: {
        [key: string]: number
      }
    }
  }
}

export function CardMatrix() {
  const { filteredData } = useSiteData()
  const [expandedZones, setExpandedZones] = useState<Record<string, boolean>>({
    'EAST': true,
    'WEST': true
  })
  const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({})

  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  const formatMonthYear = (date: Date) => {
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    return `M${month}-${year}`
  }

  const formatWeek = (date: Date) => {
    return `W${getWeekNumber(date)}`
  }

  const matrixData = useMemo(() => {
    const data: Record<string, MatrixData> = {}

    filteredData.forEach(item => {
      const zone = item.area_spider || 'Unknown'
      const mcCluster = item.mc_cluster || 'Unknown'
      const key = `${zone}-${mcCluster}`

      if (!data[key]) {
        data[key] = {
          zone,
          mcCluster,
          months: {}
        }
      }

      if (item.cutover_ff) {
        const date = new Date(item.cutover_ff)
        const monthKey = formatMonthYear(date)
        const weekKey = formatWeek(date)

        if (!data[key].months[monthKey]) {
          data[key].months[monthKey] = {
            total: 0,
            weeks: {}
          }
        }

        data[key].months[monthKey].total++
        data[key].months[monthKey].weeks[weekKey] = (data[key].months[monthKey].weeks[weekKey] || 0) + 1
      }
    })

    return Object.values(data)
  }, [filteredData])

  const sortedMonths = useMemo(() => {
    const allMonths = Array.from(new Set(matrixData.flatMap(d => Object.keys(d.months))))
    return allMonths.sort((a, b) => {
      // Parse M1-2024 format
      const [monthA, yearA] = a.replace('M', '').split('-').map(Number)
      const [monthB, yearB] = b.replace('M', '').split('-').map(Number)
      
      // Compare years first, then months
      if (yearA !== yearB) return yearA - yearB
      return monthA - monthB
    })
  }, [matrixData])

  // Group data by zone
  const groupedData = useMemo(() => {
    return matrixData.reduce((acc, row) => {
      if (!acc[row.zone]) {
        acc[row.zone] = []
      }
      acc[row.zone].push(row)
      return acc
    }, {} as Record<string, MatrixData[]>)
  }, [matrixData])

  const toggleZone = (zone: string) => {
    setExpandedZones(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }))
  }

  const toggleMonth = (monthKey: string) => {
    setExpandedMonths(prev => ({
      ...prev,
      [monthKey]: !prev[monthKey]
    }))
  }

  const getMonthWeeks = (monthKey: string) => {
    const weeks = new Set<string>()
    
    filteredData.forEach(item => {
      if (item.cutover_ff) {
        const date = new Date(item.cutover_ff)
        const itemMonthKey = formatMonthYear(date)
        if (itemMonthKey === monthKey) {
          weeks.add(`W${getWeekNumber(date).toString().padStart(2, '0')}`)
        }
      }
    })

    return Array.from(weeks).sort()
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h3 className="text-lg font-medium mb-4">Zone Planning Matrix</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">MC Cluster</th>
              {sortedMonths.map(month => (
                <Fragment key={month}>
                  <th 
                    className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleMonth(month)}
                  >
                    <div className="flex items-center gap-1">
                      {expandedMonths[month] ? (
                        <ChevronDown className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                      {month}
                    </div>
                  </th>
                  {expandedMonths[month] && getMonthWeeks(month).map(week => (
                    <th key={week} className="px-3 py-2 text-left text-xs font-medium text-gray-500">
                      {week}
                    </th>
                  ))}
                </Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData)
              .sort(([zoneA], [zoneB]) => zoneA.localeCompare(zoneB))
              .map(([zone, rows]) => (
                <Fragment key={zone}>
                  <tr className="bg-gray-50">
                    <td 
                      colSpan={2}
                      className="px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-700 cursor-pointer hover:bg-gray-100"
                      onClick={() => toggleZone(zone)}
                    >
                      <div className="flex items-center gap-1">
                        {expandedZones[zone] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        {zone}
                      </div>
                    </td>
                    {sortedMonths.map(month => (
                      <Fragment key={month}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {rows.reduce((sum, row) => sum + (row.months[month]?.total || 0), 0)}
                        </td>
                        {expandedMonths[month] && getMonthWeeks(month).map(week => (
                          <td key={week} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                            {rows.reduce((sum, row) => sum + (row.months[month]?.weeks[week] || 0), 0)}
                          </td>
                        ))}
                      </Fragment>
                    ))}
                  </tr>
                  {expandedZones[zone] && rows
                    .sort((a, b) => a.mcCluster.localeCompare(b.mcCluster))
                    .map((row, idx) => (
                      <Fragment key={`${row.zone}-${row.mcCluster}-${idx}`}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"></td>
                          <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 pl-8">
                            {row.mcCluster}
                          </td>
                          {sortedMonths.map(month => (
                            <Fragment key={month}>
                              <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                {row.months[month]?.total || 0}
                              </td>
                              {expandedMonths[month] && getMonthWeeks(month).map(week => (
                                <td key={week} className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                                  {row.months[month]?.weeks[week] || 0}
                                </td>
                              ))}
                            </Fragment>
                          ))}
                        </tr>
                      </Fragment>
                    ))}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 