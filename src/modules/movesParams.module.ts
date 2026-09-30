import { LearnMethod } from '~/graphql/typeGenerated'

const METHOD_SLUG: Partial<Record<LearnMethod, string>> = {
  [LearnMethod.MACHINE]: 'machine',
  [LearnMethod.EGG]: 'egg',
  [LearnMethod.TUTOR]: 'tutor',
}

export const DEFAULT_LEARN_METHOD = LearnMethod.LEVEL_UP

export const VISIBLE_LEARN_METHODS: ReadonlyArray<LearnMethod> = [
  LearnMethod.LEVEL_UP,
  LearnMethod.MACHINE,
  LearnMethod.EGG,
  LearnMethod.TUTOR,
]

const SLUG_TO_METHOD = new Map<string, LearnMethod>(
  Object.entries(METHOD_SLUG).map(([method, slug]) => [
    slug,
    method as LearnMethod,
  ]),
)

export const parseLearnMethodSlug = (
  slug?: string,
): LearnMethod | undefined => {
  if (!slug) return DEFAULT_LEARN_METHOD

  return SLUG_TO_METHOD.get(slug)
}

export const buildLearnMethodSlug = (method?: LearnMethod): string =>
  method && method !== DEFAULT_LEARN_METHOD ? (METHOD_SLUG[method] ?? '') : ''

interface MovesSegmentParams {
  versionGroupId?: number
  learnMethod: LearnMethod
  isValid: boolean
}

interface FormSegmentParams extends MovesSegmentParams {
  activeIndex: number
}

export const parseFormSegments = (segments?: string[]): FormSegmentParams => {
  const invalid: FormSegmentParams = {
    activeIndex: 0,
    learnMethod: DEFAULT_LEARN_METHOD,
    isValid: false,
  }

  if (!segments || segments.length === 0) {
    return { activeIndex: 0, learnMethod: DEFAULT_LEARN_METHOD, isValid: true }
  }

  let activeIndex = 0
  let versionGroupId: number | undefined
  let cursor = 0

  if (segments[cursor] !== 'version' && !SLUG_TO_METHOD.has(segments[cursor])) {
    const parsed = parseInt(segments[cursor], 10)
    if (isNaN(parsed) || parsed < 0 || parsed > 100) return invalid
    activeIndex = parsed
    cursor++
  }

  if (cursor >= segments.length) {
    return { activeIndex, learnMethod: DEFAULT_LEARN_METHOD, isValid: true }
  }

  if (segments[cursor] === 'version') {
    cursor++
    if (cursor >= segments.length) return invalid

    const parsedVersion = parseInt(segments[cursor], 10)
    if (isNaN(parsedVersion) || parsedVersion <= 0) return invalid
    versionGroupId = parsedVersion
    cursor++

    if (cursor >= segments.length) {
      return {
        activeIndex,
        versionGroupId,
        learnMethod: DEFAULT_LEARN_METHOD,
        isValid: true,
      }
    }
  }

  if (cursor !== segments.length - 1) return invalid

  const learnMethod = SLUG_TO_METHOD.get(segments[cursor])
  if (!learnMethod) return invalid

  return { activeIndex, versionGroupId, learnMethod, isValid: true }
}

export const buildMovesPath = ({
  pokemonId,
  activeType,
  activeIndex,
  versionGroupId,
  learnMethod,
}: {
  pokemonId: string
  activeType?: 'region' | 'normalForm'
  activeIndex?: number
  versionGroupId?: number
  learnMethod?: LearnMethod
}): string => {
  let basePath = `/detail/${pokemonId}/moves`

  if (activeType === 'region') {
    basePath +=
      activeIndex && activeIndex > 0 ? `/region/${activeIndex}` : '/region'
  } else if (activeIndex && activeIndex > 0) {
    basePath += `/form/${activeIndex}`
  }

  if (versionGroupId) {
    basePath += `/version/${versionGroupId}`
  }

  const methodSlug = buildLearnMethodSlug(learnMethod)
  if (methodSlug) {
    basePath += `/${methodSlug}`
  }

  return basePath
}
