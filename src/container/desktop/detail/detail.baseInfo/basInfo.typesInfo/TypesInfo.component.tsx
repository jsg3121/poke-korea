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
      className="card-detail col-span-2"
      aria-labelledby="pokemon-type-relation"
    >
      <InfoCardTitleComponent title="타입 상성" id="pokemon-type-relation" />
      <InfoContentComponent relationType={relationType} />
    </section>
  )
}
