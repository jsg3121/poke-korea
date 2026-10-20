'use client'

import { imageMode } from '~/modules/buildMode.module'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

import { PokemonNameOption } from './pokemonNameSearch.types'

interface PokemonNameSuggestionOptionProps {
  option: PokemonNameOption
  onSelect: (option: PokemonNameOption) => void
}

const PokemonNameSuggestionOption = ({
  option,
  onSelect,
}: PokemonNameSuggestionOptionProps) => {
  const handleClick = () => {
    onSelect(option)
  }

  return (
    <li className="relative flex items-center gap-2 min-h-touch px-3 py-1 border-l-4 border-solid border-transparent hover:bg-primary-3 hover:border-primary-1 focus-within:bg-primary-3 focus-within:border-primary-1">
      <Image
        height="2rem"
        width="2rem"
        alt=""
        src={`${imageMode}/${option.imagePath}`}
        imageSize={{ width: 32, height: 32 }}
        densities={[1, 1.5]}
        sizes="2rem"
        loading="lazy"
      />
      <button
        type="button"
        onClick={handleClick}
        className="flex-1 min-w-0 flex items-center justify-between gap-2 text-left focus-visible:outline-none after:absolute after:inset-0"
      >
        <span className="min-w-0 text-sm desktop:text-base break-keep">
          {option.name}
        </span>
        <span className="sr-only">타입:</span>
        <span className="shrink-0 flex gap-1">
          {option.types.map((type) => (
            <Tag key={type} type={type} />
          ))}
        </span>
      </button>
    </li>
  )
}

export default PokemonNameSuggestionOption
