'use client'

import { useCallback, useRef, useState } from 'react'
import { Upload, X, Star, GripVertical, ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface UploadedImage {
  id: string
  file: File
  preview: string // object URL for preview
}

interface ImageUploaderProps {
  images: UploadedImage[]
  onChange: (images: UploadedImage[]) => void
  max?: number
}

export function ImageUploader({ images, onChange, max = 20 }: ImageUploaderProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter((f) => f.type.startsWith('image/'))
    const remaining = max - images.length
    const toAdd = newFiles.slice(0, remaining)
    const newImages: UploadedImage[] = toAdd.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
    }))
    onChange([...images, ...newImages])
  }, [images, max, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [addFiles])

  const removeImage = (id: string) => {
    const img = images.find((i) => i.id === id)
    if (img) URL.revokeObjectURL(img.preview)
    onChange(images.filter((i) => i.id !== id))
  }

  const setAsCover = (id: string) => {
    const img = images.find((i) => i.id === id)
    if (!img) return
    const rest = images.filter((i) => i.id !== id)
    onChange([img, ...rest])
  }

  const moveImage = (id: string, dir: 'left' | 'right') => {
    const idx = images.findIndex((i) => i.id === id)
    if (idx < 0) return
    const target = dir === 'left' ? idx - 1 : idx + 1
    if (target < 0 || target >= images.length) return
    const newImages = [...images]
    ;[newImages[idx], newImages[target]] = [newImages[target], newImages[idx]]
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'border-2 border-dashed p-8 text-center cursor-pointer transition-colors',
          dragging ? 'border-brand bg-brand/5' : 'border-edge hover:border-foreground/30 hover:bg-muted/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5 text-muted-foreground" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-medium">
            {images.length === 0 ? 'Upload vehicle photos' : `Add more photos (${images.length}/${max})`}
          </p>
          <p className="text-xs text-muted-foreground font-light">
            Drag & drop or click to browse · JPG, PNG, WebP · max {max} photos
          </p>
        </div>
      </div>

      {/* Preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                'relative group aspect-square border overflow-hidden bg-muted',
                i === 0 ? 'border-brand border-2' : 'border-edge',
              )}
            >
              <img src={img.preview} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />

              {/* Cover badge */}
              {i === 0 && (
                <div className="absolute top-1 left-1 bg-brand text-brand-foreground text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 flex items-center gap-0.5">
                  <Star className="w-2.5 h-2.5 fill-current" /> Cover
                </div>
              )}

              {/* Remove */}
              <button
                onClick={(e) => { e.stopPropagation(); removeImage(img.id) }}
                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-red-500 hover:text-white transition opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" strokeWidth={2} />
              </button>

              {/* Reorder controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition">
                <button
                  onClick={(e) => { e.stopPropagation(); moveImage(img.id, 'left') }}
                  disabled={i === 0}
                  className="text-white text-xs px-1.5 py-0.5 disabled:opacity-30"
                >
                  ←
                </button>
                <span className="text-white text-[10px] font-medium">{i + 1}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); moveImage(img.id, 'right') }}
                  disabled={i === images.length - 1}
                  className="text-white text-xs px-1.5 py-0.5 disabled:opacity-30"
                >
                  →
                </button>
              </div>

              {/* Set as cover */}
              {i !== 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setAsCover(img.id) }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
                >
                  <span className="text-white text-[10px] font-medium flex items-center gap-1 bg-brand px-2 py-1">
                    <Star className="w-3 h-3 fill-current" /> Set cover
                  </span>
                </button>
              )}
            </div>
          ))}

          {/* Add more tile */}
          {images.length < max && (
            <button
              onClick={() => inputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-edge hover:border-brand hover:bg-brand/5 transition flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-brand"
            >
              <ImageIcon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px]">Add</span>
            </button>
          )}
        </div>
      )}

      {/* Helper text */}
      {images.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-brand" /> First photo is the cover
          </span>
          <span>Hover a photo to reorder or remove</span>
          <span className="ml-auto font-medium">{images.length} photo{images.length !== 1 ? 's' : ''} selected</span>
        </div>
      )}
    </div>
  )
}
