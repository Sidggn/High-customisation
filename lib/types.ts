// Shared types for the HAIRLAB personalization prototype.

export type QuestionType = 'single' | 'multi'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  /** key stored on the answers object */
  id: string
  section: string
  title: string
  helper?: string
  type: QuestionType
  options: QuestionOption[]
  /** for multi-select questions */
  maxSelect?: number
}

/** Raw answers collected during the quiz. Single = string, multi = string[]. */
export type Answers = Record<string, string | string[]>

/** Problem-score categories the engine reasons about. */
export type ScoreKey =
  | 'hairFall'
  | 'thinning'
  | 'dandruff'
  | 'oilyScalp'
  | 'dryScalp'
  | 'dryness'
  | 'frizz'
  | 'damage'
  | 'breakage'
  | 'dullness'
  | 'greying'
  | 'weakness'

export type Scores = Record<ScoreKey, number>

export interface Product {
  id: string
  kind: 'shampoo' | 'serum' | 'cream'
  name: string
  /** short marketing-style descriptor */
  descriptor: string
  /** what the product primarily does */
  purpose: string
  /** personalized "why we picked this" line */
  why: string
  /** how / when to use */
  usage: string
  /** the single strongest benefit */
  keyBenefit: string
  /** visual accent for the mockup */
  accent: string
}

export interface Recommendation {
  name: string
  primaryConcern: string
  secondaryConcern: string
  profileSummary: {
    texture: string
    thickness: string
    scalp: string
    condition: string
    primaryConcern: string
    secondaryConcern: string
  }
  scores: Scores
  shampoo: Product
  serum: Product
  cream: Product
  rationale: string[]
  routine: {
    washDay: string[]
    offDay: string[]
    note: string
  }
}
