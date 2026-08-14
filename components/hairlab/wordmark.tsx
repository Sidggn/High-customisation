import { cn } from '@/lib/utils'

export function Wordmark({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="flex size-7 items-center justify-center rounded-full bg-primary"
      >
        <span className="size-2.5 rounded-full bg-primary-foreground" />
      </span>
      <span className="font-serif text-xl tracking-tight text-foreground">
        HAIR<span className="text-primary">LAB</span>
      </span>
    </div>
  )
}
