'use client'

import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'
import TypeEffectivenessContainer from '~/container/desktop/typeEffectiveness/TypeEffectiveness.container'

const TypeEffectivenessDesktop = () => {
  return (
    <main className="w-full min-h-screen">
      <HeaderContainer />
      <section
        aria-labelledby="pokemon-type-effectiveness-calculator"
        className="w-full max-w-[1280px] h-full px-5 mx-auto relative"
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
    </main>
  )
}

export default TypeEffectivenessDesktop
