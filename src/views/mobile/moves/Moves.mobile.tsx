'use client'
import PageHeader from '~/components/mobile/PageHeader'
import MobileTabBar from '~/components/MobileTabBar'
import HeaderContainer from '~/container/mobile/header/Header.container'
import MovesListContainer from '~/container/mobile/moves/MovesList.container'

const MovesMobile = () => {
  return (
    <main>
      <HeaderContainer />
      <section className="w-full">
        <PageHeader
          title="포켓몬 기술 도감"
          description={`포켓몬이 사용할 수 있는 모든 기술을 한눈에 확인하세요.\n타입, 위력, PP, 설명을 확인하고 검색할 수 있습니다.`}
        />
        <MovesListContainer />
      </section>
      <MobileTabBar />
    </main>
  )
}

export default MovesMobile
