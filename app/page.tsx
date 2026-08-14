'use client'

import { useCallback, useMemo, useState } from 'react'
import { Analyzing } from '@/components/hairlab/analyzing'
import { Landing } from '@/components/hairlab/landing'
import { NameEntry } from '@/components/hairlab/name-entry'
import { Quiz } from '@/components/hairlab/quiz'
import { Results } from '@/components/hairlab/results'
import { questions } from '@/lib/questions'
import { generateRecommendation } from '@/lib/recommendation-engine'
import type { Answers } from '@/lib/types'

type Stage = 'landing' | 'name' | 'quiz' | 'analyzing' | 'results'

export default function Page() {
  const [stage, setStage] = useState<Stage>('landing')
  const [name, setName] = useState('')
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)

  const recommendation = useMemo(() => {
    if (stage !== 'results') return null
    return generateRecommendation(answers, name)
  }, [stage, answers, name])

  const handleAnswer = useCallback(
    (id: string, value: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [id]: value }))
    },
    [],
  )

  const handleNext = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1)
      if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
    } else {
      setStage('analyzing')
    }
  }, [index])

  const handleBack = useCallback(() => {
    if (index === 0) {
      setStage('name')
    } else {
      setIndex((i) => i - 1)
    }
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [index])

  const restart = useCallback(() => {
    setAnswers({})
    setIndex(0)
    setName('')
    setStage('landing')
    if (typeof window !== 'undefined') window.scrollTo({ top: 0 })
  }, [])

  switch (stage) {
    case 'landing':
      return <Landing onStart={() => setStage('name')} />
    case 'name':
      return (
        <NameEntry
          initialName={name}
          onBack={() => setStage('landing')}
          onContinue={(n) => {
            setName(n)
            setIndex(0)
            setStage('quiz')
          }}
        />
      )
    case 'quiz':
      return (
        <Quiz
          answers={answers}
          index={index}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onBack={handleBack}
        />
      )
    case 'analyzing':
      return <Analyzing onDone={() => setStage('results')} />
    case 'results':
      return recommendation ? (
        <Results rec={recommendation} onRestart={restart} />
      ) : null
  }
}
