import { ChampionsFormat } from '~/graphql/typeGenerated'

export type ChampionsFormatSlug = 'vgc' | 'bss'

export const CHAMPIONS_FORMAT_SLUGS: ChampionsFormatSlug[] = ['vgc', 'bss']

export const CHAMPIONS_DEFAULT_FORMAT_SLUG: ChampionsFormatSlug = 'vgc'

/**
 * 라우트의 format 세그먼트 문자열을 ChampionsFormatSlug 로 파싱한다.
 * 유효하지 않은 값이면 null 반환.
 */
export const parseFormatSlug = (value: string): ChampionsFormatSlug | null => {
  if (value === 'vgc' || value === 'bss') {
    return value
  }
  return null
}

/**
 * ChampionsFormatSlug → GraphQL enum 변환
 */
export const resolveFormatEnum = (
  slug: ChampionsFormatSlug,
): ChampionsFormat => {
  switch (slug) {
    case 'vgc':
      return ChampionsFormat.VGC_DOUBLES
    case 'bss':
      return ChampionsFormat.BSS_SINGLES
  }
}

/**
 * 포맷 슬러그 → 한국어 라벨 (전체)
 */
export const getFormatLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'vgc':
      return 'VGC 더블'
    case 'bss':
      return 'BSS 싱글'
  }
}

/**
 * 포맷 슬러그 → 한국어 라벨 (축약)
 */
export const getFormatShortLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'vgc':
      return 'VGC'
    case 'bss':
      return 'BSS'
  }
}

/**
 * 포맷 슬러그 → 짧은 설명 텍스트 (메타 description / OG description 용)
 */
export const getFormatDescription = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'vgc':
      return 'Pokemon Champions VGC 2026 (더블 배틀)'
    case 'bss':
      return 'Battle Stadium Singles (싱글 배틀)'
  }
}

/**
 * 포맷 슬러그 → 사용자 안내용 풍부한 소개 문구 (홈 페이지 UI 캡션 용)
 * 첫 방문자가 VGC/BSS가 어떤 대회인지 인지할 수 있도록 정식 명칭 + 규칙 요약.
 */
export const getFormatIntro = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'vgc':
      return 'Video Game Championships. 포켓몬 공식 세계 대회에서 사용하는 더블 배틀 포맷입니다. 6마리 중 4마리를 선택하여 2:2 동시 배틀로 진행합니다.'
    case 'bss':
      return 'Battle Stadium Singles. 닌텐도 스위치 본가 게임의 공식 랭크전 싱글 포맷입니다. 6마리 중 3마리를 선택하여 1:1 배틀로 진행합니다.'
  }
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

