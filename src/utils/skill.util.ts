import { ChipColor } from '~/components/chip/chipStyle'
import { DamageType } from '~/graphql/typeGenerated'

/**
 * damageType 표기 정규화 — 전환기 대응.
 *
 * 백엔드가 기술 도메인을 재설계하며 damageType을 enum(`PHYSICAL`)으로 바꿨으나,
 * 레거시 쿼리(`PokemonSkillDetail` 등)는 여전히 소문자 String(`"physical"`)을
 * 반환한다. 두 표기가 공존하는 전환 기간 동안 양쪽을 모두 수용한다.
 *
 * 레거시 쿼리가 전부 신규 쿼리로 교체되면 이 정규화를 제거하고
 * `Record<DamageType, T>` 직접 조회로 좁힌다.
 */
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

/** 데미지 분류 한글 라벨. 물리·특수·변화 3종 폐쇄 집합이라 상수로 관리한다. */
const DAMAGE_TYPE_LABEL: Record<DamageType, string> = {
  [DamageType.PHYSICAL]: '물리',
  [DamageType.SPECIAL]: '특수',
  [DamageType.STATUS]: '변화',
}

/** 데미지 분류 → Chip 색 키. ChipColor가 소문자라 enum과 별도 매핑이 필요하다. */
const DAMAGE_TYPE_CHIP_COLOR: Record<DamageType, ChipColor> = {
  [DamageType.PHYSICAL]: 'physical',
  [DamageType.SPECIAL]: 'special',
  [DamageType.STATUS]: 'status',
}

/**
 * damageType을 한글 라벨로 변환
 * @param damageType - enum(PHYSICAL) 또는 레거시 문자열(physical)
 * @returns 한글 기술 유형 (물리, 특수, 변화). 미보유·미지의 값은 '-'
 */
export const getDamageTypeKorean = (
  damageType: DamageType | string | null | undefined,
): string => {
  const normalized = normalizeDamageType(damageType)

  return normalized ? DAMAGE_TYPE_LABEL[normalized] : '-'
}

/**
 * damageType을 Chip 색 키로 변환
 *
 * 미지의 값을 'status'로 폴백하던 기존 동작을 유지한다 — Chip은 색이 없으면
 * 렌더 자체가 생략되어 분류 배지가 조용히 사라지므로, 폴백이 있는 편이 낫다.
 * @param damageType - enum(PHYSICAL) 또는 레거시 문자열(physical)
 */
export const getDamageTypeChipColor = (
  damageType: DamageType | string | null | undefined,
): ChipColor => {
  const normalized = normalizeDamageType(damageType)

  return normalized ? DAMAGE_TYPE_CHIP_COLOR[normalized] : 'status'
}

/**
 * damageType 보유 여부 — Chip 렌더 여부 판단용
 *
 * `getDamageTypeChipColor`는 항상 값을 반환하므로(폴백), 값이 실제로 있는지
 * 구분해야 하는 화면에서 쓴다.
 */
export const hasDamageType = (
  damageType: DamageType | string | null | undefined,
): boolean => normalizeDamageType(damageType) !== undefined

/**
 * 한글 damageType을 API 필터용 값으로 변환
 *
 * 기술 도감 필터는 URL 파라미터에 한글을 그대로 싣는 구버전 규약을 유지하므로
 * (`damageTypeFilter=물리`), API 호출 전에 역변환이 필요하다.
 * @returns 레거시 API가 받는 소문자 문자열 (physical, special, status)
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
