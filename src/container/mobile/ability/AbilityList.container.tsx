'use client'

import AbilityCardComponent from '~/components/ability/AbilityCard.component'
import AbilityDescriptionComponent from '~/components/ability/AbilityDescription.component'
import AbilitySearchComponent from '~/components/ability/AbilitySearch.component'
import { useAbilityList } from '~/hook/useAbilityList'
import { useInfiniteScroll } from '~/hook/useInfiniteScroll'
import { Ability } from '~/graphql/typeGenerated'
import FooterContainer from '../footer/Footer.container'
import PageHeader from '~/components/mobile/PageHeader'
import MobileAbilityTopBanner from '~/components/adSlot/MobileAbilityTopBanner'

interface AbilityListContainerProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListContainer = ({
  initialAbilities,
  totalCount,
}: AbilityListContainerProps) => {
  const { abilityList, loadMore, hasNextPage, loading } = useAbilityList({
    initialAbilities,
    pageSize: 9,
  })

  const listRef = useInfiniteScroll({
    hasNextPage,
    loadMore,
    rootMargin: '0px 0px 380px 0px',
    dependencies: [abilityList, hasNextPage, loading],
  })

  return (
    <section className="w-full h-full mx-auto relative">
      <PageHeader
        title="특성 도감"
        description={`포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고,\n어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.`}
      />
      <MobileAbilityTopBanner />
      <AbilityDescriptionComponent />
      <AbilitySearchComponent totalCount={totalCount} />
      {abilityList.length === 0 && (
        <div className="w-[calc(100%-2.5rem)] mx-auto h-20">
          <p className="w-[calc(100%-2.5rem)] mx-auto text-lg text-primary-4 font-medium text-center">
            검색하신 이름의 특성이 존재하지 않아요!
          </p>
        </div>
      )}
      {abilityList.length > 0 && (
        <div className="w-[calc(100%-2.5rem)] mx-auto grid grid-cols-1 gap-4 px-2">
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
