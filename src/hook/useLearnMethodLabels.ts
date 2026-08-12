'use client'

import { useGetLearnMethodsQuery } from '~/graphql/gqlGenerated'
import { LearnMethod } from '~/graphql/typeGenerated'

/**
 * 습득법 한글 라벨 조회.
 *
 * 습득법은 백엔드 기술 도메인 재설계로 2종(레벨업·기술머신)에서 9종(알 기술·기술
 * 가르침·폼체인지 등)으로 늘었고 앞으로도 추가될 수 있다. 하드코딩 매핑은 신규 값이
 * 들어오면 enum 원문(`REMINDER`)을 그대로 화면에 노출시키므로, 마스터 쿼리로 받는다.
 *
 * 정적 데이터라 Apollo 캐시가 유지되는 동안 재요청되지 않는다. 라벨이 아직 도착하지
 * 않았거나 미지의 값이면 enum 원문을 폴백으로 반환한다 — 빈 배지보다 낫다.
 */
export const useLearnMethodLabels = () => {
  const { data } = useGetLearnMethodsQuery()

  const labelMap = new Map(
    data?.getLearnMethods.map(({ method, nameKo }) => [method, nameKo]),
  )

  const getLabel = (method: LearnMethod | string): string =>
    labelMap.get(method as LearnMethod) ?? method

  return { getLabel }
}
