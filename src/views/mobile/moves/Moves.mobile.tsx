'use client'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MovesListContainer from '~/container/mobile/moves/MovesList.container'

const MovesMobile = () => {
  return (
    <main>
      <HeaderContainer />
      <section className="w-full">
        <header className="w-full h-24 text-center border-b border-solid border-primary-4 pb-4">
          <h1 className="h-12 text-[2rem] text-center leading-[3rem] text-primary-4 font-[700]">
            포켓몬 기술 도감
          </h1>
          <p className="w-full h-8 text-center text-[0.8rem] text-primary-3">
            포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요.
            <br />
            타입, 위력, PP, 설명을 확인하고 검색할 수 있습니다.
          </p>
        </header>
        <MovesListContainer />
      </section>
    </main>
  )
}

export default MovesMobile
