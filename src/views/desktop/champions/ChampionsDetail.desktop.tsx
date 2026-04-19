'use client'

import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import ChampionsSubNav from '~/components/champions/ChampionsSubNav.component'
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
      <ChampionsSubNav />
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <ChampionsDetailContainer detail={detail} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsDetailDesktop
