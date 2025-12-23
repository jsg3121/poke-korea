import PageHeader from '~/components/PageHeader'
import HeaderContainer from '~/container/desktop/header/Header.container'
import MovesListContainer from '~/container/desktop/moves/MovesList.container'

const MovesDesktop = () => {
  return (
    <main className="w-full h-full pt-40">
      <HeaderContainer />
      <section className="max-w-[1280px] mx-auto">
        <PageHeader
          title="포켓몬 기술 도감"
          description="포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요. 타입, 위력, PP, 설명을 확인하고 검색할 수 있습니다."
        />
        <MovesListContainer />
      </section>
    </main>
  )
}

export default MovesDesktop
