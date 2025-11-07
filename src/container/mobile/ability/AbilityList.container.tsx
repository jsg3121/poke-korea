'use client'

import { useEffect, useRef } from 'react'
import AbilityCardComponent from '~/components/ability/AbilityCard.component'
import AbilityDescriptionComponent from '~/components/ability/AbilityDescription.component'
import AbilitySearchComponent from '~/components/ability/AbilitySearch.component'
import { useAbilityList } from '~/hook/useAbilityList'
import { Ability } from '~/graphql/typeGenerated'
import FooterContainer from '../footer/Footer.container'
import PageHeader from '~/components/mobile/PageHeader'

interface AbilityListContainerProps {
  initialAbilities: Array<Ability>
  totalCount: number
}

const AbilityListContainer = ({
  initialAbilities,
  totalCount,
}: AbilityListContainerProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const { abilityList, loadMore, hasNextPage, loading } = useAbilityList({
    initialAbilities,
  })

  const observerCallback = (entries: Array<IntersectionObserverEntry>) => {
    entries.forEach((entry) => {
      const intersectionRatio = entry.intersectionRatio
      if (intersectionRatio > 0 && hasNextPage && !loading) {
        loadMore()
      }
    })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px 380px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [abilityList, hasNextPage, loading])

  return (
    <section className="w-full h-full mx-auto px-5 relative">
      <PageHeader
        title="특성 도감"
        description={`포켓몬의 숨겨진 특성, 효과를 한눈에! 특성을 확인하고,\n어떤 포켓몬이 가지고 있는지 빠르고 쉽게 확인하세요.`}
      />
      <AbilityDescriptionComponent />
      <AbilitySearchComponent totalCount={totalCount} />
      {abilityList.length === 0 && (
        <div className="w-full h-20">
          <p className="w-full text-lg text-primary-4 font-medium text-center">
            검색하신 이름의 특성이 존재하지 않아요!
          </p>
        </div>
      )}
      {abilityList.length > 0 && (
        <div className="w-full grid grid-cols-1 gap-4 px-2">
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
