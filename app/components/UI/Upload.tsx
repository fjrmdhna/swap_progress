"use client"

import { useState } from 'react'
import { Upload as UploadIcon } from 'lucide-react'

export function Upload() {
  const [isDragging, setIsDragging] = useState(false)
  
  return (
    <div
      className={`
        border-2 border-dashed rounded-xl p-8
        flex flex-col items-center justify-center
        transition-colors duration-200
        ${isDragging 
          ? 'border-[#F2059F] bg-[#F2059F]/5' 
          : 'border-white/20 hover:border-[#F2059F]/50'
        }
      `}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => setIsDragging(false)}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".xlsx,.xls,.csv"
      />
      
      <label 
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <UploadIcon 
          size={40} 
          className={`mb-4 transition-colors duration-200 
            ${isDragging ? 'text-[#F2059F]' : 'text-white/70'}
          `}
        />
        <p className="text-white/90 text-center mb-2">
          Drag and drop Excel or CSV file here
        </p>
        <p className="text-white/60 text-sm">
          or click to select file
        </p>
      </label>
    </div>
  )
} 