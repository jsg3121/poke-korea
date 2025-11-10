'use client'

import AbilityCardComponent from '~/components/ability/AbilityCard.component'
import AbilityDescriptionComponent from '~/components/ability/AbilityDescription.component'
import { useAbilityList } from '~/hook/useAbilityList'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { Ability } from '~/graphql/typeGenerated'
import FooterContainer from '../footer/Footer.container'
import PageHeader from '~/components/PageHeader'
import AbilitySearchComponent from '~/components/ability/AbilitySearch.component'

interface AbilityListContainerProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListContainer = ({
  initialAbilities,
  totalCount,
}: AbilityListContainerProps) => {
  const { abilityList, loadMore, hasNextPage } = useAbilityList({
    initialAbilities,
  })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 100px 0px',
    dependencies: [abilityList, hasNextPage],
  })

  return (
    <section className="w-full max-w-[1280px] h-fit mx-auto pb-8 relative px-5">
      <PageHeader
        title="특성 도감"
        description="포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고, 어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요."
      />
      <AbilityDescriptionComponent />
      <AbilitySearchComponent totalCount={totalCount} />
      {abilityList.length === 0 && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-2xl text-primary-4 font-bold text-center">
            검색하신 이름의 특성이 존재하지 않아요!
          </p>
        </div>
      )}
      {abilityList.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6 px-1">
          {abilityList.map((ability) => {
            return (
              <AbilityCardComponent
                key={`ability-id-${ability.id}`}
                abilityData={ability}
              />
            )
          })}
        </div>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default AbilityListContainer
