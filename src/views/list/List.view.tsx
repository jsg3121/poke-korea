'use client'

import FilterBarOrganism from '~/components/filter/FilterBar.organism'
import { ListProvider } from '~/context/List.context'
import { PokemonFilterInput, PokemonList } from '~/graphql/typeGenerated'
import { useRouteChangeCache } from '~/hook/useRouteChangeCache'
import ListGridContainer from '~/container/list/ListGrid.container'

/**
 * 도감 리스트 뷰 (반응형 단일 — UX-004). 데/모 2벌(List.desktop/List.mobile)의
 * 콘텐츠를 대체한다. UA 분기·display:none 없이 CSS(desktop:)만으로 반응(ADR-0007).
 *
 * 크롬 구조(C1 해결): 필터바는 전역 헤더 **아래에 이어붙는 sticky**(모바일 top-12
 * =헤더 48px / 데스크톱 top-28=fixed 헤더 112px)로, 기존처럼 헤더 내부에 필터를
 * 넣어 헤더 높이를 가변으로 만들거나(데스크톱) 독자 fixed 레이어를 띄우던(모바일)
 * 좌표 하드코딩 충돌을 없앤다. 스크롤 시 헤더+필터바가 하나의 블록처럼 고정된다.
 *
 * 광고 배너는 이 페이지에서 일단 제거(사용자 결정 2026-07-07) — UA 분기 없는
 * 반응형 광고 유닛이 정해지면 재도입한다. 크롬(헤더/푸터/탭바) 선택은 호출부(page) 책임.
 */

interface ListViewProps {
  pokemonList: Array<PokemonList>
  initialFilter: PokemonFilterInput
  hasNextPage: boolean
}

const ListView = ({
  pokemonList,
  initialFilter,
  hasNextPage,
}: ListViewProps) => {
  useRouteChangeCache()

  return (
    <ListProvider
      initialList={pokemonList}
      initialFilter={initialFilter}
      hasNextPage={hasNextPage}
    >
      <h1 className="sr-only">포켓몬 도감</h1>

      {/* 필터바 — 전역 헤더 하단에 이어붙는 sticky (z-30: 헤더보다 아래, 콘텐츠보다 위).
          desktop:top-30(120px) = 데스크톱 fixed 헤더 실높이(112px 아님 — 8px 겹침 주의) */}
      <div className="sticky top-12 z-30 bg-primary-1 desktop:top-30 pt-4">
        <FilterBarOrganism />
      </div>

      <ListGridContainer />
    </ListProvider>
  )
}

export default ListView
