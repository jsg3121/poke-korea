'use client'

import { useContext } from 'react'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { useGetLearnMethodsQuery } from '~/graphql/gqlGenerated'
import { LearnMethod } from '~/graphql/typeGenerated'

/**
 * 습득법 한글 라벨 조회.
 *
 * 습득법은 백엔드 기술 도메인 재설계로 2종(레벨업·기술머신)에서 9종(알 기술·기술
 * 가르침·폼체인지 등)으로 늘었고 앞으로도 추가될 수 있다. 하드코딩 매핑은 신규 값이
 * 들어오면 enum 원문(`REMINDER`)을 그대로 화면에 노출시키므로, 마스터 쿼리로 받는다.
 *
 * **컨텍스트 값을 우선한다.** 습득 기술 페이지는 서버에서 라벨을 미리 받아 컨텍스트로
 * 내려주므로 SSR 시점부터 한글이 나온다. 클라이언트 쿼리에만 의존하면 첫 렌더에
 * enum 원문이 들어가고 응답이 와야 한글로 바뀌어, 네트워크가 느린 환경에서 영문이
 * 보이는 구간이 길어진다.
 *
 * 컨텍스트 밖(다른 페이지)에서 쓸 때는 클라이언트 쿼리로 폴백한다. 정적 데이터라
 * Apollo 캐시가 유지되는 동안 재요청되지 않는다.
 */
export const useLearnMethodLabels = () => {
  const { learnMethodLabels } = useContext(DetailMovesContext)

  // 컨텍스트에 라벨이 있으면 쿼리 결과를 쓰지 않는다(skip으로 요청 자체를 막는다)
  const hasContextLabels = !!learnMethodLabels?.length
  const { data } = useGetLearnMethodsQuery({ skip: hasContextLabels })

  const source = hasContextLabels ? learnMethodLabels : data?.getLearnMethods

  const labelMap = new Map(
    source?.map(({ method, nameKo }) => [method, nameKo]),
  )

  const getLabel = (method: LearnMethod | string): string =>
    labelMap.get(method as LearnMethod) ?? method

  return { getLabel }
}
