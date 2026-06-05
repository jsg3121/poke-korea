'use client'

import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'

interface ChampionsTierPokemonItemProps {
  pokemon: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
}

/**
 * 폼 종류 식별
 * - formCode 가 'M' 으로 시작하면 메가
 * - region 필드 존재 시 리전
 * - 그 외 BASE
 */
const getFormBadge = (
  formCode: string | null | undefined,
  region: string | null | undefined,
): { label: string; className: string } | null => {
  if (formCode && formCode.startsWith('M')) {
    return {
      label: '메가',
      className: 'bg-amber-500 text-white',
    }
  }
  if (region) {
    return {
      label: '리전',
      className: 'bg-teal-500 text-white',
    }
  }
  return null
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

  const formBadge = getFormBadge(pokemon.formCode, pokemon.region)
  const usageRate = pokemon.usageRate ?? 0
  const winRate = pokemon.winRate

  return (
    <Link
      href={`/champions/list/${pokemon.pokemonId}`}
      className="relative flex flex-col items-center p-2 pt-4 rounded-lg bg-primary-4/5 hover:bg-primary-4 hover:-translate-y-1 transition-all w-full group"
    >
      {formBadge && (
        <span
          className={`absolute left-2 top-2 z-10 ${formBadge.className} text-[10px] font-bold rounded px-1.5 py-0.5`}
          aria-label={`${formBadge.label} 폼`}
        >
          {formBadge.label}
        </span>
      )}
      {pokemon.usageRank != null && (
        <span
          className="absolute right-2 top-2 z-10 bg-primary-1 text-white text-[10px] font-bold rounded px-1.5 py-0.5"
          aria-label={`사용률 순위 ${pokemon.usageRank}위`}
        >
          #{pokemon.usageRank}
        </span>
      )}

      {isHighPriority ? (
        <div className="w-24 h-24">
          {pokemon.imagePath && (
            <ImageComponent
              src={`${imageMode}/${pokemon.imagePath}`}
              alt={pokemon.name ?? ''}
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
                src={`${imageMode}/${pokemon.imagePath}`}
                alt={pokemon.name ?? ''}
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

      <span
        className={`my-2 h-6 leading-[calc(1.5rem+2px)] text-primary-4 font-bold text-center line-clamp-2 group-hover:text-primary-1 ${pokemon.name && pokemon.name.length > 8 ? 'text-[0.625rem]' : 'text-[0.875rem]'}`}
      >
        {pokemon.name}
      </span>

      {pokemon.types && pokemon.types.length > 0 && (
        <div className="flex items-center gap-1 mt-1" aria-label="포켓몬 타입">
          {pokemon.types.map((type, index) => (
            <TagComponent key={`${type}-${index}`} type={type} />
          ))}
        </div>
      )}

      <div className="w-full mt-2 flex flex-col gap-1.5">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between text-[11px] text-primary-3 group-hover:text-primary-1">
            <span>사용률</span>
            <span className="font-semibold">{usageRate}%</span>
          </div>
          <div className="w-full h-1 bg-primary-3/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full"
              style={{ width: `${Math.min(usageRate, 100)}%` }}
            />
          </div>
        </div>
        {winRate != null && (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between text-[11px] text-primary-3 group-hover:text-primary-1">
              <span>승률</span>
              <span className="font-semibold">{winRate}%</span>
            </div>
            <div className="w-full h-1 bg-primary-3/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(winRate, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ChampionsTierPokemonItem
