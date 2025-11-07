'use client'

import { useEffect, useRef } from 'react'
import AbilityCardComponent from '~/components/ability/AbilityCard.component'
import AbilityDescriptionComponent from '~/components/ability/AbilityDescription.component'
import { useAbilityList } from '~/hook/useAbilityList'
import { Ability } from '~/graphql/typeGenerated'
import FooterContainer from '../footer/Footer.container'

interface AbilityListContainerProps {
  initialAbilities: Array<Ability>
}

const AbilityListContainer = ({
  initialAbilities,
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
      rootMargin: '0px 0px 100px 0px',
      threshold: 0,
    })

    if (listRef.current) {
      observer.observe(listRef.current)
    }
    return () => observer.disconnect()
  }, [abilityList, hasNextPage, loading])

  return (
    <section className="w-full max-w-[1280px] min-h-dvh h-full mx-auto py-12 pb-8 relative px-5">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">특성 도감</h2>
      <AbilityDescriptionComponent />
      {abilityList.length === 0 && (
        <div className="w-full h-[20rem]">
          <p className="w-full text-2xl text-gray-700 font-bold text-center">
            검색 결과에 맞는 특성이 없습니다.
          </p>
        </div>
      )}
      {abilityList.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
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
      {loading && (
        <div className="flex justify-center py-6 w-full">
          <div className="text-base text-gray-600">특성을 불러오는 중...</div>
        </div>
      )}
      <div ref={listRef}>
        <FooterContainer />
      </div>
    </section>
  )
}

export default AbilityListContainer
