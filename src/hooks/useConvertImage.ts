import { useCallback } from 'react'

const useConvertImage = () => {
  const handleConvertImage = useCallback((file: File) => {
    let convertedImage: File
    const image = new Image()
    image.src = URL.createObjectURL(file)
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      ctx?.drawImage(image, 0, 0)
      canvas.toBlob((blob) => {
        if (!blob) return
        convertedImage = new File([blob], 'image.webp', {
          type: 'image/webp',
          lastModified: Date.now(),
        })
      }, 'image/webp')
    }
  }, [])
  return { handleConvertImage }
}
export default useConvertImage
