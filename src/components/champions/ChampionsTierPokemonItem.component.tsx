'use client'

import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { ChampionsMetaSummaryFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import {
  buildChampionsDetailHref,
  ChampionsFormatSlug,
} from '~/utils/championsFormat.util'

interface ChampionsTierPokemonItemProps {
  pokemon: ChampionsMetaSummaryFragment
  isHighPriority?: boolean
  formatSlug: ChampionsFormatSlug
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
  formatSlug,
}: ChampionsTierPokemonItemProps) => {
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  const formBadge = getFormBadge(pokemon.formCode, pokemon.region)

  return (
    <Link
      href={buildChampionsDetailHref({
        formatSlug,
        pokemonId: pokemon.pokemonId,
        formType: pokemon.formType,
        formCode: pokemon.formCode,
      })}
      className="relative flex flex-col items-center p-2 pt-4 rounded-lg bg-primary-4/5 hover:bg-primary-4 hover:-translate-y-1 transition-all w-full desktop:w-[146px] group"
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
        className={`my-2 h-6 leading-[calc(1.5rem+2px)] text-primary-4 font-bold text-center line-clamp-2 group-hover:text-primary-1 ${pokemon.name && pokemon.name.length > 8 ? 'text-[0.625rem]' : 'text-base'}`}
      >
        {pokemon.name}
      </span>

      {pokemon.types && pokemon.types.length > 0 && (
        <div
          className="flex flex-wrap items-center justify-center gap-1 mt-1 min-h-[3.25rem] desktop:min-h-6"
          aria-label="포켓몬 타입"
        >
          {pokemon.types.map((type, index) => (
            <TagComponent key={`${type}-${index}`} type={type} />
          ))}
        </div>
      )}

      {/* 인기 기술/도구 top1 (한글명). 데이터 원천 변경으로 사용률·승률(%)이 항상
          null이 되어 막대 그래프를 제거하고 실제 채택 top1로 교체했다. 인기도 서열은
          우상단 #순위 배지가 담당한다. 정보 제공이 목적이라 값은 말줄임 없이 줄바꿈으로
          전부 노출한다(break-keep=한글 단어 단위 줄바꿈). 라벨을 값 위에 두어 값이 카드
          가로폭 전체를 쓰게 해 줄바꿈을 최소화한다. */}
      <dl className="w-full mt-2 flex flex-col gap-1.5 text-center">
        <div className="text-[11px] text-primary-3 group-hover:text-primary-1">
          <dt className="font-bold text-primary-3/70 group-hover:text-primary-1/70">
            인기 기술
          </dt>
          <dd className="font-semibold text-primary-4 group-hover:text-primary-1 break-keep">
            {pokemon.topMove ?? '-'}
          </dd>
        </div>
        <div className="text-[11px] text-primary-3 group-hover:text-primary-1">
          <dt className="font-bold text-primary-3/70 group-hover:text-primary-1/70">
            인기 도구
          </dt>
          <dd className="font-semibold text-primary-4 group-hover:text-primary-1 break-keep">
            {pokemon.topItem ?? '-'}
          </dd>
        </div>
      </dl>
    </Link>
  )
}

export default ChampionsTierPokemonItem
