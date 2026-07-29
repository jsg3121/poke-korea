'use client'

// 'use client'인 이유: SVGR 웹팩 룰(issuer 조건)이 App Router 서버 컴포넌트
// 그래프에서 동작하지 않아 SVG import가 빌드 실패한다. 같은 아이콘을 쓰는
// MobileTabBar와 동일하게 클라이언트 경계로 둔다(클라이언트 컴포넌트도 SSR되므로
// 허브 링크는 초기 HTML에 포함 — SEO 영향 없음).
import { ReactNode } from 'react'
import AbilityIcon from '~/assets/icons/ability.svg'
import ChampionsIcon from '~/assets/icons/champions.svg'
import MovesListIcon from '~/assets/icons/movesList.svg'
import PokeballIcon from '~/assets/icons/pokeball.svg'
import QuizIcon from '~/assets/icons/quiz.svg'
import TypeEffectivenessIcon from '~/assets/icons/typeEffectiveness.svg'
import HubLinkCardComponent from '~/components/hubLinkCard/HubLinkCard.component'
import SectionHeadingComponent from '~/components/SectionHeading.component'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'

/**
 * 홈 허브 링크 섹션 — 콘텐츠 축 6개(도감·타입상성·기술·특성·챔피언스·퀴즈) 진입 타일
 * (신설, UX-003 §3 섹션 2).
 *
 * 홈 본문에 서술형 앵커의 내부 링크 허브 블록을 만든다: ①모바일 사용자 70%가 홈
 * 전체를 훑으며 서비스 범위를 판단하므로 카테고리를 접힌 메뉴 뒤에 숨기지 않고 시각
 * 노출하고(RES-001 ②), ②홈의 링크 권위를 각 허브 페이지로 분배한다(시사점 2).
 *
 * 정적 콘텐츠라 항상 렌더 — 동적 첫 섹션(챔피언스)이 비어도 이 섹션이 폴드 콘텐츠를
 * 보장한다(광고를 이 섹션 뒤에 두는 근거, UX-003 §5). 아이콘은 MobileTabBar와 같은
 * SVGR 자산 재사용.
 */

interface HubLink {
  href: string
  title: string
  description: string
  icon: ReactNode
}

const HUB_LINKS: HubLink[] = [
  {
    href: '/list',
    title: '포켓몬 도감',
    description: '1025마리 포켓몬 정보 보기',
    icon: <PokeballIcon />,
  },
  {
    href: '/type-effectiveness',
    title: '타입 상성',
    description: '타입 상성표·배틀 계산기',
    icon: <TypeEffectivenessIcon />,
  },
  {
    href: '/moves',
    title: '기술 도감',
    description: '기술 위력·명중률 찾아보기',
    icon: <MovesListIcon />,
  },
  {
    href: '/ability',
    title: '특성 도감',
    description: '특성 효과 한눈에 보기',
    icon: <AbilityIcon />,
  },
  {
    href: `/champions/${CHAMPIONS_DEFAULT_FORMAT_SLUG}`,
    title: '챔피언스',
    description: '대회 메타·티어 리스트',
    icon: <ChampionsIcon />,
  },
  {
    href: '/quiz',
    title: '포켓몬 퀴즈',
    description: '매일 새로운 퀴즈 풀기',
    icon: <QuizIcon />,
  },
]

const HomeHubLinksContainer = () => {
  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="home-hub-links-heading"
    >
      <SectionHeadingComponent id="home-hub-links-heading">
        무엇을 찾고 계신가요?
      </SectionHeadingComponent>

      <div className="mt-4 grid grid-cols-2 gap-4 desktop:grid-cols-3">
        {HUB_LINKS.map((hub) => (
          <HubLinkCardComponent
            key={hub.href}
            href={hub.href}
            title={hub.title}
            description={hub.description}
            icon={hub.icon}
          />
        ))}
      </div>
    </section>
  )
}

export default HomeHubLinksContainer
