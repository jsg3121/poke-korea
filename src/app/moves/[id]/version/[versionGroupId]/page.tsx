import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getMoveDetailVersionJsonLd } from '~/constants/movesJsonLd'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import MoveDetailDesktop from '~/views/desktop/moves/MoveDetail.desktop'
import MoveDetailMobile from '~/views/mobile/moves/MoveDetail.mobile'
import { fetchMoveDetailQueries } from '../../_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from '../../_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailVersionMetadata } from '../../_metadata/generateMoveDetailMetadata'

export const revalidate = 31536000 // 1년

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
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const { skill } = await fetchMoveDetailMetadata({
    skillId,
    versionGroupId,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const versionData = skill.generations.find(
    (gen) => gen.versionGroupId === versionGroupId,
  )

  if (!versionData) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  return generateMoveDetailVersionMetadata({
    skillId,
    nameKo: skill.nameKo,
    versionGroupId,
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

  const { skill, pokemonData, versionGroups } = await fetchMoveDetailQueries({
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

  const jsonLd = getMoveDetailVersionJsonLd(
    skillId,
    skill.nameKo,
    versionGroupId,
  )

  return (
    <Fragment>
      {isMobile ? (
        <MoveDetailMobile
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
          selectedVersionGroupId={versionGroupId}
          versionGroups={versionGroups}
        />
      ) : (
        <MoveDetailDesktop
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
          selectedVersionGroupId={versionGroupId}
          versionGroups={versionGroups}
        />
      )}
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
