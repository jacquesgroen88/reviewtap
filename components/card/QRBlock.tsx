'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download } from 'lucide-react'

type Props = {
  url: string
  isDark: boolean
  accentColor: string
}

export default function QRBlock({ url, isDark, accentColor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !url) return
    QRCode.toCanvas(canvasRef.current, url, {
      width: 160,
      margin: 2,
      color: {
        dark: isDark ? '#ffffff' : '#111111',
        light: '#00000000',
      },
    }).then(() => {
      setDataUrl(canvasRef.current?.toDataURL('image/png') ?? null)
    })
  }, [url, isDark])

  function download() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'my-card-qr.png'
    a.click()
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <canvas ref={canvasRef} className="w-20 h-20" />
      {dataUrl && (
        <button
          onClick={download}
          className="flex items-center gap-1 text-xs opacity-40 hover:opacity-70 transition-opacity"
          style={{ color: isDark ? '#fff' : '#111' }}
        >
          <Download className="w-3 h-3" />
          Download QR
        </button>
      )}
    </div>
  )
}
