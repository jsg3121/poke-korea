import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { getMoveDetailGenerationJsonLd } from '~/constants/movesJsonLd'
import { PokemonLearnInfoEdge } from '~/graphql/typeGenerated'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import { getDamageTypeKorean } from '~/utils/skill.util'
import MoveDetailDesktop from '~/views/desktop/moves/MoveDetail.desktop'
import MoveDetailMobile from '~/views/mobile/moves/MoveDetail.mobile'
import { fetchMoveDetailQueries } from '../../_fetch/moveDetail.fetch'
import { fetchMoveDetailMetadata } from '../../_fetch/moveDetailMetadata.fetch'

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

  // 해당 세대의 기술 정보 찾기
  const generationData = skill.generations.find(
    (gen) => gen.generationId === generation,
  )

  if (!generationData) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const damageTypeKo = getDamageTypeKorean(generationData.damageType)
  const title = `${skill.nameKo} (${generation}세대) - ${[generationData.type, damageTypeKo].filter(Boolean).join(' ')} 기술 (위력 ${generationData.power || '-'} · 명중 ${generationData.accuracy || '-'}) | 포켓몬 기술 도감`
  const description = `${skill.nameKo} ${generation}세대 기술 정보${generationData.description ? `: ${generationData.description}` : ''} | 타입: ${generationData.type || '없음'}, 위력: ${generationData.power || '-'}, 명중률: ${generationData.accuracy || '-'}. 세대별 변경사항과 배울 수 있는 포켓몬 목록을 확인하세요.`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/moves/${skillId}/generation/${generation}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${skill.nameKo} - ${generation}세대 기술 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/moves/${skillId}/generation/${generation}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
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
