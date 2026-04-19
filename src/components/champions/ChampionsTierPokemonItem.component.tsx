'use client'

import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'

interface ChampionsTierPokemonItemProps {
  pokemon: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
}

const ChampionsTierPokemonItem = ({
  pokemon,
  isHighPriority = false,
}: ChampionsTierPokemonItemProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  const displayName = pokemon.formName
    ? `${pokemon.name} (${pokemon.formName})`
    : pokemon.name

  return (
    <Link
      href={`/champions/list/${pokemon.pokemonId}`}
      className="flex flex-col items-center p-2 rounded-lg hover:bg-primary-4 hover:-translate-y-1 transition-all w-28"
    >
      {isHighPriority ? (
        <div className="w-24 h-24">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}.webp`}
              alt={displayName ?? ''}
              width="6rem"
              height="6rem"
              imageSize={{ width: 96, height: 96 }}
              className="w-24 h-24 object-contain"
              fetchPriority="high"
            />
          )}
        </div>
      ) : (
        <div ref={imgRef} className="w-24 h-24">
          {isVisible ? (
            pokemon.imagePath && (
              <ImageComponent
                src={`${imageMode}/${pokemon.imagePath}.webp`}
                alt={displayName ?? ''}
                width="6rem"
                height="6rem"
                imageSize={{ width: 96, height: 96 }}
                className="w-24 h-24 object-contain"
                loading="lazy"
                fetchPriority="low"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            )
          ) : (
            <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-lg" />
          )}
        </div>
      )}
      <span className="text-sm text-primary-4 font-bold mt-1 text-center line-clamp-2">
        {pokemon.name}
      </span>
      {(pokemon.region || pokemon.formName) && (
        <span className="text-xs text-primary-3 font-medium text-center">
          {[pokemon.region, pokemon.formName].filter(Boolean).join(' ')}
        </span>
      )}
      <span className="text-sm text-primary-3 mt-0.5">
        {pokemon.usageRate?.toFixed(1)}%
      </span>
    </Link>
  )
}

export default ChampionsTierPokemonItem
