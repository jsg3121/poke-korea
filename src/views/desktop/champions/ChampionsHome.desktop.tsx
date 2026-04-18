'use client'

import DesktopListTopBanner from '~/components/adSlot/DesktopListTopBanner'
import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsHomeContainer from '~/container/desktop/champions/ChampionsHome.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'

interface ChampionsHomeDesktopProps {
  topPokemons: ChampionsMetaSummaryFragment[]
}

const ChampionsHomeDesktop = ({ topPokemons }: ChampionsHomeDesktopProps) => {
  return (
    <>
      <div className="h-40">
        <HeaderContainer />
      </div>
      <DesktopListTopBanner />
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <ChampionsHomeContainer topPokemons={topPokemons} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsHomeDesktop
