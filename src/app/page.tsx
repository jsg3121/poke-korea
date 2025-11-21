import { Metadata } from 'next'
import { headers } from 'next/headers'
import { permanentRedirect } from 'next/navigation'
import { Fragment } from 'react'
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
import { detectUserAgent } from '~/module/device.module'
import HomeDesktop from '~/views/desktop/home/Home.desktop'
import HomeMobile from '~/views/mobile/home/Home.mobile'

export const revalidate = 3600 // 1시간

export const metadata: Metadata = {
  title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
  description:
    '1025마리 포켓몬 도감, 타입 상성 계산기, 800개 이상 기술 정보, 300개 이상 특성 정보, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/',
    title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
    locale: 'ko_KR',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '빠르고 정확한 포켓몬 도감 - 포케코리아',
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
    title: '빠르고 정확한 포켓몬 도감 - 포케코리아',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
    images: ['https://poke-korea.com/assets/image/ogImage.png'],
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
  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)
  const apolloClient = initializeApollo()

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

  // JSON-LD 구조화된 데이터
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '포케 코리아',
    alternateName: '포케코리아',
    url: 'https://poke-korea.com',
    description:
      '1025마리 포켓몬 도감, 타입 상성 계산기, 기술 도감, 특성 도감, 매일 새로운 포켓몬 퀴즈! 빠르고 정확한 포켓몬 백과사전.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://poke-korea.com/list?name={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'ko-KR',
  }

  return (
    <Fragment>
      {isMobile ? (
        <HomeMobile dailyPokemon={dailyPokemon} dailyQuiz={dailyQuiz} />
      ) : (
        <HomeDesktop dailyPokemon={dailyPokemon} dailyQuiz={dailyQuiz} />
      )}
      <script
        id="ability-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />
    </Fragment>
  )
}

export default HomePage
