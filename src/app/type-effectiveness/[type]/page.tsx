import { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { Fragment } from 'react'
import MobileTabBar from '~/components/MobileTabBar'
import {
  getTypeDetailFaqJsonLd,
  getTypeDetailWebPageJsonLd,
} from '~/constants/typeEffectivenessJsonLd'
import DesktopFooterContainer from '~/container/desktop/footer/Footer.container'
import DesktopHeaderContainer from '~/container/desktop/header/Header.container'
import MobileFooterContainer from '~/container/mobile/footer/Footer.container'
import MobileHeaderContainer from '~/container/mobile/header/Header.container'
import { detectUserAgent } from '~/module/device.module'
import { parseTypeSlug } from '~/module/typeParams.module'
import TypeEffectivenessDetailView from '~/views/typeEffectivenessDetail/TypeEffectivenessDetail.view'
import { fetchTypeDetailData } from './_fetch/typeDetail.fetch'
import { generateTypeDetailMetadata } from './_metadata/generateTypeDetailMetadata'

/**
 * 타입별 상성 상세 페이지(`/type-effectiveness/[type]`) — 18개 타입.
 *
 * ## 이 페이지가 존재하는 이유
 *
 * `독타입 약점`·`물타입 상성` 같은 타입별 롱테일 검색어에서 노출이 75.6% 빠졌고
 * (spec §26.8.2), 메인 계산기 한 장으로는 그 검색 의도를 되받을 수 없다. 검색으로
 * 들어온 사용자에게 **약점을 즉답으로 주는 것**이 이 페이지의 존재 이유다.
 *
 * ## 동적 렌더 — generateStaticParams를 쓰지 않는다
 *
 * spec §16은 18개 정적 생성을 권장하나, 이 코드베이스는 `headers()` UA 감지로
 * 크롬(헤더/푸터/탭바)을 고르기 때문에 구조적으로 정적 생성이 불가능하다. UX-007/
 * 008/009에서 실효 없는 `revalidate` 선언을 "거짓 신호"로 판단해 제거한 이력이
 * 있어, 같은 선언을 다시 만들지 않는다(ability·moves·list·type-effectiveness와 동일).
 * 상성 데이터가 전부 정적 상수라 응답 자체는 빠르다. 정적 생성 재검토는 크롬 통합
 * 이후 과제다.
 *
 * ## 슬러그 가드를 두 번 두는 이유
 *
 * `generateMetadata`와 페이지 컴포넌트는 **독립 실행**된다. 한쪽만 막으면 다른
 * 쪽이 잘못된 슬러그로 진입한다. 반환값은 서로 다르다 — 메타는 오류 title,
 * 페이지는 `notFound()`(moves·ability와 동일 패턴).
 */

interface TypeDetailPageProps {
  params: Promise<{ type: string }>
}

export const generateMetadata = async ({
  params,
}: TypeDetailPageProps): Promise<Metadata> => {
  const { type: slug } = await params
  const pokemonType = parseTypeSlug(slug)

  if (!pokemonType) {
    return { title: '타입을 찾을 수 없습니다' }
  }

  return generateTypeDetailMetadata(pokemonType)
}

const TypeDetailPage = async ({ params }: TypeDetailPageProps) => {
  const { type: slug } = await params
  const pokemonType = parseTypeSlug(slug)

  if (!pokemonType) {
    notFound()
  }

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const isMobile = detectUserAgent(userAgent)

  // 상성·문안은 정적 상수라 조회가 없다. 포켓몬 6종·챔피언스 티어만 서버에서
  // 가져오며, 실패해도 해당 블록만 비고 페이지는 정상 렌더된다.
  const { pokemons, pokemonTotalCount, champions } =
    await fetchTypeDetailData(pokemonType)

  const webPageJsonLd = getTypeDetailWebPageJsonLd(pokemonType)
  const faqJsonLd = getTypeDetailFaqJsonLd(pokemonType)

  return (
    <Fragment>
      {/* 콘텐츠는 반응형 단일(ADR-0007). UA 분기는 전역 크롬 선택으로만 남는다. */}
      {isMobile ? (
        <main className="w-full min-h-screen">
          <MobileHeaderContainer />
          <TypeEffectivenessDetailView
            pokemonType={pokemonType}
            pokemons={pokemons}
            pokemonTotalCount={pokemonTotalCount}
            champions={champions}
          />
          <MobileFooterContainer />
          <MobileTabBar />
        </main>
      ) : (
        // pt-30(120px) = 데스크톱 fixed 헤더 실높이
        <main className="w-full min-h-screen pt-30">
          <DesktopHeaderContainer />
          <TypeEffectivenessDetailView
            pokemonType={pokemonType}
            pokemons={pokemons}
            pokemonTotalCount={pokemonTotalCount}
            champions={champions}
          />
          <DesktopFooterContainer />
        </main>
      )}
      <script
        id="type-detail-webpage-jsonLd"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      {/* FAQ가 없는 타입은 script 자체를 렌더하지 않는다 — 빈 FAQPage는
          구조화 데이터 오류로 잡힌다 */}
      {faqJsonLd && (
        <script
          id="type-detail-faq-jsonLd"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
    </Fragment>
  )
}

export default TypeDetailPage
