import { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'

export const revalidate = 3600 // 1시간

export const metadata: Metadata = {
  title: '포켓몬의 모든 정보 포케 코리아',
  description: `
    언제, 어디서든, 포켓몬의 정보를 빠르고 편리하게 확인하실 수 있습니다.
    카드형식을 통해 포켓몬의 능력치를 확인할 수 있고 타입 또는 진화 여부 등으로 원하는 포켓몬을 빠르게 찾아보세요.
    간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색해 확인해보세요.
  `,
  openGraph: {
    type: 'website',
    url: 'https://poke-korea.com/',
    title: '포켓몬의 모든 정보 포케 코리아',
    locale: 'ko_KR',
    description:
      '간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색하고 확인해보세요.',
    images: [
      {
        url: 'https://poke-korea.com/assets/image/ogImage.png',
        width: 1200,
        height: 630,
        alt: '포켓몬의 모든 정보 포케 코리아',
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
    title: '포켓몬의 모든 정보 포케 코리아',
    description:
      '간단한 포켓몬 정보부터 특정 포켓몬의 자세한 정보까지 검색하고 확인해보세요.',
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

  // TODO: 새로운 홈 화면 컴포넌트로 교체 예정
  return (
    <main className="w-full min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">포케 코리아</h1>
        <p className="text-lg mb-8">새로운 홈 화면 개발 중...</p>
        <a
          href="/list"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          포켓몬 도감 보러가기
        </a>
      </div>
    </main>
  )
}

export default HomePage
