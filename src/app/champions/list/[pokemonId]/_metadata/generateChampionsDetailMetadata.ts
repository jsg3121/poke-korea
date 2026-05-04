import { Metadata } from 'next'
import {
  ChampionsPokemonDetailFragment,
  GetChampionsPokemonDetailQuery,
  GetChampionsPokemonDetailQueryVariables,
  PokemonType,
} from '~/graphql/typeGenerated'
import { GetChampionsPokemonDetailDocument } from '~/graphql/gqlGenerated'
import { initializeApollo } from '~/module/apolloClient'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const SITE_NAME = '포케 코리아'
const SITE_URL = 'https://poke-korea.com'
const OG_IMAGE_BASE = 'https://image.poke-korea.com/og-images'

// fragment 기반 타입 (응답에 실제 포함되는 필드만 사용)
type DetailPokemon = ChampionsPokemonDetailFragment['pokemon']
type DetailMeta = ChampionsPokemonDetailFragment['meta']
type DetailStats = DetailPokemon['stats']

/**
 * 폼/리전 정보를 한국어 표기로 변환
 * - region이 있으면 "알로라" 등 리전명 우선 (formName보다 사용자 친숙도 높음)
 * - formName만 있으면 폼명 사용 (메가, 거다이맥스 등)
 * - 둘 다 없으면 빈 문자열
 */
const getFormSuffix = (pokemon: DetailPokemon): string => {
  if (pokemon.region) return pokemon.region
  if (pokemon.formName) return pokemon.formName
  return ''
}

/** 포켓몬 타입을 한국어로 변환 (예: ['FIRE', 'DRAGON'] → '불꽃·드래곤') */
const getKoreanTypesText = (types: Array<PokemonType>): string =>
  types.map((type) => PokemonTypes[type]).join('·')

/**
 * 6스탯 중 상위 1~2개를 한국어 라벨과 값으로 반환
 * description 다양화 시 포켓몬마다 강조 포인트가 달라지도록 함
 */
const getStatHighlights = (stats: DetailStats): string => {
  const statEntries: Array<{ label: string; value: number }> = [
    { label: 'HP', value: stats.hp },
    { label: '공격', value: stats.attack },
    { label: '방어', value: stats.defense },
    { label: '특수공격', value: stats.specialAttack },
    { label: '특수방어', value: stats.specialDefense },
    { label: '스피드', value: stats.speed },
  ]
  const sorted = [...statEntries].sort((a, b) => b.value - a.value)
  return `${sorted[0].label} ${sorted[0].value}, ${sorted[1].label} ${sorted[1].value}`
}

/**
 * 메타 통계를 활용 가능한 경우 인기 기술/특성을 한 줄로 반환
 * topMoves/topAbilities가 비어있으면 null 반환 → 호출 측에서 폴백 사용
 */
const getMetaHighlight = (meta: DetailMeta): string | null => {
  if (!meta) return null
  const topMove = meta.topMoves?.[0]?.name
  const topAbility = meta.topAbilities?.[0]?.name
  if (!topMove && !topAbility) return null
  if (topMove && topAbility) return `인기 기술 ${topMove}, ${topAbility} 특성`
  return topMove ? `인기 기술 ${topMove}` : `${topAbility} 특성`
}

/**
 * 챔피언스 상세 페이지 title 생성
 * 폼/리전이 있으면 괄호로 명시하여 동일 포켓몬 폼 간 차별화
 */
const buildDetailTitle = (pokemon: DetailPokemon): string => {
  const suffix = getFormSuffix(pokemon)
  const namePart = suffix ? `${pokemon.name} (${suffix})` : pokemon.name
  return `${namePart} 챔피언스 도감 - 스탯·기술·특성 | 포케코리아`
}

/**
 * 챔피언스 상세 페이지 description 생성
 * - 메타 데이터(topMoves, topAbilities)가 있으면 활용
 * - 없으면 스탯 하이라이트로 폴백
 * - tier 정보는 사용하지 않음 (공식 티어가 아닌 내부 분류이므로 description에 명시 시 사용자 오인 가능)
 * - formName 중 메가/거다이맥스는 챔피언스 데이터에 존재하지 않음 (`ChampionsFormType`에 BASE/NORMAL/REGION만 정의됨) → 노말폼·리전폼만 자연 노출
 * - 80자 이내 목표 (네이버 가이드라인)
 */
const buildDetailDescription = (
  pokemon: DetailPokemon,
  meta: DetailMeta,
): string => {
  const suffix = getFormSuffix(pokemon)
  const formText = suffix ? ` ${suffix}` : ''
  const typesText = getKoreanTypesText(pokemon.types)
  const metaHighlight = getMetaHighlight(meta)

  if (metaHighlight) {
    return `${typesText} 타입 ${pokemon.name}${formText} 챔피언스 정보. ${metaHighlight}, 추천 파트너·스탯 확인.`
  }

  const statHighlight = getStatHighlights(pokemon.stats)
  return `${typesText} 타입 ${pokemon.name}${formText} 챔피언스 정보. ${statHighlight} 등 스탯·기술·특성 확인.`
}

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

  const detail = data?.getChampionsPokemonDetail
  const pokemon = detail?.pokemon

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

  const title = buildDetailTitle(pokemon)
  const description = buildDetailDescription(pokemon, detail?.meta)

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
