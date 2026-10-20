import { useEffect, useRef } from 'react'

import { PokemonType } from '~/graphql/typeGenerated'
import { trackEvent } from '~/modules/analytics.module'

import { toTypesParam } from '../shared/typeCalcEvent.util'

const CHIP_STABLE_DELAY = 1500

/**
 * 칩으로 고른 타입 조합이 잠시 그대로일 때 계산 실행 이벤트를 보낸다.
 * @param selectTypeList 선택된 타입 목록
 * @param isNameSelected 이름 입력으로 고른 상태인지
 */
export const useChipCalcTracking = (
  selectTypeList: Array<PokemonType>,
  isNameSelected: boolean,
) => {
  const sentTypesRef = useRef(new Set<string>())

  useEffect(() => {
    if (isNameSelected || selectTypeList.length === 0) return undefined

    const types = toTypesParam(selectTypeList)
    if (sentTypesRef.current.has(types)) return undefined

    const timer = setTimeout(() => {
      sentTypesRef.current.add(types)
      trackEvent('use_type_calc', { input_method: 'chip', types })
    }, CHIP_STABLE_DELAY)

    return () => clearTimeout(timer)
  }, [selectTypeList, isNameSelected])
}
