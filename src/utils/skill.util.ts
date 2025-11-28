/**
 * 백엔드에서 오는 영문 damageType을 한글로 변환
 * @param damageType - 백엔드에서 받은 damageType (physical, special, status)
 * @returns 한글 기술 유형 (물리, 특수, 변화)
 */
export const getDamageTypeKorean = (
  damageType: string | null | undefined,
): string => {
  if (!damageType) return '-'

  const damageTypeMap: Record<string, string> = {
    physical: '물리',
    special: '특수',
    status: '변화',
  }

  return damageTypeMap[damageType.toLowerCase()] || damageType
}

/**
 * 한글 damageType을 백엔드 API용 영문으로 변환
 * @param damageTypeKorean - 한글 damageType (물리, 특수, 변화)
 * @returns 영문 damageType (physical, special, status)
 */
export const getDamageTypeEnglish = (
  damageTypeKorean: string | null | undefined,
): string | undefined => {
  if (!damageTypeKorean) return undefined

  const damageTypeMap: Record<string, string> = {
    물리: 'physical',
    특수: 'special',
    변화: 'status',
  }

  return damageTypeMap[damageTypeKorean]
}
