import { useState, type ImgHTMLAttributes } from 'react'

/** Image that hides itself (no broken icon / alt text) if the URL is empty or fails to load. */
export default function SafeImg({ src, alt = '', className, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return <div className={`${className ?? ''} bg-navy/10`} aria-hidden />
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} {...rest} />
}
