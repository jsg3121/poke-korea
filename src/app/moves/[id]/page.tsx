import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import {
  GetPokemonSkillDetailDocument,
  GetPokemonsBySkillDocument,
} from '~/graphql/gqlGenerated'
import {
  GetPokemonSkillDetailQuery,
  GetPokemonSkillDetailQueryVariables,
  GetPokemonsBySkillQuery,
  GetPokemonsBySkillQueryVariables,
  PokemonLearnInfoEdge,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import { getRobotsConfig } from '~/module/metadata.module'
import MoveDetailDesktop from '~/views/desktop/moves/MoveDetail.desktop'
import MoveDetailMobile from '~/views/mobile/moves/MoveDetail.mobile'

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

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetPokemonSkillDetailQuery,
    GetPokemonSkillDetailQueryVariables
  >({
    query: GetPokemonSkillDetailDocument,
    variables: {
      filter: {
        skillId,
      },
    },
    fetchPolicy: 'network-only',
  })

  const skill = data?.getPokemonSkillDetail

  if (!skill) {
    return {
      title: '기술을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const title = `포켓몬 ${skill.nameKo} 기술 정보 - 포케 코리아`
  const description = `${skill.nameKo}${skill.description ? `: ${skill.description}` : ''} | 타입: ${skill.type || '없음'}, 위력: ${skill.power || '-'}, 명중률: ${skill.accuracy || '-'}`

  return {
    title,
    description,
    robots: getRobotsConfig(),
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/moves/${skillId}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${skill.nameKo} - 기술 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/moves/${skillId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
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

  const apolloClient = initializeApollo()

  // 기술 상세 정보 조회
  const { data: skillData } = await apolloClient.query<
    GetPokemonSkillDetailQuery,
    GetPokemonSkillDetailQueryVariables
  >({
    query: GetPokemonSkillDetailDocument,
    variables: {
      filter: {
        skillId,
      },
    },
    fetchPolicy: 'network-only',
  })

  const skill = skillData?.getPokemonSkillDetail

  if (!skill) {
    notFound()
  }

  // 이 기술을 배울 수 있는 포켓몬 목록 조회
  const { data: pokemonData } = await apolloClient.query<
    GetPokemonsBySkillQuery,
    GetPokemonsBySkillQueryVariables
  >({
    query: GetPokemonsBySkillDocument,
    variables: {
      input: {
        filter: {
          skillId,
        },
        pagination: {
          first: 30,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const pokemonList =
    pokemonData?.getPokemonsBySkill?.edges.map((edge: PokemonLearnInfoEdge) => {
      return edge.node
    }) || []

  // TODO: JSON-LD 추가 예정
  // const jsonLd = getMoveDetailJsonLd(skillId, skill.nameKo)

  return (
    <Fragment>
      {isMobile ? (
        <MoveDetailMobile
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
        />
      ) : (
        <MoveDetailDesktop
          skillId={skillId}
          initialSkill={skill}
          initialPokemonList={pokemonList}
          totalCount={pokemonData?.getPokemonsBySkill?.totalCount ?? 0}
        />
      )}
      {/* TODO: JSON-LD 추가 예정 */}
      {/* <script
        id="move-detail-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      /> */}
    </Fragment>
  )
}

export default MoveDetailPage
