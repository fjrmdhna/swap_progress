"use client"

import { Search as SearchIcon } from 'lucide-react'

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function Search({ value, onChange }: SearchProps) {
  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-300 pl-9 pr-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder="Cari di semua kolom..."
      />
    </div>
  )
} 