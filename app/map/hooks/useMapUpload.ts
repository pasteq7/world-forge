import { useCallback } from 'react'

export function useMapUpload(onUpload: (base64: string) => void) {
  const handleUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      onUpload(base64String)
    }
    reader.readAsDataURL(file)
  }, [onUpload])

  return {
    handleUpload
  }
} 