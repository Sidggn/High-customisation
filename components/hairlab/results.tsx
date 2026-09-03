'use client'

import { Download, RotateCcw, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import type { Product, Recommendation } from '@/lib/types'
import { ProductBottle } from './product-bottle'
import { Wordmark } from './wordmark'

const shapeFor: Record<Product['kind'], 'tall' | 'pump' | 'dropper'> = {
  shampoo: 'pump',
  serum: 'dropper',
  cream: 'tall',
}

const typeLabel: Record<Product['kind'], string> = {
  shampoo: 'CUSTOM SHAMPOO',
  serum: 'CUSTOM SERUM',
  cream: 'CUSTOM HAIR CREAM',
}

export function Results({
  rec,
  onRestart,
}: {
  rec: Recommendation
  onRestart: () => void
}) {
  const routineRef = useRef<HTMLDivElement>(null)
  const products: Product[] = [rec.shampoo, rec.serum, rec.cream]

  const summaryRows = [
    ['Texture', rec.profileSummary.texture],
    ['Thickness', rec.profileSummary.thickness],
    ['Scalp', rec.profileSummary.scalp],
    ['Condition', rec.profileSummary.condition],
    ['Primary concern', rec.profileSummary.primaryConcern],
    ['Secondary concern', rec.profileSummary.secondaryConcern],
  ]

  function saveProfile() {
    const lines = [
      `HAIRLAB — ${rec.name}'s Hair Profile`,
      '',
      ...summaryRows.map(([k, v]) => `${k}: ${v}`),
      '',
      'Your custom routine:',
      `1. ${rec.shampoo.name}`,
      `2. ${rec.serum.name}`,
      `3. ${rec.cream.name}`,
      '',
      'Why this routine:',
      ...rec.rationale.map((r) => `- ${r}`),
    ].join('\n')
    const blob = new Blob([lines], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hairlab-${rec.name.toLowerCase()}-profile.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <RotateCcw className="size-4" /> Retake
        </button>
      </header>

      {/* Hero */}
      <section className="hl-fade-up mt-8 text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-medium tracking-wide text-accent-foreground">
          <Sparkles className="size-3.5" /> Your personalized hair profile is ready
        </p>
        <h1 className="mt-4 text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          {rec.name}, here&apos;s your custom ritual.
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-pretty leading-relaxed text-muted-foreground">
          Based on your answers, your profile points to{' '}
          <span className="font-medium text-foreground">
            {rec.primaryConcern.toLowerCase()}
          </span>{' '}
          and{' '}
          <span className="font-medium text-foreground">
            {rec.secondaryConcern.toLowerCase()}
          </span>
          . Here&apos;s the routine we built around it.
        </p>
        <button
          type="button"
          onClick={() =>
            routineRef.current?.scrollIntoView({ behavior: 'smooth' })
          }
          className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          View my custom routine
        </button>
      </section>

      {/* Profile summary */}
      <section className="hl-fade-up mt-10 rounded-3xl border border-border bg-card p-6">
        <h2 className="text-xs tracking-[0.18em] text-muted-foreground">
          YOUR HAIR PROFILE
        </h2>
        <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {summaryRows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="mt-0.5 font-serif text-lg text-foreground">
                {value}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Product cards */}
      <section ref={routineRef} className="mt-12 scroll-mt-6">
        <div className="mb-5 flex items-baseline justify-between">
          <h2 className="font-serif text-2xl tracking-tight text-foreground">
            Your personalized routine
          </h2>
          <span className="text-xs tracking-[0.18em] text-muted-foreground">
            3 STEPS
          </span>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {products.map((p, i) => (
            <article
              key={p.id}
              className="hl-fade-up flex flex-col rounded-3xl border border-border bg-card p-5"
              style={{ animationDelay: `${i * 90}ms` }}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="font-serif text-2xl text-primary">
                  0{i + 1}
                </span>
                <span className="text-[0.65rem] font-medium tracking-[0.16em] text-muted-foreground">
                  {typeLabel[p.kind]}
                </span>
              </div>

              <ProductBottle
                accent={p.accent}
                ownerName={rec.name}
                typeLabel={typeLabel[p.kind]}
                shape={shapeFor[p.kind]}
              />

              <h3 className="mt-4 text-balance font-serif text-xl leading-snug tracking-tight text-foreground">
                {rec.name}&apos;s {p.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {p.descriptor}
              </p>

              <div className="mt-4 rounded-xl bg-accent/60 px-3 py-2.5">
                <p className="text-[0.7rem] font-medium tracking-wide text-accent-foreground">
                  KEY BENEFIT
                </p>
                <p className="mt-0.5 text-sm font-medium text-foreground">
                  {p.keyBenefit}
                </p>
              </div>

              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">
                    What it does
                  </dt>
                  <dd className="mt-0.5 leading-relaxed text-foreground">
                    {p.purpose}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">
                    Why it matches you
                  </dt>
                  <dd className="mt-0.5 leading-relaxed text-foreground">
                    {p.why}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">How to use</dt>
                  <dd className="mt-0.5 leading-relaxed text-foreground">
                    {p.usage}
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* Why this routine */}
      <section className="hl-fade-up mt-12 rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-serif text-2xl tracking-tight text-foreground">
          Why this routine?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Every choice traces back to something you told us.
        </p>
        <ul className="mt-5 space-y-3">
          {rec.rationale.map((line, i) => (
            <li key={i} className="flex gap-3">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span className="leading-relaxed text-foreground">{line}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Daily routine */}
      <section className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="text-xs tracking-[0.18em] text-muted-foreground">
            WASH DAY
          </h3>
          <ol className="mt-4 space-y-3">
            {rec.routine.washDay.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h3 className="text-xs tracking-[0.18em] text-muted-foreground">
            NON-WASH DAY / NIGHT
          </h3>
          <ol className="mt-4 space-y-3">
            {rec.routine.offDay.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="leading-relaxed text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:col-span-2">
          {rec.routine.note}
        </p>
      </section>

      {/* Ownership moment */}
      <section className="hl-scale-in mt-12 overflow-hidden rounded-3xl border border-primary/20 bg-primary p-8 text-center text-primary-foreground">
        <p className="text-xs tracking-[0.22em] text-primary-foreground/70">
          YOUR HAIRCARE FORMULA
        </p>
        <h2 className="mt-3 text-balance font-serif text-3xl leading-tight tracking-tight">
          Created specifically for {rec.name}&apos;s hair profile.
        </h2>
        <div className="mx-auto mt-8 grid max-w-md grid-cols-3 gap-3">
          {products.map((p) => (
            <div key={p.id} className="flex flex-col items-center gap-2">
              <div className="w-full rounded-2xl bg-primary-foreground/10 p-2">
                <ProductBottle
                  accent={p.accent}
                  ownerName={rec.name}
                  typeLabel={typeLabel[p.kind]}
                  shape={shapeFor[p.kind]}
                  className="h-40"
                />
              </div>
              <span className="text-[0.65rem] font-medium tracking-wide text-primary-foreground/80">
                {typeLabel[p.kind].replace('CUSTOM ', '')}
              </span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-sm text-sm leading-relaxed text-primary-foreground/70">
          Your combination of hair characteristics shaped all three formulas — no
          two profiles produce the same ritual.
        </p>
      </section>

      {/* Final CTAs */}
      <section className="mt-8 flex flex-col gap-3 pb-10 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={saveProfile}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-card px-6 text-base font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <Download className="size-4" /> Save my hair profile
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          <RotateCcw className="size-4" /> Retake quiz
        </button>
      </section>
    </div>
  )
}
