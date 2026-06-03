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
