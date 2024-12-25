'use client'

import { createContext, useContext, useState } from 'react'
import { Loading } from '../components/UI/Loading'

interface SiteDataContextType {
  data: any[]
  filteredData: any[]
  setFilteredData: (data: any[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  refreshData: () => void
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined)

export function SiteDataProvider({ 
  children, 
  initialData 
}: { 
  children: React.ReactNode
  initialData: any[]
}) {
  const [data] = useState(initialData)
  const [filteredData, setFilteredData] = useState(initialData)
  const [isLoading, setIsLoading] = useState(false)

  const refreshData = () => {
    window.location.reload()
  }

  return (
    <SiteDataContext.Provider value={{ 
      data, 
      filteredData, 
      setFilteredData,
      isLoading,
      setIsLoading,
      refreshData
    }}>
      {children}
      {isLoading && <Loading />}
    </SiteDataContext.Provider>
  )
}

export function useSiteData() {
  const context = useContext(SiteDataContext)
  if (!context) {
    throw new Error('useSiteData must be used within SiteDataProvider')
  }
  return context
} 