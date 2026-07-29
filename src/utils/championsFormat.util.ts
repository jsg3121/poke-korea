import { ChampionsFormat } from '~/graphql/typeGenerated'

/**
 * 챔피언스 포켓몬을 인기 순으로 정렬하는 비교 함수 (usageRank 오름차순, 1위가 최상위).
 *
 * Why: 데이터 원천이 실게임 데이터로 바뀌며 usageRate(사용률 %)가 항상 null이 되어,
 * 기존 usageRate 기준 정렬이 무력화됐다(전부 0). 순위(usageRank)는 계속 유효하므로
 * 이를 기준으로 정렬한다. usageRank는 작을수록 상위(1위=가장 많이 채택)이므로 오름차순,
 * null(메타 미적재)은 항상 뒤로 보낸다.
 */
export const compareByUsageRank = (
  a: { usageRank?: number | null },
  b: { usageRank?: number | null },
): number => {
  const rankA = a.usageRank ?? Number.POSITIVE_INFINITY
  const rankB = b.usageRank ?? Number.POSITIVE_INFINITY
  return rankA - rankB
}

/**
 * 챔피언스 포맷 URL 슬러그. 데이터 원천이 실게임 데이터로 바뀌며 대회 포맷명(VGC/BSS)
 * 대신 게임 배틀 구분(더블/싱글)을 노출하기로 해, 슬러그도 사용자 친화적인
 * double/single로 변경했다. GraphQL enum(VGC_DOUBLES/BSS_SINGLES)은 그대로이며
 * resolveFormatEnum에서 매핑한다. 구 슬러그(vgc/bss) URL은 next.config.js에서
 * 301 리다이렉트로 보존한다.
 */
export type ChampionsFormatSlug = 'double' | 'single'

export const CHAMPIONS_FORMAT_SLUGS: ChampionsFormatSlug[] = [
  'double',
  'single',
]

export const CHAMPIONS_DEFAULT_FORMAT_SLUG: ChampionsFormatSlug = 'double'

/**
 * 라우트의 format 세그먼트 문자열을 ChampionsFormatSlug 로 파싱한다.
 * 유효하지 않은 값이면 null 반환.
 */
export const parseFormatSlug = (value: string): ChampionsFormatSlug | null => {
  if (value === 'double' || value === 'single') {
    return value
  }
  return null
}

/**
 * ChampionsFormatSlug → GraphQL enum 변환 (double=VGC_DOUBLES, single=BSS_SINGLES)
 */
export const resolveFormatEnum = (
  slug: ChampionsFormatSlug,
): ChampionsFormat => {
  switch (slug) {
    case 'double':
      return ChampionsFormat.VGC_DOUBLES
    case 'single':
      return ChampionsFormat.BSS_SINGLES
  }
}

/**
 * GraphQL ChampionsFormat enum → 사용자 친화 짧은 라벨.
 * 대회 카드의 포맷 라벨 등에서 사용.
 */
export const getFormatEnumShortLabel = (format: ChampionsFormat): string => {
  switch (format) {
    case ChampionsFormat.VGC_DOUBLES:
      return '더블'
    case ChampionsFormat.BSS_SINGLES:
      return '싱글'
  }
}

/**
 * 포맷 슬러그 → 한국어 라벨 (전체)
 */
export const getFormatLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '더블 배틀'
    case 'single':
      return '싱글 배틀'
  }
}

/**
 * 포맷 슬러그 → 한국어 라벨 (축약)
 */
export const getFormatShortLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '더블'
    case 'single':
      return '싱글'
  }
}

/**
 * 포맷 슬러그 → 짧은 설명 텍스트 (메타 description / OG description 용)
 */
export const getFormatDescription = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '포켓몬 챔피언스 더블 배틀 메타'
    case 'single':
      return '포켓몬 챔피언스 싱글 배틀 메타'
  }
}

/**
 * 포맷 슬러그 → 사용자 안내용 풍부한 소개 문구 (홈 페이지 UI 캡션 용)
 * 첫 방문자가 더블/싱글 배틀이 무엇인지 인지할 수 있도록 규칙을 요약한다.
 */
export const getFormatIntro = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '두 마리를 동시에 내보내 싸우는 배틀입니다. 6마리 중 4마리를 선택하여 2:2로 진행합니다.'
    case 'single':
      return '한 마리씩 내보내 싸우는 배틀입니다. 6마리 중 3마리를 선택하여 1:1로 진행합니다.'
  }
}

/**
 * 폼 종류 배지 정보 (도감 리스트 카드 / 티어 아이템 공용).
 *
 * Why: 실게임 데이터(championsbattledata)로 전환되며 메가진화가 도감에 별도 항목으로
 * 노출된다. 능력치·타입·이름은 메가 폼 것이지만 순위/기술/도구/특성은 베이스를 상속하므로,
 * 사용자가 메가/리전 폼임을 한눈에 알 수 있도록 카드에 폼 배지를 단다. 도감 카드와
 * 티어 아이템이 동일한 배지 규칙을 써야 하므로 공용 헬퍼로 분리했다.
 *
 * 판별은 formType enum(BASE/MEGA/REGION/NORMAL 등)을 우선 근거로 삼는다. formType이
 * 없을 때만 region 필드 존재 여부로 리전을 보조 판별한다. BASE/NORMAL은 배지 없음(null).
 */
export const getChampionsFormBadge = (
  formType: string | null | undefined,
  region: string | null | undefined,
): { label: string; className: string } | null => {
  if (formType === 'MEGA') {
    return { label: '메가', className: 'bg-amber-500 text-white' }
  }
  if (formType === 'REGION' || (!formType && region)) {
    return { label: '리전', className: 'bg-teal-500 text-white' }
  }
  return null
}

/**
 * ISO 문자열을 YYYY-MM-DD 형식으로 포맷.
 *
 * Why: 서버 환경(예: UTC) 과 무관하게 항상 한국 시간(KST, UTC+9) 기준으로
 * 일관된 날짜를 표시한다. SSR 시 서버가 UTC 라면 `date.getDate()` 는 UTC 기준이
 * 되어 한국 사용자에게 하루 일찍 표시될 수 있다. ISO 타임스탬프에 9시간을
 * 더한 뒤 UTC 메서드로 추출하면 환경 무관 KST 일자를 얻을 수 있다.
 */
export const formatKstDate = (iso?: string | null): string | null => {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const yyyy = kst.getUTCFullYear()
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(kst.getUTCDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

/**
 * 챔피언스 상세 페이지 URL 빌더 (정확 매핑).
 * formType + formCode 가 모두 있는 컴포넌트(티어 카드 / 도감 카드 / 홈 카드 / 폼 탭) 용.
 *
 * 라우트 패턴 (Phase 4):
 * - BASE       : /champions/[format]/list/[pokemonId]
 * - MEGA       : /champions/[format]/list/[pokemonId]/mega 또는 /mega/[formCode]
 * - REGION     : /champions/[format]/list/[pokemonId]/region/[formCode]
 * - GIGANTAMAX : /champions/[format]/list/[pokemonId]/gigantamax
 * - NORMAL     : /champions/[format]/list/[pokemonId]/form/[formCode]
 */
export const buildChampionsDetailHref = ({
  formatSlug,
  pokemonId,
  formType,
  formCode,
}: {
  formatSlug: ChampionsFormatSlug
  pokemonId: number
  formType: string | null | undefined
  formCode: string | null | undefined
}): string => {
  const base = `/champions/${formatSlug}/list/${pokemonId}`
  switch (formType) {
    case 'BASE':
      return base
    case 'MEGA':
      return formCode ? `${base}/mega/${formCode}` : `${base}/mega`
    case 'REGION':
      return formCode ? `${base}/region/${formCode}` : `${base}/region`
    case 'GIGANTAMAX':
      return `${base}/gigantamax`
    case 'NORMAL':
      return formCode ? `${base}/form/${formCode}` : `${base}/form`
    default:
      return base
  }
}
