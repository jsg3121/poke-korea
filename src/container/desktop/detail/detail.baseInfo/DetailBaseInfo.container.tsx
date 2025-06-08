import { DetailContext } from '~/context/Detail.context'
import { TypesInfo } from './basInfo.typesInfo/TypesInfo.component'
import DescriptionComponent from './baseInfo.description/Description.component'
import RelationPokemonComponent from './baseinfo.relationPokemon/RelationPokemon.component'
import AbilitiesInfoComponent from './baseInfo.abilities/AbilitiesInfo.component'
import { useContext } from 'react'
import DesktopDetailCardBanner from '~/components/adSlot/DesktopDetailCardBanner'

const DetailBaseInfoContainer = () => {
  const { pokemonBaseInfo, activeTypeInfo } = useContext(DetailContext)

  if (!pokemonBaseInfo) return <></> // TODO : 에러 페이지 및 잘못된 페이지로 처리하기

  return (
    <section
      className="w-full max-w-[1280px] flex flex-col gap-12 py-8 px-5 mx-auto"
      aria-label="포켓몬 상세 정보"
    >
      <div className="w-full h-[27.625rem] grid gap-8 grid-cols-[repeat(auto-fit,minmax(calc(50%-1rem),1fr))]">
        <DescriptionComponent />
        {pokemonBaseInfo.evolutionId.length > 0 && (
          <RelationPokemonComponent
            name={pokemonBaseInfo.name}
            evolutionId={pokemonBaseInfo.evolutionId}
          />
        )}
      </div>
      <DesktopDetailCardBanner />
      <AbilitiesInfoComponent />
      <TypesInfo type={activeTypeInfo.types} />
    </section>
  )
}

export default DetailBaseInfoContainer
