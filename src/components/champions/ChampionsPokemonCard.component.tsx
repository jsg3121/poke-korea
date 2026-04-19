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
    const suffix = pokemonData.region || pokemonData.formName
    return suffix ? `${pokemonData.name} (${suffix})` : pokemonData.name
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
        className="w-full md:max-w-56 h-80 text-black-2 border border-solid border-black-2 rounded-[10px] block p-[0.75rem_0.5rem] outline-[0.25rem] outline outline-white relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80)] cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] hover:scale-[1.2] hover:z-10 card-corner-fold"
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
              className={`w-fit h-4 leading-[calc(1rem+2px)] font-semibold text-right text-black ${displayName && displayName.length > 9 ? 'text-[0.75rem]' : 'text-base'}`}
            >
              {displayName}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto mb-4 drop-shadow-[2px_3px_2px_#333333] relative">
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
                src={`${imageMode}/${pokemonData.imagePath}.webp`}
                sizes={isMobile ? '9rem' : '10rem'}
                fetchPriority="high"
              />
            )}
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto mb-4 drop-shadow-[2px_3px_2px_#333333] relative"
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
                  src={`${imageMode}/${pokemonData.imagePath}.webp`}
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
          className="w-full max-w-[19rem] grid grid-rows-[repeat(3,_1fr)] grid-cols-[39%_13%_35%_13%] mt-4 mx-auto pl-2"
          aria-description="포켓몬 능력치 정보"
        >
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 mr-1">체력</dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.hp}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">공격</dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.attack}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 mr-1">
            특수공격
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.specialAttack}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">방어</dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.defense}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 mr-1">
            특수방어
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.specialDefense}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">
            스피드
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.stats?.speed}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default ChampionsPokemonCard
