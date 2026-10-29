'use client'

import { useContext } from 'react'
import { useParams } from 'next/navigation'

import { LearnMethod } from '~/graphql/typeGenerated'
import {
  buildMovesPath,
  CONDITIONAL_LEARN_METHODS,
  DEFAULT_LEARN_METHOD,
  VISIBLE_LEARN_METHODS,
} from '~/modules/movesParams.module'
import { useLearnMethodLabels } from '~/hooks/useLearnMethodLabels'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import MovesVersionNav, {
  MovesVersionNavItem,
} from '~/components/moves/MovesVersionNav.component'
import TabItem from '~/components/tab/TabItem.component'

const DetailMovesStickyNav = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const {
    pokemonInfo,
    versionGroup,
    skillsByMethod,
    currentActiveIndex,
    currentVersionGroupId,
    currentLearnMethod,
  } = useContext(DetailMovesContext)

  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex
  const activeMethod = currentLearnMethod ?? DEFAULT_LEARN_METHOD

  const { getLabel } = useLearnMethodLabels()

  // 조건부 습득법(폼체인지)은 현재 버전에 해당 기술이 있거나 그 탭을 보고 있을 때만 노출
  const availableMethods = new Set(skillsByMethod?.map(({ method }) => method))
  const methodTabs = VISIBLE_LEARN_METHODS.filter(
    (method) =>
      !CONDITIONAL_LEARN_METHODS.has(method) ||
      availableMethods.has(method) ||
      method === activeMethod,
  ).map((method) => ({
    method,
    label: getLabel(method),
  }))

  const buildMethodPath = (learnMethod: LearnMethod) =>
    buildMovesPath({
      pokemonId,
      activeType:
        activeType === 'region'
          ? 'region'
          : activeIndex > 0
            ? 'normalForm'
            : undefined,
      activeIndex,
      versionGroupId: currentVersionGroupId,
      learnMethod,
    })

  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const versionItems: MovesVersionNavItem[] = (versionGroup ?? []).map(
    (item) => ({
      versionGroupId: item.versionGroupId,
      label: item.displayName ?? item.baseVersionGroupName ?? item.nameKo ?? '',
      active: item.versionGroupId === activeVersionId,
      href: buildMovesPath({
        pokemonId,
        activeType:
          activeType === 'region'
            ? 'region'
            : activeIndex > 0
              ? 'normalForm'
              : undefined,
        activeIndex,
        versionGroupId: item.versionGroupId,
        learnMethod: activeMethod,
      }),
    }),
  )

  return (
    <div className="sticky top-12 z-40 border-b border-solid border-primary-3/30 bg-primary-1 desktop:top-30">
      <div className="mx-auto w-full desktop:max-w-7xl">
        <nav
          aria-label="학습 방법 선택"
          className="flex gap-1 border-b border-solid border-primary-3/25 px-4 desktop:gap-2 desktop:px-0"
        >
          {methodTabs.map(({ method, label }) => (
            <TabItem
              key={method}
              href={buildMethodPath(method)}
              active={method === activeMethod}
              scroll={false}
            >
              {label}
            </TabItem>
          ))}
        </nav>
        {versionItems.length > 0 && (
          <MovesVersionNav
            items={versionItems}
            scroll={false}
            storageKey={`detail:${pokemonId}`}
          />
        )}
      </div>
    </div>
  )
}

export default DetailMovesStickyNav
