'use client'

import { useParams } from 'next/navigation'
import { useContext } from 'react'
import TabItemComponent from '~/components/tab/TabItem.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { buildMovesPath } from '~/module/movesParams.module'
import MovesVersionNavComponent, {
  MovesVersionNavItem,
} from './components/MovesVersionNav.component'

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
    currentMovesType,
  } = useContext(DetailMovesContext)

  const activeType = pokemonInfo?.activeType
  const activeIndex = currentActiveIndex
  const isMachine = currentMovesType === 'MACHINE'

  // 현재 폼/버전을 유지하면서 학습법(레벨업/머신)만 바꾸는 경로
  const buildMethodPath = (movesType: 'LEVELUP' | 'MACHINE') =>
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
      movesType,
    })

  // 활성 버전: 명시된 currentVersionGroupId, 없으면 최신(목록의 첫 항목)
  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const versionItems: MovesVersionNavItem[] = (versionGroup ?? []).map(
    (item) => ({
      versionGroupId: item.versionGroupId,
      label: item.baseVersionGroupName ?? item.nameKo ?? '',
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
        movesType: currentMovesType,
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
          <TabItemComponent
            href={buildMethodPath('LEVELUP')}
            active={!isMachine}
          >
            레벨업으로 배우기
          </TabItemComponent>
          <TabItemComponent
            href={buildMethodPath('MACHINE')}
            active={isMachine}
          >
            기술머신으로 배우기
          </TabItemComponent>
        </nav>
        {versionItems.length > 0 && (
          <MovesVersionNavComponent items={versionItems} />
        )}
      </div>
    </div>
  )
}

export default DetailMovesStickyNavContainer
