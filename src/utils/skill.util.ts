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

/**
 * LearnMethod enum 값을 한글로 변환
 * @param method - LearnMethod enum 값 (LEVEL_UP, MACHINE, EGG)
 * @returns 한글 습득 방법 (레벨업, 기술머신, 알)
 */
export const getLearnMethodKorean = (
  method: string | null | undefined,
): string => {
  if (!method) return '-'

  const methodMap: Record<string, string> = {
    LEVEL_UP: '레벨업',
    MACHINE: '기술머신',
    EGG: '알',
  }

  return methodMap[method.toUpperCase()] || method
}

/**
 * 한글 습득 방법을 LearnMethod enum으로 변환
 * @param methodKorean - 한글 습득 방법 (레벨업, 기술머신, 알)
 * @returns LearnMethod enum 값 (LEVEL_UP, MACHINE, EGG)
 */
export const getLearnMethodEnum = (
  methodKorean: string | null | undefined,
): string | undefined => {
  if (!methodKorean) return undefined

  const methodMap: Record<string, string> = {
    레벨업: 'LEVEL_UP',
    기술머신: 'MACHINE',
    알: 'EGG',
    전체: 'ALL',
  }

  return methodMap[methodKorean]
}

/**
 * 사용 가능한 습득 방법 목록
 * 확장성을 위해 배열로 관리
 */
export const AVAILABLE_LEARN_METHODS = [
  { value: 'ALL', label: '전체' },
  { value: 'LEVEL_UP', label: '레벨업' },
  { value: 'MACHINE', label: '기술머신' },
  // 향후 추가 예정:
  // { value: 'EGG', label: '알' },
  // { value: 'TUTOR', label: '기술 가르침' },
] as const
