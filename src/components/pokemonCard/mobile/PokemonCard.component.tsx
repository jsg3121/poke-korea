'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import {
  getBackgroundColor,
  pokemonNumberFormat,
} from '~/module/pokemonCard.module'

interface PokemonCardComponentProps {
  pokemonData: PokemonCardFragment
  isHighPriority?: boolean
}

const PokemonCardComponent = ({
  pokemonData,
  isHighPriority = false,
}: PokemonCardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  // 커스텀 Lazy Loading Hook (200px 이내 영역에서 이미지 로드)
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  const backgroundColor = useMemo(() => {
    return getBackgroundColor(pokemonData.types)
  }, [pokemonData.types])

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link href={`/detail/${pokemonData.number}`} className="block w-full">
      <article
        className="w-full h-[21rem] text-black-2 border border-solid border-black-2 rounded-[10px] p-[0.75rem_0.5rem] relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80),0_0_0px_0.25rem_#ffffff] cursor-pointer card-corner-fold"
        style={gradientStyle}
        aria-label={`포켓몬 ${pokemonData.name} 카드`}
      >
        <header className="w-full min-h-8 flex items-start justify-between pr-2 relative z-10">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full min-h-5 flex items-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-2">
            <p className="h-4 text-base leading-none font-medium text-black-2">
              No.{pokemonNumber}
            </p>
            <h3 className="w-fit text-base leading-none font-semibold text-right text-black">
              {pokemonData.name}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto mb-4 drop-shadow-[2px_3px_2px_#333333] relative pr-2">
            <ImageComponent
              height="10rem"
              width="10rem"
              imageSize={{ width: 120, height: 120 }}
              densities={[1, 1.5]}
              alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
              src={`${imageMode}/${pokemonData.number}`}
              sizes="10rem"
              fetchPriority="high"
            />
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto mb-4 drop-shadow-[2px_3px_2px_#333333] relative pr-2"
            aria-description="포켓몬 이미지"
          >
            {isVisible ? (
              <ImageComponent
                height="10rem"
                width="10rem"
                imageSize={{ width: 120, height: 120 }}
                densities={[1, 1.5]}
                alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
                src={`${imageMode}/${pokemonData.number}`}
                sizes="10rem"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            ) : (
              // Placeholder: 이미지 로딩 전 스켈레톤 (모바일용)
              <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}
        <div
          className="w-full max-w-[18rem] flex items-center gap-[0.4rem] px-2 mx-auto justify-start"
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
            {pokemonData.pokemonStats.hp}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">공격</dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.pokemonStats.attack}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 mr-1">
            특수공격
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialAttack}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">방어</dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.pokemonStats.defense}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 mr-1">
            특수방어
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialDefense}
          </dd>
          <dt className="h-5 text-[max(0.875rem,11px)] leading-5 ml-2">
            스피드
          </dt>
          <dd className="h-5 text-[max(0.875rem,11px)] leading-5 text-right text-black">
            {pokemonData.pokemonStats.speed}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default PokemonCardComponent
