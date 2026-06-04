'use client'

import Link from 'next/link'
import BallComponent from '~/components/Ball.component'
import TagComponent from '~/components/Tag.component'
import { useDevice } from '~/context/Device.context'
import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'
import ImageComponent from '../Image.component'

interface ChampionsPokemonCardProps {
  pokemonData: ChampionsPokemonCardFragment
  isHighPriority?: boolean
}

const ChampionsPokemonCard = ({
  pokemonData,
  isHighPriority = false,
}: ChampionsPokemonCardProps) => {
  const { isMobile } = useDevice()
  const pokemonNumber = pokemonNumberFormat(pokemonData.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemonData.types)

  const getDisplayName = () => {
    if (pokemonData.region) {
      const suffix = pokemonData.formName
        ? `${pokemonData.region} ${pokemonData.formName}`
        : pokemonData.region
      return `${pokemonData.name} (${suffix})`
    }
    return pokemonData.formName || pokemonData.name
  }
  const displayName = getDisplayName()

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
      href={`/champions/list/${pokemonData.externalDexId}`}
      className="w-full max-w-56"
    >
      <article
        className="w-full md:max-w-56 h-72 text-black-2 border border-solid border-black-2 rounded-[10px] block p-[0.75rem_0.5rem] outline-[0.25rem] outline outline-white relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80)] cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] hover:scale-105 hover:z-10 card-corner-fold"
        style={gradientStyle}
        aria-label={`포켓몬 ${displayName} 카드`}
      >
        <header className="w-full h-8 flex items-start justify-between">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full min-h-5 flex items-start flex-wrap justify-between border-b border-solid border-card-accent pb-1">
            <p className="h-4 text-[0.875rem] leading-[calc(1rem+2px)] font-medium text-black-2">
              No.{pokemonNumber}
            </p>
            <h3
              className={`w-fit h-4 leading-[calc(1rem+2px)] font-semibold text-right text-black ${displayName && displayName.length > 13 ? 'text-[0.6rem]' : displayName.length > 9 ? 'text-[0.75rem]' : 'text-base'}`}
            >
              {displayName}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative">
            {pokemonData.imagePath && (
              <ImageComponent
                height={isMobile ? '9rem' : '10rem'}
                width={isMobile ? '9rem' : '10rem'}
                imageSize={{
                  width: isMobile ? 108 : 160,
                  height: isMobile ? 108 : 160,
                }}
                densities={[1, 1.5]}
                alt={`pokemon_id_${pokemonData.pokemonNumber} ${pokemonData.name}`}
                src={`${imageMode}/${pokemonData.imagePath}`}
                sizes={isMobile ? '9rem' : '10rem'}
                fetchPriority="high"
              />
            )}
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative"
            aria-description="포켓몬 이미지"
          >
            {isVisible ? (
              pokemonData.imagePath && (
                <ImageComponent
                  height={isMobile ? '9rem' : '10rem'}
                  width={isMobile ? '9rem' : '10rem'}
                  imageSize={{
                    width: isMobile ? 108 : 160,
                    height: isMobile ? 108 : 160,
                  }}
                  densities={[1, 1.5]}
                  alt={`pokemon_id_${pokemonData.pokemonNumber} ${pokemonData.name}`}
                  src={`${imageMode}/${pokemonData.imagePath}`}
                  sizes={isMobile ? '9rem' : '10rem'}
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
              <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}

        <div
          className="flex items-center gap-[0.38888889rem] px-[0.55555556rem]"
          aria-description="포켓몬 타입 정보"
        >
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>

        <dl
          className="w-full grid grid-rows-3 mobile:mt-3 desktop:mt-2 mx-auto px-2"
          aria-description="포켓몬 메타 정보"
        >
          <div className="h-5 flex items-center justify-between">
            <dt className="text-[max(0.875rem,11px)] leading-5">종족값</dt>
            <dd className="text-[max(0.875rem,11px)] leading-5 font-semibold text-black">
              {pokemonData.stats?.total}
            </dd>
          </div>
          <div className="h-5 flex items-center justify-between">
            <dt className="text-[max(0.875rem,11px)] leading-5">사용률</dt>
            <dd className="text-[max(0.875rem,11px)] leading-5 font-semibold text-black">
              {pokemonData.usageRate != null
                ? `${pokemonData.usageRate}%`
                : '-'}
            </dd>
          </div>
          <div className="h-5 flex items-center justify-between">
            <dt className="text-[max(0.875rem,11px)] leading-5">승률</dt>
            <dd className="text-[max(0.875rem,11px)] leading-5 font-semibold text-black">
              {pokemonData.winRate != null ? `${pokemonData.winRate}%` : '-'}
            </dd>
          </div>
        </dl>
      </article>
    </Link>
  )
}

export default ChampionsPokemonCard
