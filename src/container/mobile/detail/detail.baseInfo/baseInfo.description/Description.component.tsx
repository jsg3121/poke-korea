'use client'
import { useContext } from 'react'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import { PokemonTypes } from '~/types/pokemonTypes.types'

const DescriptionComponent = () => {
  const { activeTypeInfo } = useContext(DetailContext)
  const {
    types,
    generation,
    isEvolution,
    name,
    pokemonNumber,
    activeType,
    isMega,
    isRegion,
  } = activeTypeInfo

  return (
    <section
      aria-labelledby="pokemon-base-info"
      className="h-full bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
    >
      <InfoCardTitleComponent title="기본 정보" id="pokemon-base-info" />
      <dl className="w-full">
        <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
            이름
          </dt>
          <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
            {name}&nbsp;
            {activeType === 'mega'
              ? '(메가진화)'
              : activeType === 'region'
                ? '(리전폼)'
                : ''}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
            전국도감번호
          </dt>
          <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
            No. {pokemonNumber.toString().padStart(3, '0')}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
            등장 세대
          </dt>
          <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
            {generation} 세대
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
            타입
          </dt>
          <dd
            aria-label={types.map((type) => PokemonTypes[type]).join(',')}
            className="flex items-center gap-2"
          >
            {types.map((type) => {
              return <TagComponent key={type} type={type} />
            })}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
            진화체
          </dt>
          <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
            {isEvolution ? '진화체 있음' : '진화 불가'}
          </dd>
        </div>
        {isRegion && (
          <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
            <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
              리전폼
            </dt>
            <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
              리전폼 존재
            </dd>
          </div>
        )}
        {isMega && (
          <div className="w-full h-12 border-b border-primary-3 border-solid flex items-center gap-2 py-2 last:border-b-0 last:p-0">
            <dt className="w-48 h-10 text-xl leading-[calc(2.5rem+2px)] after:content-[':'] after:float-right">
              메가진화
            </dt>
            <dd className="h-10 text-xl leading-[calc(2.5rem+2px)] font-semibold flex items-center gap-2">
              메가진화 가능
            </dd>
          </div>
        )}
      </dl>
    </section>
  )
}

export default DescriptionComponent
