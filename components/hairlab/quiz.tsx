'use client'

import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useMemo } from 'react'
import { questions } from '@/lib/questions'
import type { Answers } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Wordmark } from './wordmark'

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
    return typeof current === 'string' && current.length > 0
  }, [current, question.type])

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

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <span className="text-xs tabular-nums tracking-wide text-muted-foreground">
          {question.section}
        </span>
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
                <span className="font-medium">{opt.label}</span>
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
