import { DamageType } from '~/graphql/typeGenerated'
import { ChipColor } from '~/components/chip/chip.types'

const normalizeDamageType = (
  damageType: DamageType | string | null | undefined,
): DamageType | undefined => {
  if (!damageType) return undefined

  const upper = damageType.toUpperCase()

  return upper === DamageType.PHYSICAL ||
    upper === DamageType.SPECIAL ||
    upper === DamageType.STATUS
    ? (upper as DamageType)
    : undefined
}

const DAMAGE_TYPE_LABEL: Record<DamageType, string> = {
  [DamageType.PHYSICAL]: '물리',
  [DamageType.SPECIAL]: '특수',
  [DamageType.STATUS]: '변화',
}

const DAMAGE_TYPE_CHIP_COLOR: Record<DamageType, ChipColor> = {
  [DamageType.PHYSICAL]: 'physical',
  [DamageType.SPECIAL]: 'special',
  [DamageType.STATUS]: 'status',
}

/**
 * damageType을 한글 라벨로 변환한다.
 * @param damageType enum(PHYSICAL) 또는 레거시 문자열(physical)
 * @returns 물리·특수·변화. 미보유·미지의 값은 '-'
 */
export const getDamageTypeKorean = (
  damageType: DamageType | string | null | undefined,
): string => {
  const normalized = normalizeDamageType(damageType)

  return normalized ? DAMAGE_TYPE_LABEL[normalized] : '-'
}

/**
 * damageType을 Chip 색 키로 변환한다. 미지의 값은 'status'로 폴백한다.
 * @param damageType enum(PHYSICAL) 또는 레거시 문자열(physical)
 */
export const getDamageTypeChipColor = (
  damageType: DamageType | string | null | undefined,
): ChipColor => {
  const normalized = normalizeDamageType(damageType)

  return normalized ? DAMAGE_TYPE_CHIP_COLOR[normalized] : 'status'
}

export const hasDamageType = (
  damageType: DamageType | string | null | undefined,
): boolean => normalizeDamageType(damageType) !== undefined

/**
 * 한글 damageType을 API 필터용 값으로 변환한다.
 * @returns 레거시 API가 받는 소문자 문자열(physical, special, status)
 */
export const getDamageTypeEnglish = (
  damageTypeKorean: string | null | undefined,
): string | undefined => {
  if (!damageTypeKorean) return undefined

  const entry = (
    Object.entries(DAMAGE_TYPE_LABEL) as Array<[DamageType, string]>
  ).find(([, label]) => label === damageTypeKorean)

  return entry ? entry[0].toLowerCase() : undefined
}
