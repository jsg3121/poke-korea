import { TActiveType } from '~/types/detailContext.type'

interface ParseFormParamsResult {
  activeType: TActiveType
  activeIndex: number
}

/**
 * Path 파라미터에서 activeIndex를 추출
 * /detail/6/mega -> { activeIndex: 0 }
 * /detail/6/mega/1 -> { activeIndex: 1 }
 * /detail/6/region -> { activeIndex: 0 }
 * /detail/6/region/2 -> { activeIndex: 2 }
 */
export const parseIndexParam = (
  index?: string[],
): { activeIndex: number; isValid: boolean } => {
  if (!index || index.length === 0) {
    return { activeIndex: 0, isValid: true }
  }

  const [indexStr] = index

  const activeIndex = parseInt(indexStr, 10)
  if (isNaN(activeIndex) || activeIndex < 0 || activeIndex > 100) {
    return { activeIndex: 0, isValid: false }
  }

  if (index.length > 1) {
    return { activeIndex, isValid: false }
  }

  return { activeIndex, isValid: true }
}

/**
 * 기본폼 Path 파라미터 파싱
 */
export const parseNormalFormParams = (searchParams: {
  activeIndex?: string
}): ParseFormParamsResult => {
  const activeIndex = searchParams.activeIndex
    ? parseInt(searchParams.activeIndex, 10)
    : 0

  return {
    activeType: 'normal',
    activeIndex: isNaN(activeIndex) ? 0 : activeIndex,
  }
}
