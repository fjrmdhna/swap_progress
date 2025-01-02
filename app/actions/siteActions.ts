'use server'

import { supabase } from '@/lib/supabase'

type SiteData = {
  id: number
  site_id: string
  site_name: string
  mc_cluster: string
  province: string
  dati_ii: string
  scope_category: string
  scope_of_work: string
  ran_scope: string
  latitude: number | null
  longitude: number | null
  nano_cluster: string
  survey_ff: string | null
  survey_af: string | null
  mos_ff: string | null
  mos_bf: string | null
  mos_af: string | null
  cutover_ff: string | null
  cutover_bf: string | null
  cutover_af: string | null
  site_dismantle_ff: string | null
  site_dismantle_bf: string | null
  site_dismantle_af: string | null
}

export async function fetchSiteData() {
  try {
    console.log('Fetching all data from Supabase...')
    
    const { data, error } = await supabase
      .from('site_data')
      .select('*')
      .order('site_id')

    if (error) {
      console.error('Error fetching data:', error)
      return []
    }

    console.log('Total data fetched:', data?.length, 'rows')
    return data || []

  } catch (error) {
    console.error('Error:', error)
    return []
  }
}

export async function searchSites(searchTerm: string) {
  try {
    let allData: SiteData[] = []
    let hasMore = true
    let page = 0
    const pageSize = 10000

    while (hasMore) {
      const { data, error } = await supabase
        .from('site_data')
        .select('*')
        .or(`site_id.ilike.%${searchTerm}%,site_name.ilike.%${searchTerm}%`)
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) {
        console.error('Error searching:', error)
        break
      }

      if (!data || data.length === 0) {
        hasMore = false
      } else {
        allData = [...allData, ...data]
        page++
      }
    }

    return allData
  } catch (error) {
    console.error('Error:', error)
    return []
  }
} 