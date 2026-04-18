'use client'

import Link from 'next/link'
import BallComponent from '~/components/Ball.component'
import TagComponent from '~/components/Tag.component'
import { ChampionsPokemonCardFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'

interface ChampionsPokemonCardProps {
  pokemonData: ChampionsPokemonCardFragment
  isHighPriority?: boolean
}

const ChampionsPokemonCard = ({
  pokemonData,
  isHighPriority = false,
}: ChampionsPokemonCardProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.pokemonNumber)
  const backgroundColor = getBackgroundColor(pokemonData.types)
  const displayName = pokemonData.formName
    ? `${pokemonData.name} (${pokemonData.formName})`
    : pokemonData.name

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
      href={`/champions/pokedex/${pokemonData.externalDexId}`}
      className="w-full max-w-56"
    >
      <article
        className="w-full max-w-56 h-80 text-black-2 border border-solid border-black-2 rounded-[10px] block p-[0.83333333rem_0.55555556rem] outline-[0.25rem] outline outline-white relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80)] cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] hover:scale-[1.2] hover:z-10 card-corner-fold"
        style={gradientStyle}
        aria-label={`포켓몬 ${displayName} 카드`}
      >
        <header className="w-full h-8 flex items-start justify-between">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full h-5 flex items-start justify-between border-b border-solid border-card-accent pb-1">
            <p className="h-4 text-base leading-none font-medium text-black-2">
              No.{pokemonNumber}
            </p>
            <h3 className="w-full h-4 text-base leading-none font-semibold text-right text-black truncate">
              {displayName}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative">
            {pokemonData.imagePath && (
              <img
                src={pokemonData.imagePath}
                alt={displayName}
                width={160}
                height={160}
                className="w-40 h-40 object-contain"
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
                <img
                  src={pokemonData.imagePath}
                  alt={displayName}
                  width={160}
                  height={160}
                  className="w-40 h-40 object-contain"
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
          className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-[0.55555556rem] px-[0.55555556rem]"
          aria-description="포켓몬 능력치 정보"
        >
          <dt className="h-5 text-sm leading-5 even:ml-4">체력</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.hp ?? '-'}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.attack ?? '-'}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.specialAttack ?? '-'}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.defense ?? '-'}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.specialDefense ?? '-'}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">스피드</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.stats?.speed ?? '-'}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default ChampionsPokemonCard
