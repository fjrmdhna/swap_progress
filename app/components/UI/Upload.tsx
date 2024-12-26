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
    <div className="w-full max-w-xl mx-auto p-2">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}
        `}
      >
        <input {...getInputProps()} />
        <UploadIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        
        {isUploading ? (
          <p className="text-xs text-gray-600">Uploading file...</p>
        ) : (
          <div>
            <p className="text-xs text-gray-600">
              {isDragActive
                ? 'Drop file here'
                : 'Drag and drop Excel or CSV file here, or click to select file'}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Supported formats: .xlsx, .csv
            </p>
          </div>
        )}
        
        {errors && (
          <div className="mt-2 p-2 bg-red-50 rounded-lg">
            <p className="text-xs font-medium text-red-800">
              {errors.error}
            </p>
            {errors.details && (
              <ul className="mt-1 text-xs text-red-700 list-disc list-inside">
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