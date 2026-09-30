'use client'

import { useCallback, useContext, useMemo } from 'react'

import { useGetLearnMethodsQuery } from '~/graphql/gqlGenerated'
import { LearnMethod } from '~/graphql/typeGenerated'
import { DetailMovesContext } from '~/context/DetailMoves.context'

export const useLearnMethodLabels = () => {
  const { learnMethodLabels } = useContext(DetailMovesContext)

  const hasContextLabels = !!learnMethodLabels?.length
  const { data } = useGetLearnMethodsQuery({ skip: hasContextLabels })

  const source = hasContextLabels ? learnMethodLabels : data?.getLearnMethods

  const labelMap = useMemo(
    () => new Map(source?.map(({ method, nameKo }) => [method, nameKo])),
    [source],
  )

  const getLabel = useCallback(
    (method: LearnMethod | string): string =>
      labelMap.get(method as LearnMethod) ?? method,
    [labelMap],
  )

  return { getLabel }
}
