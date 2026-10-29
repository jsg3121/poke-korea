import { FormTypeParam } from '~/types/analyticsEvent.types'
import { TActiveType } from '~/types/detailContext.types'

const ACTIVE_TYPE_PARAM: Record<
  Exclude<TActiveType, 'normal'>,
  FormTypeParam
> = {
  mega: 'mega',
  region: 'region',
  gigantamax: 'gigantamax',
}

/**
 * 상세 페이지의 활성 폼을 이벤트 파라미터 값으로 바꾼다.
 * @param activeType 상세 컨텍스트의 활성 폼 구분
 * @param pathname 현재 경로 — 기본 경로와 폼체인지 경로가 모두 `normal`이라 경로로 나눈다
 * @returns 이벤트용 폼 구분 값
 */
export const toDetailFormTypeParam = (
  activeType: TActiveType,
  pathname: string,
): FormTypeParam => {
  if (activeType !== 'normal') return ACTIVE_TYPE_PARAM[activeType]
  return pathname.split('/').includes('form') ? 'form' : 'default'
}
