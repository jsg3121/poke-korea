'use client'

import FooterContainer from '~/container/desktop/footer/Footer.container'
import HeaderContainer from '~/container/desktop/header/Header.container'
import TypeEffectivenessContainer from '~/container/desktop/typeEffectiveness/TypeEffectiveness.container'

const TypeEffectivenessDesktop = () => {
  return (
    <main className="w-full min-h-screen pt-40">
      <HeaderContainer />
      <section
        aria-labelledby="pokemon-type-effectiveness-calculator"
        className="w-full max-w-[1280px] h-full mx-auto relative mt-6"
      >
        <h1 id="pokemon-type-effectiveness-calculator" className="sr-only">
          타입 상성 계산기
        </h1>
        <TypeEffectivenessContainer />
      </section>
      <FooterContainer />
    </main>
  )
}

export default TypeEffectivenessDesktop
