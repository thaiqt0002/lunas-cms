import { useEffect, useState } from 'react'

export const useObserverWidth = (ref: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState<number | null>(null)
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      entries[0] && setWidth(entries[0].contentRect.width)
    })
    !!ref.current && observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return width
}
