import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getMoveDetailGenerationJsonLd } from '~/constants/movesJsonLd'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import MoveDetailDesktop from '~/views/desktop/moves/MoveDetail.desktop'
import MoveDetailMobile from '~/views/mobile/moves/MoveDetail.mobile'
import { fetchMoveDetailQueries } from '../../_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from '../../_fetch/moveDetailMetadata.fetch'
import { generateMoveDetailGenerationMetadata } from '../../_metadata/generateMoveDetailMetadata'

export const revalidate = 31536000 // 1년

type PageProps = {
  params: Promise<{
    id: string
    generationId: string
  }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id, generationId } = await params
  const skillId = parseInt(id, 10)
  const generation = parseInt(generationId, 10) ?? 9

  if (isNaN(skillId) || isNaN(generation) || generation < 1 || generation > 9) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const { skill } = await fetchMoveDetailMetadata({
    skillId,
    generationId: generation,
  })

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const generationData = skill.generations.find(
    (gen) => gen.generationId === generation,
  )

  if (!generationData) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  return generateMoveDetailGenerationMetadata({
    skillId,
    nameKo: skill.nameKo,
    generation,
    description: generationData.description,
    type: generationData.type,
    power: generationData.power,
    accuracy: generationData.accuracy,
    damageType: generationData.damageType,
  })
}

const MoveDetailGenerationPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id, generationId } = await params
  const skillId = parseInt(id, 10)
  const generation = parseInt(generationId, 10) ?? 9

  if (isNaN(skillId) || isNaN(generation) || generation < 1 || generation > 9) {
    notFound()
  }

  const { skill, pokemonData } = await fetchMoveDetailQueries({
    skillId,
    generationId: generation,
  })

  if (!skill) {
    notFound()
  }

  // 해당 세대의 기술 정보가 있는지 확인
  const generationData = skill.generations.find(
    (gen) => gen.generationId === generation,
  )

  if (!generationData) {
    notFound()
  }

  const pokemonList =
    pokemonData?.getPokemonsBySkill?.edges.map(
      (edge: PokemonLearnInfoEdge) => edge.node,
    ) || []

  const jsonLd = getMoveDetailGenerationJsonLd(
    skillId,
    skill.nameKo,
    generation,
  )

  return (
    <Fragment>
      {isMobile ? (
        <MoveDetailMobile
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
          selectedGeneration={generation}
        />
      ) : (
        <MoveDetailDesktop
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
          selectedGeneration={generation}
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

export default MoveDetailGenerationPage
