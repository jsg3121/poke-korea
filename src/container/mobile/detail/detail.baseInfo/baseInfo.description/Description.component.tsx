import { useContext } from 'react'
import TagComponent from '~/components/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'

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
    <section aria-labelledby="pokemon-base-info" className="card-detail">
      <InfoCardTitleComponent title="기본 정보" id="pokemon-base-info" />
      <dl className="w-full">
        <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="dl-term">이름</dt>
          <dd className="dl-desc">
            {name}&nbsp;
            {activeType === 'mega'
              ? '(메가진화)'
              : activeType === 'region'
                ? '(리전폼)'
                : ''}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="dl-term">전국도감번호</dt>
          <dd className="dl-desc">
            No. {pokemonNumber.toString().padStart(3, '0')}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="dl-term">등장 세대</dt>
          <dd className="dl-desc">{generation} 세대</dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="dl-term">타입</dt>
          <dd
            aria-label={types.map((type) => PokemonTypes[type]).join(',')}
            className="dl-desc"
          >
            {types.map((type) => {
              return <TagComponent key={type} type={type} />
            })}
          </dd>
        </div>
        <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
          <dt className="dl-term">진화체</dt>
          <dd className="dl-desc">
            {isEvolution ? '진화체 있음' : '진화 불가'}
          </dd>
        </div>
        {isRegion && (
          <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
            <dt className="dl-term">리전폼</dt>
            <dd className="dl-desc">리전폼 존재</dd>
          </div>
        )}
        {isMega && (
          <div className="w-full h-12 border-b border-primary-3 border-solid flex-items-gap-2 py-2 last:border-b-0 last:p-0">
            <dt className="dl-term">메가진화</dt>
            <dd className="dl-desc">메가진화 가능</dd>
          </div>
        )}
      </dl>
    </section>
  )
}

export default DescriptionComponent
