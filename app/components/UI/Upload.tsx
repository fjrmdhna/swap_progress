"use client"

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload as UploadIcon } from 'lucide-react'
import { useSiteData } from '@/app/context/SiteDataContext'

interface ValidationError {
  error: string;
  details?: string[];
}

interface UploadProps {
  onUploadSuccess: () => void;
}

export function Upload() {
  const { refreshData, setIsLoading } = useSiteData()
  const [isUploading, setIsUploading] = useState(false)
  const [errors, setErrors] = useState<ValidationError | null>(null)

  const handleUploadSuccess = () => {
    refreshData()
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsLoading(true)
    try {
      const file = acceptedFiles[0]
      if (!file) return

      setIsUploading(true)
      setErrors(null)

      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw {
          error: data.error,
          details: data.details || [data.error]
        }
      }

      console.log('Upload success:', data.message)
      handleUploadSuccess()

    } catch (err) {
      console.error('Upload error:', err)
      setErrors(err as ValidationError)
    } finally {
      setIsUploading(false)
      setIsLoading(false)
    }
  }, [handleUploadSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/csv': ['.csv']
    },
    maxFiles: 1
  })

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        
        {isUploading ? (
          <p className="text-sm text-gray-600">Mengunggah file...</p>
        ) : (
          <div>
            <p className="text-sm text-gray-600">
              {isDragActive
                ? 'Lepaskan file di sini'
                : 'Tarik dan lepaskan file Excel atau CSV di sini, atau klik untuk memilih file'}
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Format yang didukung: .xlsx, .csv
            </p>
          </div>
        )}
        
        {errors && (
          <div className="mt-4 p-4 bg-red-50 rounded-lg">
            <p className="text-sm font-medium text-red-800">
              {errors.error}
            </p>
            {errors.details && (
              <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
                {errors.details.map((detail, index) => (
                  <li key={index}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 