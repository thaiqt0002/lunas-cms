'use client'
import { useCallback, useEffect, useState } from 'react'

import { IFile } from '@core/types/base'

const useUploadImage = () => {
  const [files, setFiles] = useState<IFile[] | null>(null)

  const handleFile = useCallback(
    (blob: Blob) => {
      const file = new File([blob], `${name}.webp`, { type: 'image/webp' })
      const preview = URL.createObjectURL(blob)
      setFiles((prevFiles) => [...(prevFiles || []), { file, preview }])
    },
    [setFiles],
  )
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      if (!e.clipboardData) return
      const items = e.clipboardData.items
      for (const item of items) {
        if (item.kind === 'file') {
          const blob = item.getAsFile()
          if (!blob) return
          const src = URL.createObjectURL(blob)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          if (!ctx) return
          const img = new Image()
          img.src = src
          img.onload = () => {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            ctx.drawImage(img, 0, 0)
            canvas.toBlob((blob) => {
              if (!blob) return
              handleFile(blob)
            }, 'image/webp')
          }
        }
      }
    },
    [handleFile],
  )
  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [setFiles, files, handlePaste])
  return { files, setFiles }
}
export { useUploadImage }
