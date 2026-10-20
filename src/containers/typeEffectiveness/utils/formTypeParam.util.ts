import { FormTypeParam } from '~/types/analyticsEvent.types'

const FORM_TYPE_PARAM: Record<string, Exclude<FormTypeParam, 'gigantamax'>> = {
  BASE: 'default',
  MEGA: 'mega',
  NORMAL_FORM: 'form',
  REGION_FORM: 'region',
}

/**
 * 검색 결과의 폼 구분을 이벤트 파라미터 값으로 바꾼다.
 * @param formType 백엔드 폼 구분(`BASE`·`MEGA`·`NORMAL_FORM`·`REGION_FORM`)
 * @returns 이벤트용 폼 구분 값. 알 수 없는 값이면 `default`
 */
export const toFormTypeParam = (formType: string) =>
  FORM_TYPE_PARAM[formType] ?? 'default'
