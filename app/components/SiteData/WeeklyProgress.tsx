"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useMemo, useState } from 'react'

export function WeeklyProgress() {
  const { filteredData } = useSiteData()
  const [showAll, setShowAll] = useState(false)

  const weeklyStats = useMemo(() => {
    const existingSites = filteredData.filter(site => 
      site.scope_of_work?.toLowerCase() === 'existing'
    )

    // Group by week
    const weeklyData = existingSites.reduce((acc, site) => {
      if (site.cutover_af) {
        const date = new Date(site.cutover_af)
        const weekNumber = getWeekNumber(date)
        acc[weekNumber] = (acc[weekNumber] || 0) + 1
      }
      return acc
    }, {} as Record<string, number>)

    // Sort weeks
    return Object.entries(weeklyData)
      .sort(([a], [b]) => Number(b) - Number(a))
      .reverse() as [string, number][]

  }, [filteredData])

  // Get either last 8 weeks or all weeks based on showAll
  const displayedStats = showAll ? weeklyStats : weeklyStats.slice(-8)

  return (
    <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Weekly Progress</h2>
        <button 
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-white/70 hover:text-white"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>
      <div className="overflow-x-auto">
        <div className={`grid grid-cols-${Math.min(8, displayedStats.length)} gap-2 min-w-fit`}>
          {displayedStats.map(([week, count]: [string, number]) => (
            <div 
              key={week} 
              className="p-3 rounded bg-black/20 text-center w-24"
            >
              <div className="text-sm text-white/70">W{week}</div>
              <div className="text-xl font-bold text-white">{count}</div>
              <div className="text-xs text-white/50">sites</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper function to get week number
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
} 