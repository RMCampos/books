import { useState } from 'react'
import { ZoomInIcon } from 'lucide-react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { isGoogleBooksCoverUrl, toHighResCoverUrl } from '#/lib/coverUrl.ts'

interface Props {
  src: string | null | undefined
  alt: string
  className?: string
  placeholderClassName?: string
}

export function CoverViewer({ src, alt, className, placeholderClassName }: Props) {
  const [loaded, setLoaded] = useState(false)

  if (!src) {
    return (
      <div
        className={
          placeholderClassName ??
          'flex h-24 w-16 shrink-0 items-center justify-center rounded bg-muted text-2xl text-muted-foreground/40'
        }
      >
        📚
      </div>
    )
  }

  const hiResSrc = isGoogleBooksCoverUrl(src) ? toHighResCoverUrl(src) : src

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button type="button" className="group relative shrink-0 cursor-zoom-in">
          <img
            src={src}
            alt={alt}
            className={className ?? 'h-24 w-16 rounded object-cover'}
          />
          <span className="absolute inset-0 flex items-center justify-center rounded bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
            <ZoomInIcon className="size-5 text-white drop-shadow" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent className="p-0">
        {!loaded && (
          <div className="flex h-64 w-48 items-center justify-center rounded-lg bg-muted text-muted-foreground text-sm">
            Loading…
          </div>
        )}
        <img
          src={hiResSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`max-h-[80vh] max-w-[80vw] rounded-lg object-contain ${loaded ? 'block' : 'hidden'}`}
        />
      </DialogContent>
    </Dialog>
  )
}
