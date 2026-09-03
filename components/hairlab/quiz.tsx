'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useMemo } from 'react'
import { questions } from '@/lib/questions'
import type { Answers } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

const issueImages: Record<string, string> = {
  // One neutral scalp-to-strand crop avoids gendered silhouettes or bodies.
  straight: '/hair-issues/neutral-hair.png',
  wavy: '/hair-issues/neutral-hair.png',
  curly: '/hair-issues/neutral-hair.png',
  coily: '/hair-issues/neutral-hair.png',
  fine: '/hair-issues/neutral-hair.png',
  medium: '/hair-issues/neutral-hair.png',
  thick: '/hair-issues/neutral-hair.png',
  low: '/hair-issues/neutral-hair.png',
  high: '/hair-issues/neutral-hair.png',
  dry: '/hair-issues/neutral-hair.png',
  balanced: '/hair-issues/neutral-hair.png',
  oily: '/hair-issues/neutral-hair.png',
  veryOily: '/hair-issues/neutral-hair.png',
  never: '/hair-issues/neutral-hair.png',
  occasionally: '/hair-issues/neutral-hair.png',
  frequently: '/hair-issues/neutral-hair.png',
  almostAlways: '/hair-issues/neutral-hair.png',
  minimal: '/hair-issues/neutral-hair.png',
  mild: '/hair-issues/neutral-hair.png',
  moderate: '/hair-issues/neutral-hair.png',
  significant: '/hair-issues/neutral-hair.png',
  notAtAll: '/hair-issues/neutral-hair.png',
  slightly: '/hair-issues/neutral-hair.png',
  moderately: '/hair-issues/neutral-hair.png',
  significantly: '/hair-issues/neutral-hair.png',
  veryLittle: '/hair-issues/neutral-hair.png',
  sometimes: '/hair-issues/neutral-hair.png',
  often: '/hair-issues/neutral-hair.png',
  daily: '/hair-issues/neutral-hair.png',
  soft: '/hair-issues/neutral-hair.png',
  slightlyDry: '/hair-issues/neutral-hair.png',
  quiteDry: '/hair-issues/neutral-hair.png',
  extremelyDry: '/hair-issues/neutral-hair.png',
  healthy: '/hair-issues/neutral-hair.png',
  slight: '/hair-issues/neutral-hair.png',
  noticeable: '/hair-issues/neutral-hair.png',
  severe: '/hair-issues/neutral-hair.png',
  rarely: '/hair-issues/neutral-hair.png',
  breakage: '/hair-issues/neutral-hair.png',
  hairFall: '/hair-issues/neutral-hair.png',
  dandruff: '/hair-issues/neutral-hair.png',
  dryness: '/hair-issues/neutral-hair.png',
  frizz: '/hair-issues/neutral-hair.png',
  damage: '/hair-issues/neutral-hair.png',
  thinning: '/hair-issues/neutral-hair.png',
  dullness: '/hair-issues/neutral-hair.png',
  greying: '/hair-issues/neutral-hair.png',
  oilyScalp: '/hair-issues/neutral-hair.png',
  dryScalp: '/hair-issues/neutral-hair.png',
  weakness: '/hair-issues/neutral-hair.png',
}

interface QuizProps {
  answers: Answers
  index: number
  onAnswer: (id: string, value: string | string[]) => void
  onNext: () => void
  onBack: () => void
}

export function Quiz({ answers, index, onAnswer, onNext, onBack }: QuizProps) {
  const question = questions[index]
  const total = questions.length
  const current = answers[question.id]

  const answered = useMemo(() => {
    if (question.type === 'multi') {
      return Array.isArray(current) && current.length > 0
    }
    if (question.id === 'chemical' && current === 'other') return false
    if (question.id === 'chemical' && typeof current === 'string' && current.startsWith('other:')) {
      return current.slice('other:'.length).trim().length > 0
    }
    return typeof current === 'string' && current.length > 0
  }, [current, question.id, question.type])

  function toggleMulti(value: string) {
    const selected = Array.isArray(current) ? [...current] : []
    const at = selected.indexOf(value)
    if (at >= 0) {
      selected.splice(at, 1)
    } else {
      if (question.maxSelect && selected.length >= question.maxSelect) return
      selected.push(value)
    }
    onAnswer(question.id, selected)
  }

  function selectSingle(value: string) {
    onAnswer(question.id, value)
  }

  const progress = ((index + (answered ? 1 : 0)) / total) * 100
  // Keep the final six questions focused on lifestyle and goals without imagery.
  const showOptionImages = index < 10

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
      </header>

      {/* progress */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-foreground">
            Question {index + 1}{' '}
            <span className="text-muted-foreground">of {total}</span>
          </span>
          <span className="tabular-nums text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* question */}
      <main key={question.id} className="hl-fade-up flex flex-1 flex-col pt-8">
        <div className="mb-5 flex items-center justify-center">
          <span className="rounded-full bg-secondary px-4 py-1.5 text-sm font-bold tracking-wide text-primary">
            {question.section}
          </span>
        </div>
        <h1 className="text-balance font-serif text-2xl leading-tight tracking-tight text-foreground sm:text-3xl">
          {question.title}
        </h1>
        {question.helper && (
          <p className="mt-2 text-sm text-muted-foreground">{question.helper}</p>
        )}

        <div
          className={cn(
            'mt-6 grid gap-3',
            question.options.length > 5 ? 'sm:grid-cols-2' : 'grid-cols-1',
          )}
        >
          {question.options.map((opt) => {
            const isSelected =
              question.type === 'multi'
                ? Array.isArray(current) && current.includes(opt.value)
                : current === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  question.type === 'multi'
                    ? toggleMulti(opt.value)
                    : selectSingle(opt.value)
                }
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left text-base transition-all outline-none focus-visible:ring-3 focus-visible:ring-ring/40',
                  isSelected
                    ? 'border-primary bg-accent text-foreground'
                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary',
                )}
              >
                {showOptionImages && issueImages[opt.value] && (
                  <Image
                    src={issueImages[opt.value]}
                    alt=""
                    width={52}
                    height={52}
                    className={cn(
                      'order-first size-12 shrink-0 rounded-full object-cover transition-transform duration-300',
                      isSelected && 'scale-110 ring-2 ring-primary ring-offset-2 ring-offset-card',
                    )}
                  />
                )}
                <span className="flex-1 font-medium">{opt.label}</span>
                <span
                  className={cn(
                    'flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                    isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border',
                  )}
                >
                  {isSelected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>

        {question.id === 'chemical' && current === 'other' ||
          question.id === 'chemical' && typeof current === 'string' && current.startsWith('other:') ? (
          <div className="mt-4">
            <label htmlFor="specific-treatment" className="sr-only">
              Specific hair treatment
            </label>
            <input
              id="specific-treatment"
              type="text"
              value={typeof current === 'string' && current.startsWith('other:') ? current.slice('other:'.length) : ''}
              onChange={(event) => onAnswer(question.id, `other:${event.target.value}`)}
              placeholder="Write the specific treatment"
              autoFocus
              className="h-12 w-full rounded-xl border border-primary/50 bg-card px-4 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/40"
            />
          </div>
        ) : null}
      </main>

      {/* nav */}
      <footer className="sticky bottom-0 mt-6 flex items-center gap-3 bg-gradient-to-t from-background via-background to-transparent pb-1 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-12 items-center gap-1.5 rounded-full border border-border bg-card px-5 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!answered}
          className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 text-base font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40"
        >
          {index === total - 1 ? 'See my results' : 'Continue'}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </footer>
    </div>
  )
}
