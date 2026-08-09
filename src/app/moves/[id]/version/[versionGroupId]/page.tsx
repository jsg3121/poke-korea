import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import { getMoveDetailVersionJsonLd } from '~/constants/movesJsonLd'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import MoveDetailView from '~/views/moves/MoveDetail.view'
import Providers from '~/app/providers'
import { fetchMoveDetailQueries } from '../../_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from '../../_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailVersionMetadata } from '../../_metadata/generateMoveDetailMetadata'

// 이 페이지는 동적 렌더다: headers() UA 감지(크롬 선택)가 매 요청 평가된다.
// 기존 revalidate=1년 선언은 headers() 때문에 실효가 없던 거짓 신호라 제거(UX-008).

type PageProps = {
  params: Promise<{
    id: string
    versionGroupId: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, versionGroupId: versionGroupIdParam } = await params
  const skillId = parseInt(id, 10)
  const versionGroupId = parseInt(versionGroupIdParam, 10)

  if (isNaN(skillId) || isNaN(versionGroupId) || versionGroupId < 1) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const { skill, versionGroups } = await fetchMoveDetailMetadata({
    skillId,
    versionGroupId,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const versionData = skill.generations.find(
    (gen) => gen.versionGroupId === versionGroupId,
  )

  if (!versionData) {
    return {
      title: '기술을 찾을 수 없습니다',
    }
  }

  const versionGroupName =
    versionGroups?.find((vg) => vg.versionGroupId === versionGroupId)?.nameKo ??
    undefined

  return generateMoveDetailVersionMetadata({
    skillId,
    nameKo: skill.nameKo,
    versionGroupId,
    versionGroupName,
    description: versionData.description,
    type: versionData.type,
    power: versionData.power,
    accuracy: versionData.accuracy,
    damageType: versionData.damageType,
  })
}

const MoveDetailVersionPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id, versionGroupId: versionGroupIdParam } = await params
  const skillId = parseInt(id, 10)
  const versionGroupId = parseInt(versionGroupIdParam, 10)

  if (isNaN(skillId) || isNaN(versionGroupId) || versionGroupId < 1) {
    notFound()
  }

  const { skill, pokemonData, versionGroups, initialApolloState } =
    await fetchMoveDetailQueries({
      skillId,
      versionGroupId,
    })

  if (!skill) {
    notFound()
  }

  const versionData = skill.generations.find(
    (gen) => gen.versionGroupId === versionGroupId,
  )

  if (!versionData) {
    notFound()
  }

  const pokemonList =
    pokemonData?.getPokemonsBySkill?.edges.map(
      (edge: PokemonLearnInfoEdge) => edge.node,
    ) || []
  const totalCount = pokemonData?.getPokemonsBySkill?.totalCount ?? 0

  const versionGroupName =
    versionGroups?.find((vg) => vg.versionGroupId === versionGroupId)?.nameKo ??
    ''

  const jsonLd = getMoveDetailVersionJsonLd(
    skillId,
    skill.nameKo,
    versionGroupId,
    versionGroupName,
  )

  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(MoveDetailView, ADR-0007) — /moves/[id]와 동일 뷰 공유,
          선택 버전(selectedVersionGroupId)만 다르다. UA 분기는 전역 크롬만.
          SSR로 실행한 GetPokemonsBySkill 결과를 클라이언트 캐시로 하이드레이트
          (initialApolloState)해 버전 탭 전환 시 클라이언트 재요청을 없앤다. */}
      <Providers initialApolloState={initialApolloState}>
        {isMobile ? (
          <main className="w-full min-h-screen">
            <MobileHeaderContainer />
            <MoveDetailView
              skillId={skillId}
              initialSkill={skill}
              initialPokemonList={pokemonList}
              totalCount={totalCount}
              selectedVersionGroupId={versionGroupId}
              versionGroups={versionGroups}
            />
            <MobileFooterContainer />
            <MobileTabBar />
          </main>
        ) : (
          // pt-30(120px) = 데스크톱 fixed 헤더 실높이. 버전 nav sticky(desktop:top-30)와 맞춤
          <main className="w-full min-h-screen pt-30">
            <DesktopHeaderContainer />
            <MoveDetailView
              skillId={skillId}
              initialSkill={skill}
              initialPokemonList={pokemonList}
              totalCount={totalCount}
              selectedVersionGroupId={versionGroupId}
              versionGroups={versionGroups}
            />
            <DesktopFooterContainer />
          </main>
        )}
      </Providers>
      <script
        id="move-detail-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Fragment>
  )
}

export default MoveDetailVersionPage
