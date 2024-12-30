"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useState, useEffect } from 'react'
import { Search } from '../UI/Search'
import { ChevronDown } from 'lucide-react'

interface FilterCounts {
  byProvince: string[]
  byCity: string[]
  byMcCluster: string[]
  byScopeCategory: string[]
  byScopeOfWork: string[]
  byRanScope: string[]
  byNanoCluster: string[]
}

interface CardFilterProps {
  data: any[];
  onFilterChange: (filters: Record<string, string>) => void;
}

export function CardFilter() {
  const { data, setFilteredData, setIsLoading } = useSiteData()
  const [searchValue, setSearchValue] = useState('')
  const [showNoData, setShowNoData] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    province: [],
    city: [],
    mc_cluster: [],
    scope_category: [],
    scope_of_work: [],
    ran_scope: [],
    nano_cluster: []
  })
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.filter-dropdown')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const resetFilters = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 100))
      setSelectedFilters({
        province: [],
        city: [],
        mc_cluster: [],
        scope_category: [],
        scope_of_work: [],
        ran_scope: [],
        nano_cluster: []
      })
      setSearchValue('')
      setFilteredData(data)
      setShowNoData(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (type: string, value: string, checked: boolean) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: checked 
        ? [...prev[type], value]
        : prev[type].filter(v => v !== value)
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setShowNoData(false)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 100))

      let newData = data.filter(item => {
        return Object.entries(selectedFilters).every(([key, values]) => {
          if (values.length === 0) return true
          const fieldName = key === 'city' ? 'dati_ii' : key
          return values.includes(item[fieldName])
        })
      })

      if (searchValue) {
        const searchLower = searchValue.toLowerCase()
        newData = newData.filter(item => 
          Object.values(item).some(value => 
            String(value).toLowerCase().includes(searchLower)
          )
        )
      }

      setFilteredData(newData)
      setShowNoData(newData.length === 0)
    } finally {
      setIsLoading(false)
    }
  }

  const getFilteredOptions = (filterType: string) => {
    let filteredData = data || []

    // Filter data berdasarkan filter yang sudah dipilih
    filteredData = filteredData.filter(item => {
      return Object.entries(selectedFilters).every(([key, values]) => {
        // Skip filter type yang sedang dicari opsinya
        if (key === filterType) return true
        if (values.length === 0) return true
        
        const fieldName = key === 'city' ? 'dati_ii' : key
        return values.includes(item[fieldName])
      })
    })

    // Ambil nilai unik untuk filter yang diminta
    const uniqueValues = new Set(filteredData.map(item => {
      switch (filterType) {
        case 'province': return item.province || ''
        case 'city': return item.dati_ii || ''
        case 'mc_cluster': return item.mc_cluster || ''
        case 'scope_category': return item.scope_category || ''
        case 'scope_of_work': return item.scope_of_work || ''
        case 'ran_scope': return item.ran_scope || '*blank*'
        case 'nano_cluster': return item.nano_cluster || ''
        default: return ''
      }
    }))

    return Array.from(uniqueValues).filter(Boolean).sort()
  }

  const toggleDropdown = (key: string) => {
    setOpenDropdown(openDropdown === key ? null : key)
  }

  return (
    <div className="space-y-6 min-h-[300px] flex flex-col justify-between pb-4">
      <div className="space-y-6">
        <Search value={searchValue} onChange={setSearchValue} />
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
          {Object.entries({
            province: 'Province',
            city: 'City',
            mc_cluster: 'MC',
            scope_category: 'Scope Category',
            scope_of_work: 'SOW',
            ran_scope: 'RAN Scope',
            nano_cluster: 'NC'
          }).map(([key, label]) => (
            <div key={key} className="relative filter-dropdown">
              <label className="filter-label">{label}</label>
              <button
                onClick={() => toggleDropdown(key)}
                className="select w-full text-left flex items-center justify-between group hover:border-[#F2059F]/30"
              >
                <span className="truncate text-sm">
                  {selectedFilters[key].length 
                    ? `${selectedFilters[key].length} selected` 
                    : 'Select...'}
                </span>
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 text-gray-400 group-hover:text-[#F2059F] ${
                    openDropdown === key ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === key && (
                <div className="absolute z-50 w-max min-w-full mt-1 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 max-h-[300px] overflow-y-auto">
                  <div className="p-2 space-y-1">
                    <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 pb-2 mb-2">
                      <div className="flex items-center justify-between px-2">
                        <span className="text-xs font-medium text-gray-500">
                          {getFilteredOptions(key).length} options
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedFilters(prev => ({
                              ...prev,
                              [key]: []
                            }))
                          }}
                          className="text-xs text-[#F2059F] hover:text-[#F2059F]/80 ml-4"
                        >
                          Clear
                        </button>
                      </div>
                    </div>
                    {getFilteredOptions(key).map(value => (
                      <label 
                        key={value} 
                        className="flex items-center gap-2 px-2 py-1.5 hover:bg-[#F2059F]/5 rounded cursor-pointer transition-colors duration-150 whitespace-nowrap"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilters[key].includes(value)}
                          onChange={(e) => handleFilterChange(key, value, e.target.checked)}
                          className="rounded border-gray-300 text-[#F2059F] focus:ring-[#F2059F] transition-all duration-150"
                        />
                        <span className="text-sm text-gray-700">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {showNoData && (
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
            No data found with the current filters and search criteria
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button onClick={resetFilters} className="btn-reset">
          Reset
        </button>
        <button onClick={handleSubmit} className="btn-apply">
          Apply Filters
        </button>
      </div>
    </div>
  )
} 