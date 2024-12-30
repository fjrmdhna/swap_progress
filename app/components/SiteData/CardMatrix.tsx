"use client"

import { Fragment, useMemo, useState } from 'react'
import { useSiteData } from '@/app/context/SiteDataContext'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface MatrixData {
  zone: string
  mcCluster: string
  activities: {
    'Survey AF': number
    'MOS AF': number
    'Swap AF': number
    'Dismantle AF': number
  }
}

export function CardMatrix() {
  const { filteredData } = useSiteData()
  const [expandedZones, setExpandedZones] = useState<Record<string, boolean>>(() => {
    const zones = new Set(filteredData.map(item => item.area_spider || 'Unknown'))
    return Array.from(zones).reduce((acc, zone) => ({
      ...acc,
      [zone]: false
    }), {})
  })

  const toggleZone = (zone: string) => {
    setExpandedZones(prev => ({
      ...prev,
      [zone]: !prev[zone]
    }))
  }

  const matrixData = useMemo(() => {
    const data: Record<string, MatrixData> = {}

    filteredData
      .filter(item => 
        item.area_spider && 
        item.area_spider.toLowerCase() !== 'unknown' &&
        item.mc_cluster && 
        item.mc_cluster.toLowerCase() !== 'unknown'
      )
      .forEach(item => {
        const zone = item.area_spider
        const mcCluster = item.mc_cluster
        const key = `${zone}-${mcCluster}`

        if (!data[key]) {
          data[key] = {
            zone,
            mcCluster,
            activities: {
              'Survey AF': item.survey_af ? 1 : 0,
              'MOS AF': item.mos_af ? 1 : 0,
              'Swap AF': item.cutover_af ? 1 : 0,
              'Dismantle AF': item.site_dismantle_af ? 1 : 0
            }
          }
        } else {
          if (item.survey_af) data[key].activities['Survey AF']++
          if (item.mos_af) data[key].activities['MOS AF']++
          if (item.cutover_af) data[key].activities['Swap AF']++
          if (item.site_dismantle_af) data[key].activities['Dismantle AF']++
        }
      })

    return Object.values(data)
  }, [filteredData])

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

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Zone</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">MC Cluster</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Survey AF</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">MOS AF</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Swap AF</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Dismantle AF</th>
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
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {rows.reduce((sum, row) => sum + row.activities['Survey AF'], 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {rows.reduce((sum, row) => sum + row.activities['MOS AF'], 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {rows.reduce((sum, row) => sum + row.activities['Swap AF'], 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {rows.reduce((sum, row) => sum + row.activities['Dismantle AF'], 0)}
                    </td>
                  </tr>
                  {expandedZones[zone] && rows
                    .sort((a, b) => a.mcCluster.localeCompare(b.mcCluster))
                    .map((row, idx) => (
                      <tr key={`${row.zone}-${row.mcCluster}-${idx}`} className="hover:bg-gray-50">
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500"></td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500 pl-8">
                          {row.mcCluster}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {row.activities['Survey AF']}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {row.activities['MOS AF']}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {row.activities['Swap AF']}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {row.activities['Dismantle AF']}
                        </td>
                      </tr>
                    ))}
                </Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 