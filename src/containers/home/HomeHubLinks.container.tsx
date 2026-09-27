'use client'

import { ReactNode } from 'react'

import AbilityIcon from '~/assets/icons/ability.svg'
import ChampionsIcon from '~/assets/icons/champions.svg'
import MovesListIcon from '~/assets/icons/movesList.svg'
import PokeballIcon from '~/assets/icons/pokeball.svg'
import QuizIcon from '~/assets/icons/quiz.svg'
import TypeEffectivenessIcon from '~/assets/icons/typeEffectiveness.svg'
import { CHAMPIONS_DEFAULT_FORMAT_SLUG } from '~/utils/championsFormat.util'
import HubLinkCard from '~/components/hubLinkCard/HubLinkCard.component'
import SectionHeading from '~/components/SectionHeading.component'

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

const HomeHubLinks = () => {
  return (
    <section
      className="w-full px-4 desktop:px-8"
      aria-labelledby="home-hub-links-heading"
    >
      <SectionHeading id="home-hub-links-heading">
        무엇을 찾고 계신가요?
      </SectionHeading>

      <div className="mt-4 grid grid-cols-2 gap-4 desktop:grid-cols-3">
        {HUB_LINKS.map((hub) => (
          <HubLinkCard
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

export default HomeHubLinks
