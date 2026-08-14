import { cn } from '@/lib/utils'

interface ProductBottleProps {
  accent: string
  ownerName: string
  typeLabel: string // e.g. "SHAMPOO"
  className?: string
  /** slightly different silhouettes per product for variety */
  shape?: 'tall' | 'pump' | 'dropper'
}

export function ProductBottle({
  accent,
  ownerName,
  typeLabel,
  className,
  shape = 'tall',
}: ProductBottleProps) {
  return (
    <div
      className={cn(
        'relative flex h-56 w-full items-end justify-center overflow-hidden rounded-2xl',
        className,
      )}
      style={{
        background: `radial-gradient(120% 90% at 50% 0%, ${accent}1f 0%, transparent 60%)`,
      }}
      aria-hidden
    >
      {/* cap / pump */}
      <div className="relative flex flex-col items-center">
        {shape === 'dropper' ? (
          <>
            <div
              className="h-6 w-4 rounded-t-sm"
              style={{ backgroundColor: accent }}
            />
            <div className="h-2 w-9 rounded-sm bg-foreground/80" />
          </>
        ) : shape === 'pump' ? (
          <>
            <div className="ml-6 h-5 w-8 rounded-full bg-foreground/80" />
            <div className="h-4 w-3 bg-foreground/70" />
            <div className="h-2 w-11 rounded-t-md bg-foreground/80" />
          </>
        ) : (
          <div className="h-5 w-14 rounded-t-md bg-foreground/85" />
        )}

        {/* bottle body */}
        <div
          className="relative flex h-40 w-24 flex-col items-center justify-end rounded-[1.1rem] rounded-t-md pb-3 shadow-sm"
          style={{
            background: `linear-gradient(160deg, ${accent} 0%, ${accent}cc 100%)`,
          }}
        >
          {/* label */}
          <div className="w-[84%] rounded-md bg-background/95 px-1.5 py-2 text-center shadow-sm">
            <p className="font-serif text-[0.6rem] leading-tight tracking-tight text-foreground">
              {ownerName.toUpperCase()}&apos;S
            </p>
            <div className="mx-auto my-1 h-px w-6 bg-border" />
            <p className="text-[0.5rem] font-medium leading-tight tracking-[0.14em] text-muted-foreground">
              {typeLabel}
            </p>
            <p className="mt-1 text-[0.45rem] tracking-[0.2em] text-primary">
              HAIRLAB
            </p>
          </div>
          {/* highlight */}
          <div className="pointer-events-none absolute left-2 top-2 h-16 w-3 rounded-full bg-background/25 blur-[1px]" />
        </div>
      </div>
    </div>
  )
}
