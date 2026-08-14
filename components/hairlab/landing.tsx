'use client'

import { ArrowRight, Clock, Sparkles, ListChecks } from 'lucide-react'
import { ProductBottle } from './product-bottle'
import { Wordmark } from './wordmark'

const previewProducts = [
  { typeLabel: 'CUSTOM SHAMPOO', accent: '#5f8f8a', shape: 'pump' as const },
  { typeLabel: 'CUSTOM SERUM', accent: '#7c8f7b', shape: 'dropper' as const },
  { typeLabel: 'CUSTOM HAIR CREAM', accent: '#c9a25f', shape: 'tall' as const },
]

export function Landing({ onStart }: { onStart: () => void }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-5xl flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <span className="hidden text-xs tracking-[0.18em] text-muted-foreground sm:block">
          PERSONALIZED HAIRCARE
        </span>
      </header>

      <main className="flex flex-1 flex-col justify-center gap-10 py-10 md:grid md:grid-cols-2 md:items-center md:gap-8">
        <section className="hl-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium tracking-wide text-accent-foreground">
            <Sparkles className="size-3.5" />
            Your hair. Your profile. Your custom ritual.
          </span>

          <h1 className="mt-5 text-balance font-serif text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
            Discover your personalized haircare ritual.
          </h1>

          <p className="mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Answer a few questions about your hair, scalp and lifestyle. We&apos;ll
            create a routine designed around your unique hair profile.
          </p>

          <button
            type="button"
            onClick={onStart}
            className="group mt-7 inline-flex h-13 items-center gap-2 rounded-full bg-primary px-7 py-4 text-base font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Start my hair quiz
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>

          <ul className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-1.5">
              <ListChecks className="size-4 text-primary" /> 18 questions
            </li>
            <li className="flex items-center gap-1.5">
              <Clock className="size-4 text-primary" /> 2–3 minutes
            </li>
            <li className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-primary" /> Personalized results
            </li>
          </ul>
        </section>

        <section className="hl-fade-up rounded-3xl border border-border bg-card p-5 [animation-delay:120ms] sm:p-7">
          <p className="mb-4 text-center text-xs tracking-[0.18em] text-muted-foreground">
            YOUR THREE-STEP CUSTOM SOLUTION
          </p>
          <div className="grid grid-cols-3 gap-3">
            {previewProducts.map((p) => (
              <div key={p.typeLabel} className="flex flex-col items-center gap-2">
                <ProductBottle
                  accent={p.accent}
                  ownerName="Your"
                  typeLabel={p.typeLabel}
                  shape={p.shape}
                  className="h-44"
                />
                <span className="text-center text-[0.65rem] font-medium leading-tight tracking-wide text-foreground">
                  {p.typeLabel.replace('CUSTOM ', '')}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Shampoo, serum and hair cream — each selected to work together as one
            coherent routine.
          </p>
        </section>
      </main>

      <footer className="pt-4 text-center text-xs text-muted-foreground">
        A research prototype. Designed to support your routine — no medical claims.
      </footer>
    </div>
  )
}
