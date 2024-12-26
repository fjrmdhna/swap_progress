"use client"

import { useSiteData } from '@/app/context/SiteDataContext'
import { useState, useEffect } from 'react'
import { Search } from '../UI/Search'

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
  const [selectedFilters, setSelectedFilters] = useState({
    province: 'ALL',
    city: 'ALL',
    mc_cluster: 'ALL',
    scope_category: 'ALL',
    scope_of_work: 'ALL',
    ran_scope: 'ALL',
    nano_cluster: 'ALL'
  })

  const resetFilters = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setSelectedFilters({
        province: 'ALL',
        city: 'ALL',
        mc_cluster: 'ALL',
        scope_category: 'ALL',
        scope_of_work: 'ALL',
        ran_scope: 'ALL',
        nano_cluster: 'ALL'
      })
      setSearchValue('')
      setFilteredData(data)
      setShowNoData(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFilterChange = (type: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [type]: value
    }))
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setShowNoData(false)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      let newData = data.filter(item => {
        return Object.entries(selectedFilters).every(([key, value]) => {
          if (value === 'ALL') return true
          const fieldName = key === 'city' ? 'dati_ii' : key
          return item[fieldName] === value
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
    let filteredData = data || [];

    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value !== 'ALL' && key !== filterType) {
        const fieldName = key === 'city' ? 'dati_ii' : key;
        filteredData = filteredData.filter(item => item[fieldName] === value);
      }
    });

    const uniqueValues = new Set(filteredData.map(item => {
      switch (filterType) {
        case 'province': return item.province || '';
        case 'city': return item.dati_ii || '';
        case 'mc_cluster': return item.mc_cluster || '';
        case 'scope_category': return item.scope_category || '';
        case 'scope_of_work': return item.scope_of_work || '';
        case 'ran_scope': return item.ran_scope || '*blank*';
        case 'nano_cluster': return item.nano_cluster || '';
        default: return '';
      }
    }));

    return ['ALL', ...Array.from(uniqueValues)];
  };

  return (
    <div className="space-y-4">
      <Search value={searchValue} onChange={setSearchValue} />
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
          <select
            value={selectedFilters.province}
            onChange={(e) => handleFilterChange('province', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('province').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <select
            value={selectedFilters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('city').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">MC</label>
          <select
            value={selectedFilters.mc_cluster}
            onChange={(e) => handleFilterChange('mc_cluster', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('mc_cluster').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Scope Category</label>
          <select
            value={selectedFilters.scope_category}
            onChange={(e) => handleFilterChange('scope_category', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('scope_category').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">SOW</label>
          <select
            value={selectedFilters.scope_of_work}
            onChange={(e) => handleFilterChange('scope_of_work', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('scope_of_work').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">RAN Scope</label>
          <select
            value={selectedFilters.ran_scope}
            onChange={(e) => handleFilterChange('ran_scope', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('ran_scope').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">NC</label>
          <select
            value={selectedFilters.nano_cluster}
            onChange={(e) => handleFilterChange('nano_cluster', e.target.value)}
            className="w-full rounded-md border border-gray-300 p-2 text-sm"
          >
            {getFilteredOptions('nano_cluster').map(value => (
              <option key={value} value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          onClick={handleSubmit}
          className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Apply Filters
        </button>

        <button
          onClick={resetFilters}
          className="px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Reset
        </button>
      </div>

      {showNoData && (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-md">
          No data found with the current filters and search criteria
        </div>
      )}
    </div>
  )
} 