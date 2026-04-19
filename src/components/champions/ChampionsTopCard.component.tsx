'use client'

import Link from 'next/link'
import BallComponent from '~/components/Ball.component'
import TagComponent from '~/components/Tag.component'
import ChampionsTierBadge, {
  getTierColors,
} from '~/components/champions/ChampionsTierBadge.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import { getBackgroundColor } from '~/module/pokemonCard.module'
import ImageComponent from '../Image.component'

interface ChampionsTopCardProps {
  pokemonData: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
}

const ChampionsTopCard = ({
  pokemonData,
  isHighPriority = false,
}: ChampionsTopCardProps) => {
  const displayName = pokemonData.formName
    ? `${pokemonData.name} (${pokemonData.formName})`
    : pokemonData.name

  const backgroundColor = getBackgroundColor(pokemonData.types ?? [])
  const tierColors = getTierColors(pokemonData.tier)

  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link href={`/champions/list/${pokemonData.pokemonId}`} className="block">
      <article
        className="w-full h-72 text-black-2 border border-solid border-black-2 rounded-[10px] block p-2 outline-[0.25rem] outline relative overflow-hidden shadow-[inset_8px_0_0_0_rgb(51_65_80)] cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] hover:scale-105 hover:z-10 card-corner-fold"
        style={{ ...gradientStyle, outlineColor: tierColors.outlineColor }}
        aria-label={`챔피언스 ${pokemonData.tier}티어 ${displayName} 카드`}
      >
        <header className="w-full h-7 flex items-start justify-between">
          <div className="w-7 h-7 flex-shrink-0 mr-2 relative">
            <BallComponent />
            <ChampionsTierBadge tier={pokemonData.tier} variant="ribbon" />
          </div>
          <div className="w-full h-5 flex items-start justify-end border-b border-solid border-card-accent pb-1">
            <h3 className="flex-1 h-4 text-sm leading-none font-semibold text-right text-black truncate">
              {displayName}
            </h3>
          </div>
        </header>

        {isHighPriority ? (
          <div className="w-fit mx-auto my-2 drop-shadow-[2px_3px_2px_#333333] relative">
            {pokemonData.imagePath && (
              <div className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative">
                <ImageComponent
                  height="10rem"
                  width="10rem"
                  imageSize={{ width: 140, height: 140 }}
                  densities={[1, 1.5]}
                  alt={`pokemon_id_${pokemonData.pokemonId}`}
                  src={`${imageMode}/${pokemonData.imagePath}.webp`}
                  sizes="10rem"
                  fetchPriority="high"
                />
              </div>
            )}
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto my-2 drop-shadow-[2px_3px_2px_#333333] relative"
            aria-description="포켓몬 이미지"
          >
            {isVisible ? (
              pokemonData.imagePath && (
                <ImageComponent
                  height="10rem"
                  width="10rem"
                  imageSize={{ width: 140, height: 140 }}
                  densities={[1, 1.5]}
                  alt={`pokemon_id_${pokemonData.pokemonId}`}
                  src={`${imageMode}/${pokemonData.imagePath}.webp`}
                  sizes="10rem"
                  loading="lazy"
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{
                    opacity: isLoaded ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                  }}
                />
              )
            ) : (
              <div className="w-36 h-36 bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}

        <div
          className="flex items-center justify-center gap-1 px-1"
          aria-description="포켓몬 타입 정보"
        >
          {pokemonData.types?.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>
        <p className="mt-3 text-center h-4">
          사용률 : <b className="font-bold">{pokemonData.usageRate}%</b>
        </p>
      </article>
    </Link>
  )
}

export default ChampionsTopCard
