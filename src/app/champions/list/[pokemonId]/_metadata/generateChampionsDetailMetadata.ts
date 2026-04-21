import { Metadata } from 'next'
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import {
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_BASE = 'https://image.poke-korea.com/og-images'

function getOgImageUrls(
  pokemonNumber: number,
  formType: string,
  formIndex: number,
) {
  const normalizedFormType = formType.toLowerCase()

  const folder =
    normalizedFormType === 'base' || normalizedFormType === 'normal'
      ? formIndex > 0
        ? 'form'
        : 'default'
      : normalizedFormType

  const fileId =
    folder === 'default' || folder === 'gigantamax'
      ? `${pokemonNumber}`
      : `${pokemonNumber}-${formIndex}`

  return {
    large: `${OG_IMAGE_BASE}/${folder}/${fileId}-large.png`,
    medium: `${OG_IMAGE_BASE}/${folder}/${fileId}-medium.png`,
  }
}

export const generateChampionsDetailMetadata = async (
  pokemonId: number,
): Promise<Metadata> => {
  if (isNaN(pokemonId) || pokemonId <= 0) {
    return {
      title: '포켓몬을 찾을 수 없습니다 | 포케코리아',
      description: '요청하신 포켓몬 정보를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const apolloClient = initializeApollo()

  const { data } = await apolloClient.query<
    GetChampionsPokemonDetailQuery,
    GetChampionsPokemonDetailQueryVariables
  >({
    query: GetChampionsPokemonDetailDocument,
    variables: { externalDexId: pokemonId },
  })

  const pokemon = data?.getChampionsPokemonDetail?.pokemon

  if (!pokemon) {
    return {
      title: '포켓몬을 찾을 수 없습니다 | 포케코리아',
      description: '요청하신 포켓몬 정보를 찾을 수 없습니다.',
      robots: {
        index: false,
        follow: true,
      },
    }
  }

  const title = `${pokemon.name} 챔피언스 정보 | 포케코리아`
  const description = `${pokemon.name}의 포켓몬 챔피언스 사용률, 인기 기술, 아이템, 특성, 추천 파트너 정보를 확인하세요.`

  const ogImages = getOgImageUrls(
    pokemon.pokemonNumber,
    pokemon.formType ?? 'normal',
    pokemon.formIndex ?? 0,
  )

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_URL}/champions/list/${pokemonId}`,
      title,
      locale: 'ko_KR',
      description,
      images: [
        {
          url: ogImages.large,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
        {
          url: ogImages.medium,
          width: 800,
          height: 800,
          alt: title,
          type: 'image/png',
        },
      ],
      siteName: SITE_NAME,
    },
    alternates: {
      canonical: `${SITE_URL}/champions/list/${pokemonId}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImages.large],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
      },
    },
  }
}
