'use client'

import Link from 'next/link'
import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsDetailContainer from '~/container/desktop/champions/ChampionsDetail.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'

interface ChampionsDetailDesktopProps {
  detail: ChampionsPokemonDetailFragment
}

const ChampionsDetailDesktop = ({ detail }: ChampionsDetailDesktopProps) => {
  return (
    <>
      <div className="h-40">
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <nav className="mb-6">
          <Link
            href="/champions/pokedex"
            className="text-sm text-gray-500 hover:text-primary-1"
          >
            &larr; 챔피언스 도감으로 돌아가기
          </Link>
        </nav>
        <ChampionsDetailContainer detail={detail} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsDetailDesktop
