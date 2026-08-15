import { NormalizedCacheObject } from '@apollo/client'
import { Fragment } from 'react'
import Providers from '~/app/providers'
import MobileTabBar from '~/components/MobileTabBar'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import {
  PokemonLearnInfo,
  PokemonSkillDetail,
  VersionGroup,
} from '~/graphql/typeGenerated'
import MoveDetailView from '~/views/moves/MoveDetail.view'

/**
 * 기술 상세 페이지 셸 — `/moves/[id]`와 `/moves/[id]/version/[versionGroupId]`가 공유한다.
 *
 * 두 라우트는 선택 버전(selectedVersionGroupId)과 JSON-LD만 다르고, 크롬 선택·
 * Providers 하이드레이션·뷰 조립이 완전히 동일했다(렌더 블록 47줄이 prop 하나를
 * 빼고 같은 코드). 한쪽만 고치면 다른 쪽이 어긋나므로 셸로 합친다.
 *
 * 콘텐츠는 반응형 단일(MoveDetailView, ADR-0007). UA 분기는 전역 크롬
 * (헤더/푸터/탭바) 선택으로만 남는다(list·ability 개편과 동일 패턴).
 * SSR로 실행한 쿼리 결과를 클라이언트 캐시로 하이드레이트(initialApolloState)해
 * 버전 탭 전환 시 클라이언트 재요청을 없앤다.
 */

interface MoveDetailPageShellProps {
  isMobile: boolean
  initialApolloState: NormalizedCacheObject | null
  skillId: number
  skill: PokemonSkillDetail
  pokemonList: Array<PokemonLearnInfo>
  totalCount: number
  versionGroups?: Array<VersionGroup> | null
  /** 버전 지정 라우트에서만 넘긴다. 최신(버전 미지정)이면 생략 */
  selectedVersionGroupId?: number
  /** 페이지별 구조화 데이터 — 최신/버전별로 스키마가 다르다 */
  jsonLd: object
  /** JSON-LD script 태그 id (페이지마다 고유해야 한다) */
  jsonLdId: string
}

const MoveDetailPageShell = ({
  isMobile,
  initialApolloState,
  skillId,
  skill,
  pokemonList,
  totalCount,
  versionGroups,
  selectedVersionGroupId,
  jsonLd,
  jsonLdId,
}: MoveDetailPageShellProps) => {
  const view = (
    <MoveDetailView
      skillId={skillId}
      initialSkill={skill}
      initialPokemonList={pokemonList}
      totalCount={totalCount}
      versionGroups={versionGroups}
      selectedVersionGroupId={selectedVersionGroupId}
    />
  )

  return (
    <Fragment>
      <Providers initialApolloState={initialApolloState}>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            {view}
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          // pt-30(120px) = 데스크톱 fixed 헤더 실높이. 버전 nav sticky(desktop:top-30)와 맞춤
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            {view}
            <DesktopFooterContainer />
          </main>
        )}
      </Providers>
      <script
        id={jsonLdId}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Fragment>
  )
}

export default MoveDetailPageShell
