import { cn } from '@/shared/utils/cn'

interface BarcodePreviewProps {
  barcode: string
  className?: string
}

export function BarcodePreview({ barcode, className }: BarcodePreviewProps) {
  return (
    <div
      className={cn(
        'inline-flex flex-col items-center gap-2 px-6 py-4 bg-white border-2 border-neutral-300 rounded-xl',
        className,
      )}
      id="barcode-print-area"
    >
      {/* Visual barcode representation — CSS stripes */}
      <div className="flex items-end gap-px h-12" aria-hidden>
        {barcode.split('').map((char, i) => {
          const height = (char.charCodeAt(0) % 4) + 1
          const wide = i % 3 === 0
          return (
            <div
              key={i}
              className="bg-neutral-900"
              style={{
                width: wide ? 3 : 2,
                height: `${25 + height * 8}px`,
              }}
            />
          )
        })}
      </div>
      <span className="font-mono text-sm font-bold tracking-widest text-neutral-800">
        {barcode}
      </span>
    </div>
  )
}
