'use client'

import Link from 'next/link'
import { Fragment, useMemo } from 'react'
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

/**
 * 포켓몬 카드 계열의 공통 셸(포켓볼 + 헤더 + 이미지 + 타입 태그)을 가진
 * 반응형 단일 DS 컴포넌트. 본문은 `variant`로 구분한다.
 *
 * 현재는 `pokedex`(스탯 6종)만 구현. 기술/특성/챔피언스 카드는 각 페이지
 * 개편 시 variant를 확장한다(아래 union에 자리만 마련).
 */

/** 셸 공통 데이터 (모든 variant 공유) */
interface PokemonCardBaseProps {
  pokemonData: PokemonCardFragment
  isHighPriority?: boolean
}

/** variant별 본문 데이터 (판별 유니온) */
type PokemonCardVariant = {
  variant: 'pokedex'
}
// 확장 예정 (각 페이지 개편 시 추가):
// | { variant: 'skill'; learnInfo: PokemonLearnInfo }
// | { variant: 'ability'; abilityInfo: ... }
// | { variant: 'champions'; usage: ... }

type PokemonCardComponentProps = PokemonCardBaseProps & PokemonCardVariant

/** 스탯 중 숫자 능력치 키 (__typename·total 제외) */
type PokemonStatKey =
  | 'hp'
  | 'attack'
  | 'specialAttack'
  | 'defense'
  | 'specialDefense'
  | 'speed'

/** pokedex 본문에 표시할 스탯 항목 (데이터 주도) */
const POKEDEX_STAT_ROWS: ReadonlyArray<{ label: string; key: PokemonStatKey }> =
  [
    { label: '체력', key: 'hp' },
    { label: '공격', key: 'attack' },
    { label: '특수공격', key: 'specialAttack' },
    { label: '방어', key: 'defense' },
    { label: '특수방어', key: 'specialDefense' },
    { label: '스피드', key: 'speed' },
  ]

const PokemonCardComponent = ({
  pokemonData,
  isHighPriority = false,
  variant,
}: PokemonCardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({ rootMargin: '200px', threshold: 0.1 })

  const backgroundColor = useMemo(
    () => getBackgroundColor(pokemonData.types),
    [pokemonData.types],
  )

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link
      href={`/detail/${pokemonData.number}`}
      className="block w-full desktop:w-56"
    >
      <article
        className="w-full h-[21rem] desktop:h-80 text-black-2 border border-solid border-black-2 rounded-[10px] p-2 desktop:p-3 relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80),0_0_0px_0.25rem_#ffffff] cursor-pointer card-corner-fold transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] desktop:hover:scale-105 desktop:hover:z-10"
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
          <div className="w-fit mx-auto mb-4 desktop:mb-2 drop-shadow-[2px_3px_2px_#333333] relative">
            <ImageComponent
              height="10rem"
              width="10rem"
              imageSize={{ width: 160, height: 160 }}
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
            className="w-fit mx-auto mb-4 desktop:mb-2 drop-shadow-[2px_3px_2px_#333333] relative"
            aria-description="포켓몬 이미지"
          >
            {isVisible ? (
              <ImageComponent
                height="10rem"
                width="10rem"
                imageSize={{ width: 160, height: 160 }}
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
              <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}

        <div
          className="w-full flex items-center gap-2 px-2 mx-auto justify-start"
          aria-description="포켓몬 타입 정보"
        >
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>

        {variant === 'pokedex' && (
          <dl
            className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[39%_13%_35%_13%] desktop:grid-cols-[35%_15%_35%_15%] mt-4 mx-auto pl-2"
            aria-description="포켓몬 능력치 정보"
          >
            {POKEDEX_STAT_ROWS.map(({ label, key }, index) => (
              <Fragment key={key}>
                {/* 짝수 인덱스=왼쪽 열(mr-1), 홀수=오른쪽 열(ml-2) — 그리드 칸 정렬 */}
                <dt
                  className={`h-5 text-2xs desktop:text-sm leading-5 ${
                    index % 2 === 0 ? 'mr-1' : 'ml-2'
                  }`}
                >
                  {label}
                </dt>
                <dd className="h-5 text-2xs desktop:text-sm leading-5 text-right text-black">
                  {pokemonData.pokemonStats[key]}
                </dd>
              </Fragment>
            ))}
          </dl>
        )}
      </article>
    </Link>
  )
}

export default PokemonCardComponent
