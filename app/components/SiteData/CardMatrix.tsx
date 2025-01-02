"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useMemo } from 'react'

export function CardMatrix() {
  const { filteredData } = useSiteData()

  const stats = useMemo(() => {
    // Hanya ambil site yang existing
    const existingSites = filteredData.filter(site => 
      site.scope_of_work?.toLowerCase() === 'existing'
    )
    
    const total = existingSites.length
    const swapped = existingSites.filter(site => 
      site.cutover_af !== null
    ).length
    const surveyed = existingSites.filter(site => 
      site.survey_af !== null
    ).length
    const mos = existingSites.filter(site => 
      site.mos_af !== null
    ).length
    const dismantled = existingSites.filter(site => 
      site.site_dismantle_af !== null
    ).length

    // Target completion adalah 9632 sites
    const targetTotal = 9632
    const swapRate = total ? ((swapped / total) * 100).toFixed(1) : '0'
    const completionRate = ((swapped / targetTotal) * 100).toFixed(1)

    return {
      total,
      swapped,
      surveyed,
      mos,
      dismantled,
      swapRate,
      completionRate
    }
  }, [filteredData])

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">Total Sites</h3>
        <p className="text-2xl font-bold text-white">{stats.total}</p>
      </div>
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">Surveyed</h3>
        <p className="text-2xl font-bold text-white">{stats.surveyed}</p>
      </div>
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">MOS</h3>
        <p className="text-2xl font-bold text-white">{stats.mos}</p>
      </div>
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">Swap</h3>
        <p className="text-2xl font-bold text-white">{stats.swapped}</p>
      </div>
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">Dismantled</h3>
        <p className="text-2xl font-bold text-white">{stats.dismantled}</p>
      </div>
      <div className="p-4 rounded-lg bg-black/30 backdrop-blur">
        <h3 className="text-white/70 text-sm">Completion Rate</h3>
        <p className="text-2xl font-bold text-white">{stats.completionRate}%</p>
      </div>
    </div>
  )
} 