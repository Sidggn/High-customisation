'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

const steps = [
  'Reading your hair profile',
  'Weighing scalp and lifestyle signals',
  'Matching your custom formulas',
  'Finalizing your routine',
]

export function Analyzing({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActive(i + 1), 550 * (i + 1)),
    )
    const done = setTimeout(onDone, 2600)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onDone])

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col items-center justify-center px-5 py-6 text-center">
      <Wordmark className="hl-fade-in" />

      <div className="relative mt-12 flex size-24 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20 [animation-duration:1.6s]" />
        <span className="absolute inset-2 rounded-full bg-accent" />
        <span className="absolute inset-0 rounded-full border-2 border-primary/30 border-t-primary animate-spin [animation-duration:1s]" />
        <span className="size-3 rounded-full bg-primary" />
      </div>

      <h1 className="mt-10 text-balance font-serif text-2xl tracking-tight text-foreground">
        Analyzing your hair profile…
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Combining every answer into one coherent routine.
      </p>

      <ul className="mt-8 w-full space-y-3 text-left">
        {steps.map((step, i) => {
          const complete = active > i
          const running = active === i
          return (
            <li
              key={step}
              className={cn(
                'flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all',
                complete || running
                  ? 'border-primary/30 bg-card text-foreground'
                  : 'border-border bg-transparent text-muted-foreground',
              )}
            >
              <span
                className={cn(
                  'flex size-5 items-center justify-center rounded-full border text-[0.6rem]',
                  complete
                    ? 'border-primary bg-primary text-primary-foreground'
                    : running
                      ? 'border-primary text-primary'
                      : 'border-border',
                )}
              >
                {complete ? '✓' : i + 1}
              </span>
              {step}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
