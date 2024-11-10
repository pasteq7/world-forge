'use client'

import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { MapUploadProps } from '@/types/map'
import { useMapUpload } from '../hooks/useMapUpload'

export function MapUpload({ onUpload }: MapUploadProps) {
  const { handleUpload } = useMapUpload(onUpload)

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <Button asChild>
        <label className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          Upload Map Image
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </Button>
    </div>
  )
} 