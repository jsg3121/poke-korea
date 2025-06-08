import { PokemonType } from '~/graphql/typeGenerated'
import { calculateRelationType } from '~/module/calculateRelationType'
import InfoCardTitleComponent from '../components/InfoCardTitle.component'
import InfoContentComponent from './typesInfo.infoContent/InfoContent.component'

interface TypesInfoProps {
  type: Array<PokemonType>
}

export const TypesInfo = ({ type }: TypesInfoProps) => {
  const relationType = calculateRelationType(type)

  return (
    <section
      className="w-full h-full bg-primary-4 border-[3px] border-solid border-primary-1 rounded-2xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4"
      aria-labelledby="pokemon-type-relation"
    >
      <InfoCardTitleComponent title="타입 상성" id="pokemon-type-relation" />
      <InfoContentComponent relationType={relationType} />
    </section>
  )
}
