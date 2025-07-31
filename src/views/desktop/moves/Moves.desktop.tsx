'use client'
import HeaderContainer from '~/container/desktop/header/Header.container'
import MovesListContainer from '~/container/desktop/moves/MovesList.container'

const MovesDesktop = () => {
  return (
    <main className="w-full h-full pt-30">
      <HeaderContainer />
      <section className="max-w-[1280px] mx-auto">
        <header className="w-full h-32 text-center border-b border-solid border-primary-4 pb-4">
          <h1 className="h-20 text-[2.5rem] text-center leading-[5rem] text-primary-4 font-[700]">
            포켓몬 기술 도감
          </h1>
          <p className="w-full h-8 text-center leading-8 text-primary-3">
            포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요. 타입, 위력,
            PP, 설명을 확인하고 검색할 수 있습니다.
          </p>
        </header>
        <MovesListContainer />
      </section>
    </main>
  )
}

export default MovesDesktop
