import { LearnMethod } from '~/graphql/typeGenerated'

/**
 * 습득법 URL 슬러그 ↔ LearnMethod enum 매핑.
 *
 * 백엔드 기술 도메인 재설계로 습득법이 2종(레벨업·기술머신)에서 9종으로 늘었다.
 * 기존엔 `MovesType = 'LEVELUP' | 'MACHINE'`으로 타입 수준에서 2종을 고정하고
 * `machine` 세그먼트를 리터럴로 박아, 습득법이 늘 때마다 라우트 파일과 파서를
 * 함께 고쳐야 했다.
 *
 * 슬러그는 기존 URL(`/moves/machine`)을 그대로 유지한다 — 이미 색인된 경로라
 * 바꾸면 SEO 손실이 난다. 레벨업은 슬러그 없는 기본 경로(`/moves`)다.
 */
const METHOD_SLUG: Partial<Record<LearnMethod, string>> = {
  [LearnMethod.MACHINE]: 'machine',
  [LearnMethod.EGG]: 'egg',
  [LearnMethod.TUTOR]: 'tutor',
}

/** 기본 습득법 — 슬러그 없는 경로(`/moves`)가 가리키는 값 */
export const DEFAULT_LEARN_METHOD = LearnMethod.LEVEL_UP

/**
 * 화면에 노출하는 습득법 — 탭 순서와 동일하다.
 *
 * 백엔드는 `isExposed=true`인 9종을 내려주지만, 그중 기술 떠올리기(1건)·폼체인지
 * (59건)·지가르데 큐브(40건)·전기구슬 유전(10건)은 극소수 포켓몬에만 해당한다.
 * 전부 탭으로 만들면 모든 포켓몬 화면에 빈 탭이 늘어서므로 주요 4종만 노출한다.
 *
 * 4종은 데이터 유무와 무관하게 **항상** 표시한다 — 버전을 바꿀 때마다 탭이
 * 나타났다 사라지면 사용자가 조작 실수로 오인한다. 데이터가 없는 탭은 들어갔을 때
 * 안내 문구를 보여준다(레벨업·기술머신이 항상 있는 것과 같은 취급).
 */
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

/** URL 슬러그 → LearnMethod. 알 수 없는 슬러그는 undefined(404 처리용) */
export const parseLearnMethodSlug = (
  slug?: string,
): LearnMethod | undefined => {
  if (!slug) return DEFAULT_LEARN_METHOD

  return SLUG_TO_METHOD.get(slug)
}

/** LearnMethod → URL 슬러그. 기본 습득법은 슬러그가 없어 빈 문자열 */
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

/**
 * form/region 라우트의 [[...segments]] 파싱
 *
 * [] → index=0, 최신 버전, 레벨업
 * ['1'] → index=1, 최신 버전, 레벨업
 * ['machine'] → index=0, 최신 버전, 기술머신
 * ['egg'] → index=0, 최신 버전, 알 기술
 * ['1', 'tutor'] → index=1, 최신 버전, 기술 가르침
 * ['version', '5'] → index=0, version=5, 레벨업
 * ['1', 'version', '5'] → index=1, version=5, 레벨업
 * ['version', '5', 'machine'] → index=0, version=5, 기술머신
 * ['1', 'version', '5', 'egg'] → index=1, version=5, 알 기술
 */
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

  // 첫 세그먼트가 'version'도 습득법 슬러그도 아니면 activeIndex로 본다
  if (segments[cursor] !== 'version' && !SLUG_TO_METHOD.has(segments[cursor])) {
    const parsed = parseInt(segments[cursor], 10)
    if (isNaN(parsed) || parsed < 0 || parsed > 100) return invalid
    activeIndex = parsed
    cursor++
  }

  if (cursor >= segments.length) {
    return { activeIndex, learnMethod: DEFAULT_LEARN_METHOD, isValid: true }
  }

  // 'version' 세그먼트 처리
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

  // 남은 세그먼트는 습득법 슬러그 하나여야 한다
  if (cursor !== segments.length - 1) return invalid

  const learnMethod = SLUG_TO_METHOD.get(segments[cursor])
  if (!learnMethod) return invalid

  return { activeIndex, versionGroupId, learnMethod, isValid: true }
}

/**
 * Path 기반 URL 빌더
 */
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

  // form/region 분기
  if (activeType === 'region') {
    basePath +=
      activeIndex && activeIndex > 0 ? `/region/${activeIndex}` : '/region'
  } else if (activeIndex && activeIndex > 0) {
    basePath += `/form/${activeIndex}`
  }

  // version 세그먼트
  if (versionGroupId) {
    basePath += `/version/${versionGroupId}`
  }

  // 습득법 세그먼트 (레벨업은 슬러그 없음)
  const methodSlug = buildLearnMethodSlug(learnMethod)
  if (methodSlug) {
    basePath += `/${methodSlug}`
  }

  return basePath
}
