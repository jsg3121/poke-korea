'use client'

import { useParams } from 'next/navigation'
import { useContext } from 'react'
import TabItemComponent from '~/components/tab/TabItem.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { LearnMethod } from '~/graphql/typeGenerated'
import { useLearnMethodLabels } from '~/hook/useLearnMethodLabels'
import {
  DEFAULT_LEARN_METHOD,
  VISIBLE_LEARN_METHODS,
  buildMovesPath,
} from '~/module/movesParams.module'
import MovesVersionNavComponent, {
  MovesVersionNavItem,
} from '~/components/moves/MovesVersionNav.component'

/**
 * 습득 기술 sticky 크롬 블록 (UX-006) — 학습법 탭 + 버전 선택 nav.
 *
 * 전역 헤더(48px) 바로 아래에 sticky로 고정한다(리스트/상세 개편에서 확립한 sticky
 * 크롬 패턴). 배경을 페이지색(primary-1)으로 채워 스크롤 시 본문(기술 표)이 비쳐
 * 보이지 않게 한다.
 *
 * - 학습법 탭: 레벨업(/moves) ↔ 기술머신(/moves/machine). path 분리라 next/link
 *   이동 탭(TabItem underline). 동시 노출·토글은 폐기(UX-006).
 * - 버전 nav: 라벨 없이 칩 링크만(페이지 전용 로컬 MovesVersionNav).
 *
 * 폼(일반/리전)·activeIndex는 컨텍스트가 갖고 있어 탭·버전 링크가 현재 폼을 유지한다.
 */

const DetailMovesStickyNavContainer = () => {
  const { pokemonId } = useParams<{ pokemonId: string }>()
  const {
    pokemonInfo,
    versionGroup,
    currentActiveIndex,
    currentVersionGroupId,
    currentLearnMethod,
  } = useContext(DetailMovesContext)

  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex
  const activeMethod = currentLearnMethod ?? DEFAULT_LEARN_METHOD

  // 라벨은 마스터 쿼리에서 받는다 — 데이터가 없는 습득법은 skillsByMethod에 그룹이
  // 오지 않아 methodLabel을 얻을 수 없기 때문이다.
  const { getLabel } = useLearnMethodLabels()

  // 탭은 VISIBLE_LEARN_METHODS 4종을 데이터 유무와 무관하게 항상 그린다.
  // 버전에 따라 탭이 나타났다 사라지면 사용자가 조작 실수로 오인하므로,
  // 레벨업·기술머신과 동일하게 알 기술·기술 가르침도 자리를 지킨다.
  const methodTabs = VISIBLE_LEARN_METHODS.map((method) => ({
    method,
    label: getLabel(method),
  }))

  // 현재 폼/버전을 유지하면서 학습법만 바꾸는 경로
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

  // 활성 버전: 명시된 currentVersionGroupId, 없으면 최신.
  // 백엔드가 order 내림차순 정렬을 계약으로 보장하므로 첫 항목이 최신이다
  // (isLatest=true도 함께 오지만, 첫 항목 접근이 더 단순해 그대로 쓴다).
  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const versionItems: MovesVersionNavItem[] = (versionGroup ?? []).map(
    (item) => ({
      versionGroupId: item.versionGroupId,
      // displayName은 백엔드가 DLC를 베이스 시리즈로 정규화한 표시 전용 단일 필드다.
      // 기존엔 이 화면만 baseVersionGroupName을, 기술 상세는 nameKo를 써서 같은
      // 버전이 화면마다 다르게 표기되던 문제가 있었다.
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
    // 배경(bg-primary-1)은 전체 폭으로 스크롤 콘텐츠를 가리고, 내부 콘텐츠만
    // max-w-7xl로 가둔다(모바일 헤더 48px / 데스크톱 헤더 실높이 120px 오프셋).
    <div className="sticky top-12 z-40 border-b border-solid border-primary-3/30 bg-primary-1 desktop:top-30">
      <div className="mx-auto w-full desktop:max-w-7xl">
        {/* 학습법 탭은 URL 이동 링크(next/link)라 role="tablist"(같은 페이지 내
            패널 전환용, WAI-ARIA APG)가 아니라 일반 내비게이션 — aria-current로
            현재 페이지만 표시(Gemini) */}
        <nav
          aria-label="학습 방법 선택"
          className="flex gap-1 border-b border-solid border-primary-3/25 px-4 desktop:gap-2 desktop:px-0"
        >
          {/* scroll={false}: 이 크롬은 sticky라 이동 후에도 화면에 남는데,
              기본 동작대로 최상단으로 튀면 방금 누른 탭이 시야에서 사라져
              맥락이 끊긴다(버전 nav도 동일 이유로 false) */}
          {methodTabs.map(({ method, label }) => (
            <TabItemComponent
              key={method}
              href={buildMethodPath(method)}
              active={method === activeMethod}
              scroll={false}
            >
              {label}
            </TabItemComponent>
          ))}
        </nav>
        {versionItems.length > 0 && (
          <MovesVersionNavComponent items={versionItems} scroll={false} />
        )}
      </div>
    </div>
  )
}

export default DetailMovesStickyNavContainer
