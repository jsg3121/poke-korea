import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import HomeView from '~/views/Home.view'
import { initializeApollo } from '~/module/apolloClient'
import { GetDailyRandomPokemonDocument } from '~/graphql/gqlGenerated'
import {
  GetDailyRandomPokemonQuery,
  GetDailyRandomPokemonQueryVariables,
} from '~/graphql/typeGenerated'

export const revalidate = 3600 // 1시간

export const metadata: Metadata = {
  title: '포케 코리아 - 한국어 포켓몬 도감',
  description: `
    포케 코리아에서 포켓몬의 모든 정보를 확인하세요!
    포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 포켓몬 퀴즈까지!
    언제, 어디서든 포켓몬 정보를 빠르고 편리하게 확인할 수 있습니다.
  `,
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/',
    title: '포케 코리아 - 한국어 포켓몬 도감',
    locale: 'ko_KR',
    description:
      '포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 포켓몬 퀴즈까지! 포켓몬의 모든 정보를 한곳에서 확인하세요.',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포케 코리아 - 한국어 포켓몬 도감',
        type: 'image/png',
      },
    ],
    siteName: '포케 코리아',
  },
  alternates: {
    canonical: 'https://poke-korea.com/',
  },
  twitter: {
    card: 'summary_large_image',
    title: '포케 코리아 - 한국어 포켓몬 도감',
    description:
      '포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 포켓몬 퀴즈까지! 포켓몬의 모든 정보를 한곳에서 확인하세요.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
  },
}

type searchParamsKey =
  | 'name'
  | 'type'
  | 'isMega'
  | 'isRegion'
  | 'isEvolution'
  | 'generation'

type PageProps = {
  searchParams: Promise<{
    [key in searchParamsKey]: string
  }>
}

const HomePage = async ({ searchParams }: PageProps) => {
  const params = await searchParams
  const hasFilters = Object.keys(params).length > 0

  // 필터 쿼리 파라미터가 있으면 /list로 308 영구 리다이렉트 (SEO)
  // ⚠️ 중요: 이 리다이렉트는 최소 1년 이상 유지해야 합니다!
  // 배포일: 2025-XX-XX
  // 제거 예정일: 2026-XX-XX 이후
  if (hasFilters) {
    const queryString = new URLSearchParams(params).toString()
    permanentRedirect(`/list?${queryString}`)
  }

  const apolloClient = initializeApollo()

  // 매일 변경되는 랜덤 포켓몬 10마리 가져오기
  const { data } = await apolloClient.query<
    GetDailyRandomPokemonQuery,
    GetDailyRandomPokemonQueryVariables
  >({
    query: GetDailyRandomPokemonDocument,
    fetchPolicy: 'network-only',
  })

  const dailyPokemon = data?.getDailyRandomPokemon?.pokemons || []

  return <HomeView dailyPokemon={dailyPokemon} />
}

export default HomePage
