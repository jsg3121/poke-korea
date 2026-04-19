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
      className="flex flex-col items-center p-2 rounded-lg hover:bg-primary-4 hover:-translate-y-1 transition-all w-full h-48 group"
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
      <div className="flex-1 flex flex-col items-center justify-center">
        <span className="text-sm text-primary-4 font-bold text-center line-clamp-2 group-hover:text-primary-1">
          {pokemon.name}
        </span>
        {(pokemon.region || pokemon.formName) && (
          <span className="text-xs text-primary-3 font-medium text-center group-hover:text-primary-2">
            {[pokemon.region, pokemon.formName].filter(Boolean).join(' ')}
          </span>
        )}
      </div>
      <div className="w-full mt-auto flex flex-col items-center gap-1.5">
        <span className="text-sm text-primary-3 group-hover:text-primary-1">
          {pokemon.usageRate?.toFixed(1)}%
        </span>
        <div className="w-full h-1 bg-primary-3/30 rounded-full overflow-hidden group-hover:bg-primary-3">
          <div
            className="h-full bg-primary-4 rounded-full group-hover:bg-primary-1"
            style={{ width: `${Math.min(pokemon.usageRate ?? 0, 100)}%` }}
          />
        </div>
      </div>
    </Link>
  )
}

export default ChampionsTierPokemonItem
