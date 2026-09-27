import { ChampionsFormat } from '~/graphql/typeGenerated'

export const compareByUsageRank = (
  a: { usageRank?: number | null },
  b: { usageRank?: number | null },
): number => {
  const rankA = a.usageRank ?? Number.POSITIVE_INFINITY
  const rankB = b.usageRank ?? Number.POSITIVE_INFINITY
  return rankA - rankB
}

export type ChampionsFormatSlug = 'double' | 'single'

export const CHAMPIONS_FORMAT_SLUGS: ChampionsFormatSlug[] = [
  'double',
  'single',
]

export const CHAMPIONS_DEFAULT_FORMAT_SLUG: ChampionsFormatSlug = 'double'

export const parseFormatSlug = (value: string): ChampionsFormatSlug | null => {
  if (value === 'double' || value === 'single') {
    return value
  }
  return null
}

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

export const getFormatEnumShortLabel = (format: ChampionsFormat): string => {
  switch (format) {
    case ChampionsFormat.VGC_DOUBLES:
      return '더블'
    case ChampionsFormat.BSS_SINGLES:
      return '싱글'
  }
}

export const getFormatLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '더블 배틀'
    case 'single':
      return '싱글 배틀'
  }
}

export const getFormatShortLabel = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '더블'
    case 'single':
      return '싱글'
  }
}

export const getFormatDescription = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '포켓몬 챔피언스 더블 배틀 메타'
    case 'single':
      return '포켓몬 챔피언스 싱글 배틀 메타'
  }
}

export const getFormatIntro = (slug: ChampionsFormatSlug): string => {
  switch (slug) {
    case 'double':
      return '두 마리를 동시에 내보내 싸우는 배틀입니다. 6마리 중 4마리를 선택하여 2:2로 진행합니다.'
    case 'single':
      return '한 마리씩 내보내 싸우는 배틀입니다. 6마리 중 3마리를 선택하여 1:1로 진행합니다.'
  }
}

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
