'use client'

import HeaderContainer from '~/container/desktop/header/Header.container'
import ChampionsDetailContainer from '~/container/desktop/champions/ChampionsDetail.container'
import FooterContainer from '~/container/desktop/footer/Footer.container'
import { ChampionsPokemonDetailFragment } from '~/graphql/typeGenerated'
import { ChampionsFormatSlug } from '~/utils/championsFormat.util'

interface ChampionsDetailDesktopProps {
  detail: ChampionsPokemonDetailFragment
  formatSlug: ChampionsFormatSlug
}

const ChampionsDetailDesktop = ({
  detail,
  formatSlug,
}: ChampionsDetailDesktopProps) => {
  return (
    <>
      <div className="h-32">
        <HeaderContainer />
      </div>
      <section className="w-full max-w-[1280px] min-h-dvh mx-auto py-12 px-5">
        <ChampionsDetailContainer detail={detail} formatSlug={formatSlug} />
      </section>
      <FooterContainer />
    </>
  )
}

export default ChampionsDetailDesktop
