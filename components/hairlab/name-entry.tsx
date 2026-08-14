'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { Wordmark } from './wordmark'

interface NameEntryProps {
  initialName: string
  onBack: () => void
  onContinue: (name: string) => void
}

export function NameEntry({ initialName, onBack, onContinue }: NameEntryProps) {
  const [name, setName] = useState(initialName)

  function submit() {
    onContinue(name.trim())
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6">
      <header className="flex items-center justify-between">
        <Wordmark />
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back
        </button>
      </header>

      <main className="hl-fade-up flex flex-1 flex-col justify-center">
        <p className="text-xs tracking-[0.18em] text-primary">
          LET&apos;S PERSONALIZE THIS
        </p>
        <h1 className="mt-3 text-balance font-serif text-3xl leading-tight tracking-tight text-foreground sm:text-4xl">
          What should we call your personalized routine?
        </h1>
        <p className="mt-3 leading-relaxed text-muted-foreground">
          We&apos;ll use your first name on your custom formula. You can leave this
          blank if you&apos;d prefer.
        </p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault()
            submit()
          }}
        >
          <label
            htmlFor="firstName"
            className="mb-2 block text-sm font-medium text-foreground"
          >
            Your first name
          </label>
          <input
            id="firstName"
            type="text"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Alex"
            maxLength={24}
            className="h-13 w-full rounded-2xl border border-border bg-card px-4 text-lg text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30"
          />

          <button
            type="submit"
            className="group mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 text-base font-medium text-primary-foreground transition-all hover:opacity-90 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            Create my hair profile
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      </main>
    </div>
  )
}
