import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getMoveDetailJsonLd } from '~/constants/movesJsonLd'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import MoveDetailDesktop from '~/views/desktop/moves/MoveDetail.desktop'
import MoveDetailMobile from '~/views/mobile/moves/MoveDetail.mobile'
import { fetchMoveDetailQueries } from './_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from './_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailMetadata } from './_metadata/generateMoveDetailMetadata'

export const revalidate = 31536000 // 1년

type PageProps = {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const skillId = parseInt(id, 10)

  if (isNaN(skillId)) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const { skill } = await fetchMoveDetailMetadata({
    skillId,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  return generateMoveDetailMetadata({
    skillId,
    nameKo: skill.nameKo,
    description: skill.description,
    type: skill.type,
    power: skill.power,
    accuracy: skill.accuracy,
    damageType: skill.damageType,
  })
}

const MoveDetailPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id } = await params
  const skillId = parseInt(id, 10)

  if (isNaN(skillId)) {
    notFound()
  }

  const { skill, pokemonData, versionGroups } = await fetchMoveDetailQueries({
    skillId,
  })

  if (!skill) {
    notFound()
  }

  const pokemonList =
    pokemonData?.getPokemonsBySkill?.edges.map(
      (edge: PokemonLearnInfoEdge) => edge.node,
    ) || []

  const jsonLd = getMoveDetailJsonLd(skillId, skill.nameKo)

  return (
    <Fragment>
      {isMobile ? (
        <MoveDetailMobile
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
          versionGroups={versionGroups}
        />
      ) : (
        <MoveDetailDesktop
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
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

export default MoveDetailPage
