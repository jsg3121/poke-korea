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

interface ChampionsTopCardMobileProps {
  pokemonData: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
}

const ChampionsTopCardMobile = ({
  pokemonData,
  isHighPriority = false,
}: ChampionsTopCardMobileProps) => {
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
    <Link
      href={`/champions/pokedex/${pokemonData.pokemonId}`}
      className="block w-full"
    >
      <article
        className="w-full h-[18rem] text-black-2 border border-solid border-black-2 rounded-[10px] p-[0.5rem] outline-[0.2rem] outline relative overflow-hidden shadow-[inset_8px_0_0_0_rgb(51_65_80)] cursor-pointer card-corner-fold"
        style={{ ...gradientStyle, outlineColor: tierColors.outlineColor }}
        aria-label={`챔피언스 ${pokemonData.tier}티어 ${displayName} 카드`}
      >
        <header className="w-full min-h-8 flex items-start justify-between pr-2 relative z-10">
          <i className="w-8 h-8 flex-shrink-0 mr-2 relative">
            <BallComponent />
            <ChampionsTierBadge tier={pokemonData.tier} variant="ribbon" />
          </i>
          <div className="w-full min-h-5 flex items-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-2">
            <h3
              className={`w-fit leading-none font-semibold text-right text-black ${displayName && displayName.length > 9 ? 'text-[0.875rem]' : 'text-base'}`}
            >
              {displayName}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto my-1 drop-shadow-[2px_3px_2px_#333333] relative">
            {pokemonData.imagePath && (
              <ImageComponent
                height="10rem"
                width="10rem"
                imageSize={{ width: 120, height: 120 }}
                densities={[1, 1.5]}
                alt={`pokemon_id_${pokemonData.pokemonId} ${pokemonData.name}`}
                src={`${imageMode}/${pokemonData.imagePath}.webp`}
                sizes="10rem"
                fetchPriority="high"
              />
            )}
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto my-1 drop-shadow-[2px_3px_2px_#333333] relative"
            aria-description="포켓몬 이미지"
          >
            {isVisible ? (
              pokemonData.imagePath && (
                <ImageComponent
                  height="10rem"
                  width="10rem"
                  imageSize={{ width: 120, height: 120 }}
                  densities={[1, 1.5]}
                  alt={`pokemon_id_${pokemonData.pokemonId} ${pokemonData.name}`}
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
              <div className="w-[5.5rem] h-[5.5rem] bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}

        <div
          className="flex items-center justify-center gap-1 px-1 mt-4"
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

export default ChampionsTopCardMobile
