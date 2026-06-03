import { ChampionsFormat } from '~/graphql/typeGenerated'

export type ChampionsFormatSlug = 'vgc' | 'bss'

export const CHAMPIONS_FORMAT_SLUGS: ChampionsFormatSlug[] = ['vgc', 'bss']

export const CHAMPIONS_DEFAULT_FORMAT_SLUG: ChampionsFormatSlug = 'vgc'

/**
 * 라우트의 format 세그먼트 문자열을 ChampionsFormatSlug 로 파싱한다.
 * 유효하지 않은 값이면 null 반환.
 */
export const parseFormatSlug = (
  value: string,
): ChampionsFormatSlug | null => {
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
 * 포맷 슬러그 → 설명 텍스트
 */
export const getFormatDescription = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'vgc':
      return 'Pokemon Champions VGC 2026 (더블 배틀)'
    case 'bss':
      return 'Battle Stadium Singles (싱글 배틀)'
  }
}
