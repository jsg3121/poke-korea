import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import { GetPokemonByAbilityDocument } from '~/graphql/gqlGenerated'
import {
  GetPokemonByAbilityQuery,
  GetPokemonByAbilityQueryVariables,
  PokemonByAbilityEdge,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { detectUserAgent } from '~/module/device.module'
import AbilityDetailDesktop from '~/views/desktop/ability/AbilityDetail.desktop'
import AbilityDetailMobile from '~/views/mobile/ability/AbilityDetail.mobile'

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
  const abilityId = parseInt(id, 10)

  if (isNaN(abilityId)) {
    return {
      title: '특성을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetPokemonByAbilityQuery,
    GetPokemonByAbilityQueryVariables
  >({
    query: GetPokemonByAbilityDocument,
    variables: {
      input: {
        filter: {
          abilityId,
          includeHidden: true,
        },
        pagination: {
          first: 1,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const ability = data?.getPokemonByAbility?.ability

  if (!ability) {
    return {
      title: '특성을 찾을 수 없습니다 - 포케 코리아',
    }
  }

  const title = `특성 정보 ${ability.name} - 포케 코리아`
  const description = `${ability.name}: ${ability.description} | 이 특성을 가진 포켓몬은 누구일까요?`
  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `https://poke-korea.com/ability/${abilityId}`,
      title,
      description,
      locale: 'ko_KR',
      images: [
        {
          url: 'https://poke-korea.com/assets/image/ogImage.png',
          width: 1200,
          height: 630,
          alt: `${ability.name} - 특성 도감`,
          type: 'image/png',
        },
      ],
      siteName: '포케 코리아',
    },
    alternates: {
      canonical: `https://poke-korea.com/ability/${abilityId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: `${ability.name}: ${ability.description}`,
      images: ['https://poke-korea.com/assets/image/ogImage.png'],
    },
  }
}

const AbilityDetailPage = async ({ params }: PageProps) => {
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  const { id } = await params
  const abilityId = parseInt(id, 10)

  if (isNaN(abilityId)) {
    notFound()
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetPokemonByAbilityQuery,
    GetPokemonByAbilityQueryVariables
  >({
    query: GetPokemonByAbilityDocument,
    variables: {
      input: {
        filter: {
          abilityId,
          includeHidden: true,
        },
        pagination: {
          first: 20,
        },
      },
    },
    fetchPolicy: 'network-only',
  })

  const ability = data?.getPokemonByAbility?.ability
  const pokemonList =
    data?.getPokemonByAbility?.edges.map((edge: PokemonByAbilityEdge) => {
      return edge.node
    }) || []

  if (!ability) {
    notFound()
  }

  return (
    <Fragment>
      {isMobile ? (
        <AbilityDetailMobile
          abilityId={abilityId}
          initialAbility={ability}
          initialPokemon={pokemonList}
          totalCount={data.getPokemonByAbility.totalCount ?? 0}
        />
      ) : (
        <AbilityDetailDesktop
          abilityId={abilityId}
          initialAbility={ability}
          initialPokemon={pokemonList}
          totalCount={data.getPokemonByAbility.totalCount ?? 0}
        />
      )}
    </Fragment>
  )
}

export default AbilityDetailPage
