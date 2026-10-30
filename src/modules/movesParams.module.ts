import { LearnMethod } from '~/graphql/typeGenerated'

const METHOD_SLUG: Partial<Record<LearnMethod, string>> = {
  [LearnMethod.MACHINE]: 'machine',
  [LearnMethod.EGG]: 'egg',
  [LearnMethod.TUTOR]: 'tutor',
  [LearnMethod.FORM_CHANGE]: 'form-change',
}

export const DEFAULT_LEARN_METHOD = LearnMethod.LEVEL_UP

export const VISIBLE_LEARN_METHODS: ReadonlyArray<LearnMethod> = [
  LearnMethod.LEVEL_UP,
  LearnMethod.MACHINE,
  LearnMethod.EGG,
  LearnMethod.TUTOR,
  LearnMethod.FORM_CHANGE,
]

/**
 * 해당 습득 기술이 있을 때만 탭을 노출하는 습득법.
 * 폼체인지는 로토무·옷갈아입기 피카츄 등 일부 폼에만 있어 항상 노출하면 빈 탭이 생긴다.
 */
export const CONDITIONAL_LEARN_METHODS: ReadonlySet<LearnMethod> = new Set([
  LearnMethod.FORM_CHANGE,
])

/**
 * 조건부 습득법의 기술 그룹이 learnset에 없는지 판정한다.
 * @returns skillsByMethod가 없으면(조회 실패) false
 */
export const isEmptyConditionalMethod = (
  learnMethod: LearnMethod,
  skillsByMethod?: ReadonlyArray<{ method: LearnMethod }>,
): boolean =>
  CONDITIONAL_LEARN_METHODS.has(learnMethod) &&
  skillsByMethod !== undefined &&
  !skillsByMethod.some(({ method }) => method === learnMethod)

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
