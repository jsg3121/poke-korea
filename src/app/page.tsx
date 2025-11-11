import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import {
  GetDailyQuizPreviewDocument,
  GetDailyRandomPokemonDocument,
} from '~/graphql/gqlGenerated'
import {
  GetDailyQuizPreviewQuery,
  GetDailyQuizPreviewQueryVariables,
  GetDailyRandomPokemonQuery,
  GetDailyRandomPokemonQueryVariables,
} from '~/graphql/typeGenerated'
import { initializeApollo } from '~/module/apolloClient'
import HomeView from '~/views/Home.view'

export const revalidate = 3600 // 1시간

export const metadata: Metadata = {
  title: '포케 코리아 - 한국어 포켓몬 도감',
  description:
    '1025마리 포켓몬 도감, 타입 상성 계산기, 800개 이상 기술 정보, 300개 이상 특성 정보, 매일 새로운 포켓몬 퀴즈! 한국어로 만나는 가장 완벽한 포켓몬 백과사전.',
  authors: [{ name: '포케 코리아' }],
  creator: '포케 코리아',
  publisher: '포케 코리아',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/',
    title: '포케 코리아 - 한국어 포켓몬 도감',
    locale: 'ko_KR',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 한국어로 만나는 가장 완벽한 포켓몬 백과사전.',
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
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 한국어로 만나는 가장 완벽한 포켓몬 백과사전.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
  const { data: pokemonData } = await apolloClient.query<
    GetDailyRandomPokemonQuery,
    GetDailyRandomPokemonQueryVariables
  >({
    query: GetDailyRandomPokemonDocument,
    fetchPolicy: 'network-only',
  })

  // 매일 변경되는 퀴즈 3개 (타입, 특성, 실루엣) 가져오기
  const { data: quizData } = await apolloClient.query<
    GetDailyQuizPreviewQuery,
    GetDailyQuizPreviewQueryVariables
  >({
    query: GetDailyQuizPreviewDocument,
    fetchPolicy: 'network-only',
  })

  const dailyPokemon = pokemonData?.getDailyRandomPokemon?.pokemons || []
  const dailyQuiz = quizData?.getDailyQuizPreview

  return <HomeView dailyPokemon={dailyPokemon} dailyQuiz={dailyQuiz} />
}

export default HomePage
