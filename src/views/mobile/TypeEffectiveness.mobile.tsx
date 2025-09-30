'use client'

import MobileTabBar from '~/components/MobileTabBar'
import FooterContainer from '~/container/mobile/footer/Footer.container'
import HeaderContainer from '~/container/mobile/header/Header.container'
import TypeEffectivenessContainer from '~/container/mobile/typeEffectiveness/TypeEffectiveness.container'

const TypeEffectivenessMobile = () => {
  return (
    <main className="w-full min-h-screen">
      <HeaderContainer />
      <section
        aria-labelledby="pokemon-type-effectiveness-calculator"
        className="w-full h-full px-5 relative"
      >
        <h1
          id="pokemon-type-effectiveness-calculator"
          className="visually-hidden"
        >
          타입 상성 계산기
        </h1>
        <TypeEffectivenessContainer />
      </section>
      <FooterContainer />
      <MobileTabBar />
    </main>
  )
}

export default TypeEffectivenessMobile
