import type { Answers, Product, Recommendation, ScoreKey, Scores } from './types'

/* -------------------------------------------------------------------------- */
/*  Readable labels                                                           */
/* -------------------------------------------------------------------------- */

const scoreLabel: Record<ScoreKey, string> = {
  hairFall: 'Hair fall',
  thinning: 'Thinning',
  dandruff: 'Dandruff & flakes',
  oilyScalp: 'Oily scalp',
  dryScalp: 'Dry scalp',
  dryness: 'Dryness',
  frizz: 'Frizz',
  damage: 'Damage',
  breakage: 'Breakage',
  dullness: 'Dullness',
  greying: 'Greying',
  weakness: 'Weak hair',
}

const textureLabel: Record<string, string> = {
  straight: 'straight',
  wavy: 'wavy',
  curly: 'curly',
  coily: 'coily',
}

const thicknessLabel: Record<string, string> = {
  fine: 'fine',
  medium: 'medium',
  thick: 'thick',
}

const scalpLabel: Record<string, string> = {
  dry: 'dry',
  balanced: 'balanced',
  oily: 'oily',
  veryOily: 'very oily',
}

const conditionLabel: Record<string, string> = {
  healthy: 'Healthy',
  slight: 'Slightly damaged',
  noticeable: 'Noticeably damaged',
  severe: 'Severely damaged',
}

/* -------------------------------------------------------------------------- */
/*  Scoring                                                                    */
/* -------------------------------------------------------------------------- */

function emptyScores(): Scores {
  return {
    hairFall: 0,
    thinning: 0,
    dandruff: 0,
    oilyScalp: 0,
    dryScalp: 0,
    dryness: 0,
    frizz: 0,
    damage: 0,
    breakage: 0,
    dullness: 0,
    greying: 0,
    weakness: 0,
  }
}

type Contrib = Partial<Record<ScoreKey, number>>

// answer value -> score contributions, per question id
const rules: Record<string, Record<string, Contrib>> = {
  texture: {
    straight: { oilyScalp: 0.4 },
    wavy: { frizz: 0.5 },
    curly: { dryness: 1.5, frizz: 1.5 },
    coily: { dryness: 2, frizz: 2, breakage: 1 },
  },
  thickness: {
    fine: { weakness: 1, breakage: 0.5, thinning: 0.3 },
    medium: {},
    thick: { dryness: 0.4 },
  },
  density: {
    low: { thinning: 1.5, hairFall: 0.3 },
    medium: { thinning: 0.3 },
    high: {},
    unsure: {},
  },
  scalp: {
    dry: { dryScalp: 2, dryness: 0.5 },
    balanced: {},
    oily: { oilyScalp: 1.5 },
    veryOily: { oilyScalp: 2.5, dandruff: 0.5 },
  },
  flakes: {
    never: {},
    occasionally: { dandruff: 1 },
    frequently: { dandruff: 2 },
    almostAlways: { dandruff: 3, dryScalp: 0.4 },
  },
  hairFall: {
    minimal: {},
    mild: { hairFall: 1 },
    moderate: { hairFall: 2 },
    significant: { hairFall: 3, weakness: 0.5 },
  },
  thinning: {
    notAtAll: {},
    slightly: { thinning: 1 },
    moderately: { thinning: 2, hairFall: 0.5 },
    significantly: { thinning: 3, hairFall: 1 },
  },
  frizz: {
    veryLittle: {},
    sometimes: { frizz: 1 },
    often: { frizz: 2, dryness: 0.5 },
    daily: { frizz: 3, dryness: 1 },
  },
  dryness: {
    soft: {},
    slightlyDry: { dryness: 1 },
    quiteDry: { dryness: 2, damage: 0.5 },
    extremelyDry: { dryness: 3, damage: 1, breakage: 0.5 },
  },
  damage: {
    healthy: {},
    slight: { damage: 1 },
    noticeable: { damage: 2, breakage: 0.5, dullness: 0.5 },
    severe: { damage: 3, breakage: 1, dullness: 1, weakness: 0.5 },
  },
  breakage: {
    rarely: {},
    occasionally: { breakage: 1 },
    frequently: { breakage: 2, weakness: 0.5 },
    veryFrequently: { breakage: 3, weakness: 1, damage: 0.5 },
  },
  chemical: {
    none: {},
    colour: { damage: 1, dullness: 0.5 },
    smoothening: { damage: 1.5, dryness: 0.5 },
    bleach: { damage: 2, breakage: 1, dryness: 1, dullness: 0.5 },
    multiple: { damage: 2.5, breakage: 1, dryness: 1, weakness: 0.5 },
  },
  heat: {
    never: {},
    rare: { damage: 0.3 },
    weekly: { damage: 1, dryness: 0.3, frizz: 0.3 },
    daily: { damage: 1.5, dryness: 0.8, breakage: 0.5, frizz: 0.5 },
  },
  washing: {
    daily: { oilyScalp: 0.5, dryness: 0.3 },
    twiceThrice: {},
    weekly: {},
    less: { oilyScalp: 0.3 },
  },
  primaryConcern: {
    hairFall: { hairFall: 4 },
    dandruff: { dandruff: 4 },
    dryness: { dryness: 4 },
    frizz: { frizz: 4 },
    damage: { damage: 4, breakage: 1 },
    thinning: { thinning: 4, hairFall: 1 },
    dullness: { dullness: 4 },
    greying: { greying: 4 },
  },
  outcome: {
    strength: { weakness: 1, breakage: 0.5 },
    reducedFall: { hairFall: 1.5, thinning: 0.5 },
    healthyScalp: { dandruff: 0.5, oilyScalp: 0.5, dryScalp: 0.5 },
    smoother: { frizz: 1 },
    moisture: { dryness: 1.5, dryScalp: 0.5 },
    lessFrizz: { frizz: 1.5 },
    fuller: { thinning: 1 },
    healthyLengths: { damage: 1, breakage: 0.5 },
  },
}

// secondary multi-select maps directly to a score key
const secondaryMap: Record<string, ScoreKey> = {
  hairFall: 'hairFall',
  thinning: 'thinning',
  dandruff: 'dandruff',
  oilyScalp: 'oilyScalp',
  dryScalp: 'dryScalp',
  dryness: 'dryness',
  frizz: 'frizz',
  damage: 'damage',
  breakage: 'breakage',
  dullness: 'dullness',
  weakness: 'weakness',
  greying: 'greying',
}

function add(scores: Scores, contrib: Contrib, factor = 1) {
  for (const key in contrib) {
    const k = key as ScoreKey
    scores[k] += (contrib[k] ?? 0) * factor
  }
}

function computeScores(answers: Answers): Scores {
  const scores = emptyScores()

  for (const qid in rules) {
    const value = answers[qid]
    if (typeof value === 'string' && rules[qid][value]) {
      add(scores, rules[qid][value])
    }
  }

  const secondary = answers.secondaryConcerns
  if (Array.isArray(secondary)) {
    for (const v of secondary) {
      const key = secondaryMap[v]
      if (key) scores[key] += 2
    }
  }

  return scores
}

function rankConcerns(scores: Scores): ScoreKey[] {
  return (Object.keys(scores) as ScoreKey[])
    .filter((k) => scores[k] > 0)
    .sort((a, b) => scores[b] - scores[a])
}

/* -------------------------------------------------------------------------- */
/*  Product variant catalogs                                                   */
/* -------------------------------------------------------------------------- */

type WeightClass = 'light' | 'medium' | 'rich'

interface Variant {
  id: string
  name: string
  purpose: string
  keyBenefit: string
  usage: string
  accent: string
  affinity: Contrib
  base?: number
  weightClass?: WeightClass
  textureBoost?: string[]
  heatBoost?: boolean
}

const shampoos: Variant[] = [
  { id: 'sh-balance', name: 'Scalp Balance & Oil Control Shampoo', purpose: 'Regulates excess oil while keeping the scalp calm.', keyBenefit: 'Balanced, fresh-feeling roots', usage: 'Massage into the scalp and rinse thoroughly.', accent: '#5f8f8a', affinity: { oilyScalp: 1, dandruff: 0.4 }, weightClass: 'light' },
  { id: 'sh-flake', name: 'Flake Relief & Soothe Shampoo', purpose: 'Reduces visible flakes and soothes an irritated scalp.', keyBenefit: 'Comfortable, flake-free scalp', usage: 'Work into the scalp, leave for a minute, then rinse.', accent: '#8fae9f', affinity: { dandruff: 1, dryScalp: 0.5 } },
  { id: 'sh-antifall', name: 'Root Strength & Anti-Fall Shampoo', purpose: 'Cleanses gently while supporting hair at the root.', keyBenefit: 'Stronger-feeling roots', usage: 'Focus on the scalp; rinse and repeat if needed.', accent: '#7c8f7b', affinity: { hairFall: 1, thinning: 0.4 } },
  { id: 'sh-moisture', name: 'Deep Moisture Shampoo', purpose: 'Cleanses without stripping much-needed moisture.', keyBenefit: 'Softer, hydrated lengths', usage: 'Lather through and rinse; ideal for dry hair days.', accent: '#c9a25f', affinity: { dryness: 1, dryScalp: 0.5 }, weightClass: 'rich' },
  { id: 'sh-repair', name: 'Bond Repair Shampoo', purpose: 'Helps reinforce hair weakened by damage.', keyBenefit: 'Smoother, more resilient strands', usage: 'Apply, leave briefly to work through lengths, rinse.', accent: '#8a6d8f', affinity: { damage: 1, breakage: 0.5 } },
  { id: 'sh-gentle', name: 'Gentle Strength Shampoo', purpose: 'A mild cleanse for fragile, breakage-prone hair.', keyBenefit: 'Less stress on delicate strands', usage: 'Use gentle pressure on the scalp; avoid rough rubbing.', accent: '#c99aa0', affinity: { breakage: 0.7, weakness: 0.8 }, weightClass: 'light' },
  { id: 'sh-everyday', name: 'Everyday Balance Shampoo', purpose: 'A well-rounded daily cleanse for balanced hair.', keyBenefit: 'Clean, healthy-looking hair', usage: 'Use as your regular everyday shampoo.', accent: '#9a978f', affinity: { dullness: 0.5 }, base: 0.6 },
  { id: 'sh-curl', name: 'Curl Hydration Shampoo', purpose: 'A moisturizing cleanse tuned for textured hair.', keyBenefit: 'Defined, hydrated curls', usage: 'Emulsify with water and scrunch through curls.', accent: '#b08a6e', affinity: { dryness: 0.6, frizz: 0.6 }, weightClass: 'rich', textureBoost: ['curly', 'coily'] },
  { id: 'sh-volume', name: 'Volume & Density Shampoo', purpose: 'Lightweight cleanse that supports fuller-looking hair.', keyBenefit: 'Noticeably more body', usage: 'Cleanse the scalp well; keep conditioner to the ends.', accent: '#6f8aa8', affinity: { thinning: 1, hairFall: 0.3 }, weightClass: 'light' },
  { id: 'sh-clarify', name: 'Clarify & Renew Shampoo', purpose: 'Lifts buildup for a refreshed, brighter scalp.', keyBenefit: 'Reset, weightless roots', usage: 'Use once or twice a week to clear buildup.', accent: '#a8a05f', affinity: { oilyScalp: 0.8, dullness: 0.5 } },
  { id: 'sh-colour', name: 'Colour Care Repair Shampoo', purpose: 'Protects and revives chemically treated hair.', keyBenefit: 'Longer-looking vibrancy', usage: 'Use on treated hair; rinse with cooler water.', accent: '#c58a94', affinity: { damage: 0.7, dullness: 0.6 } },
  { id: 'sh-shine', name: 'Shine Revival Shampoo', purpose: 'Brings back gloss to dull, tired-looking hair.', keyBenefit: 'Visibly glossier finish', usage: 'Lather, rinse, and finish with cool water for shine.', accent: '#c2a24a', affinity: { dullness: 1 } },
]

const serums: Variant[] = [
  { id: 'se-density', name: 'Density Support Serum', purpose: 'Targets the scalp to support fuller-looking density.', keyBenefit: 'Support for thinning areas', usage: 'Apply a few drops to the scalp on non-wash nights and massage in.', accent: '#7c8f7b', affinity: { hairFall: 1, thinning: 0.8 } },
  { id: 'se-root', name: 'Root Strength Serum', purpose: 'Reinforces the root to reduce everyday shedding.', keyBenefit: 'Firmer-feeling roots', usage: 'Massage into the scalp nightly and leave on.', accent: '#6f8aa8', affinity: { hairFall: 0.7, weakness: 0.9 } },
  { id: 'se-scalp', name: 'Scalp Comfort Serum', purpose: 'Soothes and rebalances a reactive scalp.', keyBenefit: 'Calmer, more comfortable scalp', usage: 'Apply to the scalp on non-wash days; no rinse needed.', accent: '#8fae9f', affinity: { dandruff: 0.9, dryScalp: 0.5, oilyScalp: 0.4 } },
  { id: 'se-repair', name: 'Repair & Bond Serum', purpose: 'Helps reconnect and strengthen damaged fibres.', keyBenefit: 'Reinforced, smoother strands', usage: 'Smooth a few drops through damp or dry lengths.', accent: '#8a6d8f', affinity: { damage: 1, breakage: 0.7 } },
  { id: 'se-hydra', name: 'Hydration & Frizz Serum', purpose: 'Locks in moisture and tames surface frizz.', keyBenefit: 'Smoother, hydrated lengths', usage: 'Apply to mid-lengths and ends; reapply as needed.', accent: '#5f8f8a', affinity: { dryness: 0.8, frizz: 0.8 } },
  { id: 'se-smooth', name: 'Smooth & Shine Serum', purpose: 'Adds slip and gloss for a polished finish.', keyBenefit: 'Sleek, glossy look', usage: 'Warm a drop between palms and glaze over lengths.', accent: '#c2a24a', affinity: { frizz: 0.7, dullness: 0.7 } },
  { id: 'se-antibreak', name: 'Anti-Breakage Serum', purpose: 'Fortifies fragile hair against snapping.', keyBenefit: 'Fewer mid-length breaks', usage: 'Apply along lengths, focusing on weaker sections.', accent: '#c99aa0', affinity: { breakage: 1, weakness: 0.6 } },
  { id: 'se-curl', name: 'Curl Definition Serum', purpose: 'Defines texture while controlling frizz.', keyBenefit: 'Springier, defined curls', usage: 'Rake through damp curls before styling.', accent: '#b08a6e', affinity: { frizz: 0.6, dryness: 0.5 }, textureBoost: ['curly', 'coily'] },
  { id: 'se-growth', name: 'Growth Activator Serum', purpose: 'A scalp treatment aimed at fuller-looking hair.', keyBenefit: 'Support for a fuller look', usage: 'Apply to the scalp nightly and massage for a minute.', accent: '#a8a05f', affinity: { thinning: 1, hairFall: 0.5 } },
  { id: 'se-nourish', name: 'Nourish & Restore Serum', purpose: 'Replenishes dry, depleted lengths.', keyBenefit: 'Restored softness', usage: 'Smooth through lengths on dry or damp hair.', accent: '#c9a25f', affinity: { dryness: 0.7, damage: 0.6 } },
  { id: 'se-shine', name: 'Shine Boost Serum', purpose: 'A finishing serum for instant gloss.', keyBenefit: 'Mirror-like shine', usage: 'Apply a small amount to dry hair as a finisher.', accent: '#9a978f', affinity: { dullness: 1 }, base: 0.4 },
  { id: 'se-grey', name: 'Grey Care Serum', purpose: 'Cares for and softens greying hair.', keyBenefit: 'Softer, managed greys', usage: 'Work through lengths to soften coarse greys.', accent: '#8a6d8f', affinity: { greying: 1.4 } },
]

const creams: Variant[] = [
  { id: 'cr-lightstrength', name: 'Lightweight Strength Cream', purpose: 'Adds strength and control without weight.', keyBenefit: 'Body with no heaviness', usage: 'Work a small amount through damp lengths before styling.', accent: '#7c8f7b', affinity: { hairFall: 0.6, weakness: 0.5 }, weightClass: 'light' },
  { id: 'cr-moistcurl', name: 'Deep Moisture Curl Cream', purpose: 'Deeply hydrates and shapes thirsty curls.', keyBenefit: 'Soft, moisturized curls', usage: 'Scrunch generously into damp curls and air-dry.', accent: '#b08a6e', affinity: { dryness: 1, frizz: 0.6 }, weightClass: 'rich', textureBoost: ['curly', 'coily'] },
  { id: 'cr-repair', name: 'Intensive Repair Cream', purpose: 'A rich leave-in for damaged, over-processed hair.', keyBenefit: 'Rescued, smoother ends', usage: 'Concentrate on damaged mid-lengths and ends.', accent: '#8a6d8f', affinity: { damage: 1, breakage: 0.6 }, weightClass: 'rich' },
  { id: 'cr-antifrizz', name: 'Anti-Frizz Smoothing Cream', purpose: 'Smooths the surface and blocks humidity frizz.', keyBenefit: 'All-day smoothness', usage: 'Apply to damp hair and style as usual.', accent: '#5f8f8a', affinity: { frizz: 1 }, weightClass: 'medium' },
  { id: 'cr-finishing', name: 'Lightweight Finishing Cream', purpose: 'A weightless finish for balanced, healthy hair.', keyBenefit: 'Effortless, natural finish', usage: 'Smooth a little over lengths to finish your style.', accent: '#9a978f', affinity: { dullness: 0.4 }, base: 0.6, weightClass: 'light' },
  { id: 'cr-nourish', name: 'Nourishing Length Cream', purpose: 'Feeds dry, dull lengths with lasting moisture.', keyBenefit: 'Deeply conditioned lengths', usage: 'Apply from mid-length down; leave in.', accent: '#c9a25f', affinity: { dryness: 0.8, damage: 0.5 }, weightClass: 'rich' },
  { id: 'cr-curldef', name: 'Curl Defining Cream', purpose: 'Locks in definition and fights frizz for texture.', keyBenefit: 'Defined, frizz-free coils', usage: 'Rake and scrunch into wet curls; scrunch out crunch when dry.', accent: '#a8a05f', affinity: { frizz: 0.7, dryness: 0.6 }, weightClass: 'rich', textureBoost: ['curly', 'coily'] },
  { id: 'cr-heat', name: 'Heat Shield Styling Cream', purpose: 'Protects strands before heat styling.', keyBenefit: 'Guarded, smoother styling', usage: 'Apply to damp hair before blow-drying or ironing.', accent: '#6f8aa8', affinity: { damage: 0.6, frizz: 0.4 }, weightClass: 'medium', heatBoost: true },
  { id: 'cr-volume', name: 'Volume Lift Cream', purpose: 'Lifts fine hair for a fuller finish.', keyBenefit: 'Airy, fuller volume', usage: 'Apply to roots and lengths of damp hair, then dry.', accent: '#a8a05f', affinity: { thinning: 0.9, hairFall: 0.3 }, weightClass: 'light' },
  { id: 'cr-shine', name: 'Shine & Smooth Cream', purpose: 'Polishes dull hair to a soft shine.', keyBenefit: 'Glossy, smooth lengths', usage: 'Smooth through dry hair for a glossy finish.', accent: '#c2a24a', affinity: { dullness: 0.7, frizz: 0.5 }, weightClass: 'medium' },
  { id: 'cr-antibreak', name: 'Anti-Breakage Strength Cream', purpose: 'Cushions fragile hair to limit breakage.', keyBenefit: 'Protected, stronger lengths', usage: 'Work through lengths daily, especially the ends.', accent: '#c99aa0', affinity: { breakage: 1, weakness: 0.5 }, weightClass: 'medium' },
  { id: 'cr-hydraseal', name: 'Hydra-Seal Moisture Cream', purpose: 'Seals in intense moisture for very dry hair.', keyBenefit: 'Long-lasting hydration', usage: 'Apply generously to dry lengths and leave in.', accent: '#c9a25f', affinity: { dryness: 1.2 }, weightClass: 'rich' },
]

/* -------------------------------------------------------------------------- */
/*  Variant selection                                                          */
/* -------------------------------------------------------------------------- */

function selectVariant(
  catalog: Variant[],
  scores: Scores,
  answers: Answers,
): Variant {
  const thickness = answers.thickness as string
  const texture = answers.texture as string
  const heat = answers.heat as string
  const heavyHeat = heat === 'weekly' || heat === 'daily'

  let best = catalog[0]
  let bestScore = -Infinity

  for (const v of catalog) {
    let s = v.base ?? 0
    for (const key in v.affinity) {
      const k = key as ScoreKey
      s += (v.affinity[k] ?? 0) * scores[k]
    }

    // weight-class fit vs. strand thickness
    if (v.weightClass && thickness) {
      if (thickness === 'fine') {
        if (v.weightClass === 'light') s += 0.8
        if (v.weightClass === 'rich') s -= 0.9
      } else if (thickness === 'thick') {
        if (v.weightClass === 'rich') s += 0.7
        if (v.weightClass === 'light') s -= 0.3
      }
    }

    // texture-specific formulas
    if (v.textureBoost && v.textureBoost.includes(texture)) s += 1.6

    // heat-protection relevance
    if (v.heatBoost && heavyHeat) s += 1.4

    if (s > bestScore) {
      bestScore = s
      best = v
    }
  }

  return best
}

/* -------------------------------------------------------------------------- */
/*  Personalized copy                                                          */
/* -------------------------------------------------------------------------- */

function firstName(name: string): string {
  const n = name.trim().split(/\s+/)[0] || 'Your'
  return n.charAt(0).toUpperCase() + n.slice(1)
}

function buildProduct(
  variant: Variant,
  kind: Product['kind'],
  answers: Answers,
  ranked: ScoreKey[],
): Product {
  const tex = textureLabel[answers.texture as string] ?? 'your'
  const thick = thicknessLabel[answers.thickness as string] ?? ''
  const scalp = scalpLabel[answers.scalp as string] ?? 'your'
  const primary = ranked[0] ? scoreLabel[ranked[0]].toLowerCase() : 'your goals'
  const secondary = ranked[1] ? scoreLabel[ranked[1]].toLowerCase() : ''

  const descriptor = `Formulated around your ${tex}, ${thick} hair and ${primary} profile.`

  let why: string
  if (kind === 'shampoo') {
    why = `Your ${scalp} scalp${
      ranked[0] ? ` and ${primary}` : ''
    } responses shaped the cleansing balance of this shampoo.`
  } else if (kind === 'serum') {
    why = `Selected to support your ${primary}${
      secondary ? ` and ${secondary}` : ''
    } profile where it starts — at the root and along the strand.`
  } else {
    why = `Chosen to finish your ${tex} hair for ${primary}${
      secondary ? ` and ${secondary}` : ''
    } without weighing ${thick || 'your'} strands down.`
  }

  return {
    id: variant.id,
    kind,
    name: variant.name,
    descriptor,
    purpose: variant.purpose,
    why,
    usage: variant.usage,
    keyBenefit: variant.keyBenefit,
    accent: variant.accent,
  }
}

function buildRationale(answers: Answers, ranked: ScoreKey[]): string[] {
  const out: string[] = []
  const tex = textureLabel[answers.texture as string]
  const thick = thicknessLabel[answers.thickness as string]
  const scalp = scalpLabel[answers.scalp as string]

  if (scalp) {
    out.push(
      `Your ${scalp} scalp influenced how gentle and balancing your shampoo is.`,
    )
  }
  if (thick === 'fine') {
    out.push(
      'Because your strands are fine, we kept the whole routine lightweight so it never feels heavy.',
    )
  } else if (thick === 'thick') {
    out.push(
      'Your thicker strands can carry richer textures, so your routine leans more nourishing.',
    )
  }
  if (tex === 'curly' || tex === 'coily') {
    out.push(
      `Your ${tex} texture pushed the routine toward extra moisture and definition.`,
    )
  }
  if (ranked[0]) {
    out.push(
      `${scoreLabel[ranked[0]]} came through as your leading concern, so it anchors the serum choice.`,
    )
  }
  if (ranked[1]) {
    out.push(
      `${scoreLabel[ranked[1]]} showed up as a secondary theme and shaped your hair cream.`,
    )
  }
  const chem = answers.chemical as string
  if (chem && chem !== 'none') {
    out.push(
      'Your recent chemical treatment nudged the formulas toward repair and protection.',
    )
  }
  const heat = answers.heat as string
  if (heat === 'weekly' || heat === 'daily') {
    out.push(
      'Because you use heat styling regularly, protection factored into your cream.',
    )
  }

  return out.slice(0, 5)
}

function buildRoutine(answers: Answers, products: {
  shampoo: Product
  serum: Product
  cream: Product
}) {
  const pref = answers.routinePref as string
  const wash = answers.washing as string

  const washDay = [
    `${products.shampoo.name} — cleanse and rinse`,
    `${products.cream.name} — smooth through damp lengths`,
  ]
  const offDay = [`${products.serum.name} — apply and leave on overnight`]

  let note: string
  if (pref === 'simple') {
    note =
      'You prefer a quick routine, so this is streamlined — two steps on wash day and one light step in between.'
  } else if (pref === 'detailed') {
    note =
      'Since you enjoy a fuller ritual, feel free to layer the serum both morning and night for extra support.'
  } else {
    note = 'A balanced rhythm that fits easily around your week.'
  }

  if (wash === 'daily') {
    note += ' With daily washing, keep the cream focused on your ends to avoid buildup.'
  } else if (wash === 'weekly' || wash === 'less') {
    note += ' On the longer gaps between washes, the serum keeps your scalp and lengths cared for.'
  }

  return { washDay, offDay, note }
}

/* -------------------------------------------------------------------------- */
/*  Public API                                                                 */
/* -------------------------------------------------------------------------- */

export function generateRecommendation(
  answers: Answers,
  name: string,
): Recommendation {
  const scores = computeScores(answers)
  const ranked = rankConcerns(scores)

  const primaryKey = ranked[0]
  const secondaryKey = ranked[1]

  const shampooVariant = selectVariant(shampoos, scores, answers)
  const serumVariant = selectVariant(serums, scores, answers)
  const creamVariant = selectVariant(creams, scores, answers)

  const shampoo = buildProduct(shampooVariant, 'shampoo', answers, ranked)
  const serum = buildProduct(serumVariant, 'serum', answers, ranked)
  const cream = buildProduct(creamVariant, 'cream', answers, ranked)

  const primaryConcern = primaryKey
    ? scoreLabel[primaryKey]
    : 'Overall balance'
  const secondaryConcern = secondaryKey
    ? scoreLabel[secondaryKey]
    : 'Everyday care'

  return {
    name: firstName(name),
    primaryConcern,
    secondaryConcern,
    profileSummary: {
      texture: capitalize(textureLabel[answers.texture as string] ?? '—'),
      thickness: capitalize(thicknessLabel[answers.thickness as string] ?? '—'),
      scalp: capitalize(scalpLabel[answers.scalp as string] ?? '—'),
      condition: conditionLabel[answers.damage as string] ?? '—',
      primaryConcern,
      secondaryConcern,
    },
    scores,
    shampoo,
    serum,
    cream,
    rationale: buildRationale(answers, ranked),
    routine: buildRoutine(answers, { shampoo, serum, cream }),
  }
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}
