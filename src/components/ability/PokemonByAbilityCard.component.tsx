import { useMemo } from 'react'

import { CardColor } from '~/types/pokemonTypes.types'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/modules/buildMode.module'
import { getNameHeaderClass } from '~/modules/pokemonCard.module'
import PokemonCardShell from '~/components/pokemonCard/PokemonCardShell.component'

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
  isHighPriority?: boolean
}

const PokemonByAbilityCard = ({
  pokemonData,
  isHighPriority = false,
}: PokemonByAbilityCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')
  const displayName = pokemonData.formName || pokemonData.name
  const nameHeaderClass = getNameHeaderClass(displayName)

  const backgroundColor = useMemo(
    () => pokemonData.types.map((item) => CardColor[item]),
    [pokemonData.types],
  )

  const pokemonHref = useMemo(() => {
    const baseUrl = `/detail/${pokemonData.number}`

    if (pokemonData.formType === 'MEGA') {
      const megaIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath[pokemonData.imagePath.length - 1], 10)
        : 0
      return megaIndex > 0 ? `${baseUrl}/mega/${megaIndex}` : `${baseUrl}/mega`
    }

    if (pokemonData.formType === 'REGION_FORM') {
      const regionIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath[pokemonData.imagePath.length - 1], 10)
        : 0
      return regionIndex > 0
        ? `${baseUrl}/region/${regionIndex}`
        : `${baseUrl}/region`
    }

    if (pokemonData.formType === 'NORMAL_FORM') {
      const formIndex = pokemonData.imagePath
        ? parseInt(pokemonData.imagePath.split('_')[1], 10)
        : 0
      return formIndex > 0 ? `${baseUrl}/form/${formIndex}` : baseUrl
    }

    return baseUrl
  }, [pokemonData.formType, pokemonData.imagePath, pokemonData.number])

  return (
    <PokemonCardShell
      href={pokemonHref}
      backgroundColor={backgroundColor}
      types={pokemonData.types}
      imageSrc={`${imageMode}/${pokemonData.imagePath ?? pokemonData.number}`}
      imageAlt={`pokemon_id_${pokemonData.number} ${displayName}`}
      imageSize={{ width: 160, height: 160 }}
      isHighPriority={isHighPriority}
      ariaLabel={`포켓몬 ${displayName} 카드`}
      header={
        <div className="w-full flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
          <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
            No.{pokemonNumber}
          </p>
          <h3
            className={`leading-tight font-semibold text-black break-keep ${nameHeaderClass}`}
          >
            {displayName}
          </h3>
        </div>
      }
    >
      <div className="w-full flex flex-wrap items-center justify-start gap-2 px-2 mt-2 min-h-6">
        {pokemonData.isHidden && (
          <strong className="h-6 text-aligned-sm px-2 text-xs bg-type-electric text-black-2 rounded-md font-bold">
            숨겨진 특성
          </strong>
        )}
      </div>
    </PokemonCardShell>
  )
}

export default PokemonByAbilityCard
