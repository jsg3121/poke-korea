'use client'

import Link from 'next/link'
import { Fragment } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/tag/Tag.component'
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

/**
 * 이름 길이에 따라 헤더 폰트 크기를 단계 조절한다. 챔피언스 등 긴 이름
 * ("켄타로스 (팔데아 블레이즈종)")이 한 줄로도 카드 폭을 넘쳐 잘리는 것을 막는다.
 * whitespace-nowrap 한 줄 유지 전제에서, 글자 수가 많을수록 폰트를 줄인다.
 * 모바일/데스크톱 2단계 토큰으로 반환(모바일 최소 text-2xs=11px).
 */
const getNameFontClass = (name: string): string => {
  const len = name.length
  if (len <= 7) return 'text-xs desktop:text-base'
  if (len <= 10) return 'text-2xs desktop:text-sm'
  return 'text-2xs desktop:text-xs'
}

const PokemonCardComponent = ({
  pokemonData,
  isHighPriority = false,
  variant,
}: PokemonCardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)
  const nameFontClass = getNameFontClass(pokemonData.name)

  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({ rootMargin: '200px', threshold: 0.1 })

  const backgroundColor = getBackgroundColor(pokemonData.types)

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link
      href={`/detail/${pokemonData.number}`}
      className="block w-40 desktop:w-56"
    >
      <article
        className="w-40 desktop:w-56 text-black-2 border border-solid border-black-2 rounded-[10px] p-2 desktop:p-3 relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80),0_0_0px_0.25rem_#ffffff] cursor-pointer card-corner-fold transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] desktop:hover:scale-105 desktop:hover:z-10"
        style={gradientStyle}
        aria-label={`포켓몬 ${pokemonData.name} 카드`}
      >
        <header className="w-full min-h-8 flex items-start justify-between relative z-10">
          <i className="w-6 desktop:w-8 h-6 desktop:h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          {/* 고정 높이(2줄 수용): 이름이 1줄이든 2줄이든 헤더 높이가 동일해야
              카드 전체 높이가 일정하게 유지된다(그리드 정렬). */}
          <div className="w-full h-9 desktop:h-10 flex items-start content-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-x-2 gap-y-0.5">
            <p className="flex-shrink-0 text-xs desktop:text-base leading-tight font-medium text-black-2">
              No.{pokemonNumber}
            </p>
            {/* 짧은 이름은 No.와 같은 줄(우측), 긴 이름은 통째로 아랫줄로 내려가 한 줄 유지.
                폰트는 이름 길이에 따라 단계 축소(getNameFontClass)해 잘림 방지 */}
            <h3
              className={`leading-tight font-semibold text-right text-black whitespace-nowrap ${nameFontClass}`}
            >
              {pokemonData.name}
            </h3>
          </div>
        </header>

        {isHighPriority ? (
          <div className="w-28 desktop:w-40 h-28 desktop:h-40 mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative">
            <ImageComponent
              height="100%"
              width="100%"
              imageSize={{ width: 160, height: 160 }}
              densities={[1, 1.5]}
              alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
              src={`${imageMode}/${pokemonData.number}`}
              sizes="(min-width: 769px) 10rem, 7rem"
              fetchPriority="high"
            />
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-28 desktop:w-40 h-28 desktop:h-40 mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative"
          >
            {isVisible ? (
              <ImageComponent
                height="100%"
                width="100%"
                imageSize={{ width: 160, height: 160 }}
                densities={[1, 1.5]}
                alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
                src={`${imageMode}/${pokemonData.number}`}
                sizes="(min-width: 769px) 10rem, 7rem"
                loading="lazy"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}

        <div className="w-full flex items-center gap-2 px-2 mx-auto justify-start">
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>

        {variant === 'pokedex' && (
          <dl
            className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-2 desktop:mt-4 mx-auto pl-2"
            aria-label="능력치"
          >
            {POKEDEX_STAT_ROWS.map(({ label, key }, index) => (
              <Fragment key={key}>
                {/* 짝수 인덱스=왼쪽 열(mr-1), 홀수=오른쪽 열(ml-2) — 그리드 칸 정렬 */}
                <dt
                  className={`h-5 text-2xs desktop:text-sm leading-5 whitespace-nowrap ${
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
