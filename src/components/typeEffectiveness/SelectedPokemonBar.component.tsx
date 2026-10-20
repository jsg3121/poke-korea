import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

import { PokemonNameOption } from './pokemonNameSearch.types'

interface SelectedPokemonBarProps {
  pokemon: PokemonNameOption
}

const SelectedPokemonBar = ({ pokemon }: SelectedPokemonBarProps) => {
  return (
    <div className="flex items-center gap-2 min-h-touch px-3 py-2 desktop:py-1.5 bg-primary-4 text-primary-1 rounded-lg">
      <div className="shrink-0 w-8 h-8">
        <Image
          height="2rem"
          width="2rem"
          alt=""
          src={`${imageMode}/${pokemon.imagePath}`}
          imageSize={{ width: 32, height: 32 }}
          densities={[1, 1.5]}
          sizes="2rem"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-1 desktop:flex-row desktop:items-center desktop:gap-2">
        <p className="text-sm font-bold break-keep desktop:text-base">
          <span className="sr-only">선택한 포켓몬: </span>
          {pokemon.name}
        </p>
        <p className="flex gap-1">
          <span className="sr-only">타입:</span>
          {pokemon.types.map((type) => (
            <Tag key={type} type={type} />
          ))}
        </p>
      </div>
    </div>
  )
}

export default SelectedPokemonBar
