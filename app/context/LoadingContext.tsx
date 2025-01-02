"use client"

import { createContext, useContext, useState } from 'react'
import { Loading } from '@/app/components/UI/Loading'

type LoadingContextType = {
  setLoading: (loading: boolean) => void
  loading: boolean
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false)

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      {loading && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm">
          <Loading />
        </div>
      )}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
} 