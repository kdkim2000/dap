import React, { useState, useRef } from 'react'

interface Props {
  practiceId: string
  initialImageUrl?: string | null
  onSave?: (dataUrl: string | null) => void
}

const MAX_PX = 1920
const MAX_BYTES = 2 * 1024 * 1024        // 2MB
const BASE64_OVERHEAD = 1.37             // base64 인코딩 시 원본 대비 약 37% 크기 증가

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_PX / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas 2D context를 생성할 수 없습니다.')); return }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let quality = 0.9
      let dataUrl = canvas.toDataURL('image/jpeg', quality)
      while (dataUrl.length > MAX_BYTES * BASE64_OVERHEAD && quality > 0.3) {
        quality -= 0.1
        dataUrl = canvas.toDataURL('image/jpeg', quality)
      }
      resolve(dataUrl)
    }
    img.onerror = (err) => { URL.revokeObjectURL(url); reject(err) }
    img.src = url
  })
}

export default function ModelImageUpload({ practiceId, initialImageUrl, onSave }: Props) {
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl ?? null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const dataUrl = await resizeImage(file)
      setImageUrl(dataUrl)
      onSave?.(dataUrl)
    } catch {
      setError('이미지 처리 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleRemove = () => {
    setImageUrl(null)
    onSave?.(null)
  }

  return (
    <div className="space-y-3">
      <div className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
        모델 이미지 업로드
      </div>

      {imageUrl ? (
        <div className="space-y-2">
          <div className="relative rounded-lg overflow-hidden border border-[var(--q-border)]">
            {/* base64 dataUrl은 next/image가 지원하지 않으므로 <img> 직접 사용 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="업로드된 논리 데이터 모델 이미지" className="w-full object-contain max-h-[400px]" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex-1 py-2 text-sm border border-[var(--q-border)] rounded-lg hover:bg-surface-soft transition-colors text-ink"
            >
              이미지 교체
            </button>
            <button
              onClick={handleRemove}
              className="px-4 py-2 text-sm border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              삭제
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="w-full py-12 border-2 border-dashed border-[var(--q-border)] rounded-xl text-ink-muted hover:border-primary-300 hover:text-primary-600 transition-colors flex flex-col items-center gap-2"
        >
          <span className="text-3xl">{loading ? '⏳' : '📷'}</span>
          <span className="text-sm font-medium">
            {loading ? '처리 중...' : '이미지 선택'}
          </span>
          <span className="text-xs">손으로 그린 논리 모델 사진 또는 스캔본</span>
          <span className="text-xs text-ink-faint">JPEG · PNG · WebP · 최대 1920px · 2MB 이하로 자동 압축</span>
        </button>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      <p className="text-xs text-ink-faint">
        이미지는 브라우저에만 저장되며 서버로 전송되지 않습니다.
      </p>
    </div>
  )
}
