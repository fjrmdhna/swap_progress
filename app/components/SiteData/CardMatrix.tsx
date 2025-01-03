"use client"

import { useSiteData } from '@/app/context/SiteDataContext'

export function CardMatrix() {
  const { filteredData } = useSiteData()

  // Filter hanya site yang existing
  const existingSites = filteredData.filter(site => 
    site.scope_of_work?.toLowerCase() === 'existing'
  )

  // Hitung total existing sites
  const totalSites = existingSites.length

  // Hitung surveyed sites dari existing sites
  const surveyedSites = existingSites.filter(site => site.survey_af).length

  // Hitung MOS sites dari existing sites
  const mosSites = existingSites.filter(site => site.mos_af).length

  // Hitung swapped sites dari existing sites
  const swappedSites = existingSites.filter(site => site.cutover_af).length

  // Hitung dismantled sites dari existing sites
  const dismantledSites = existingSites.filter(site => site.site_dismantle_af).length

  // Target total tetap 9632 sites
  const targetTotal = 9632
  // Hitung completion rate berdasarkan target
  const completionRate = ((swappedSites / targetTotal) * 100).toFixed(1)

  return (
    <div className="w-full h-full flex flex-col gap-1">
      <h3 className="text-[10px] font-medium text-white/90">Overview</h3>
      
      <div className="grid grid-cols-6 gap-1 flex-1">
        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">Total Sites</span>
          <span className="text-sm font-bold text-white">{totalSites}</span>
        </div>
        
        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">Surveyed</span>
          <span className="text-sm font-bold text-white">{surveyedSites}</span>
        </div>

        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">MOS</span>
          <span className="text-sm font-bold text-white">{mosSites}</span>
        </div>

        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">Swap</span>
          <span className="text-sm font-bold text-white">{swappedSites}</span>
        </div>

        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">Dismantled</span>
          <span className="text-sm font-bold text-white">{dismantledSites}</span>
        </div>

        <div className="bg-black/30 rounded p-1 flex flex-col items-center justify-center">
          <span className="text-[8px] text-white/60">Completion Rate</span>
          <span className="text-sm font-bold text-white">{completionRate}%</span>
        </div>
      </div>
    </div>
  )
} 