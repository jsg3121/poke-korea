'use client'

import { useContext } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { changeColor } from '~/modules/changeColor.module'
import {
  getAltText,
  getFormUrl,
  getImageList,
  getImageSrc,
} from '~/modules/image.module'
import { pokemonNumberFormat } from '~/modules/pokemonCard.module'
import { DetailContext } from '~/context/Detail.context'
import Image from '~/components/Image.component'
import Tag from '~/components/tag/Tag.component'

import DetailSpeciesNav, { AdjacentPokemon } from './DetailSpeciesNav.container'
import { getActiveFormInfo } from './modules/activeForm.module'

interface DetailHeroProps {
  prevPokemon: AdjacentPokemon | null
  nextPokemon: AdjacentPokemon | null
}

const DetailHero = ({ prevPokemon, nextPokemon }: DetailHeroProps) => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
    activeTypeInfo,
    normalFormImageList,
  } = useContext(DetailContext)
  const routerQuery = useSearchParams()
  const isShiny = routerQuery.get('shinyMode') === 'shiny'

  const { name } = getActiveFormInfo({
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    normalForm,
    activeType,
    activeIndex,
  })

  const imageList = getImageList({
    activeType,
    normalFormImageList,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    name: pokemonBaseInfo?.name ?? '',
    types: pokemonBaseInfo?.types,
    pokemonNumber: pokemonBaseInfo?.number,
  })
  const currentItem = imageList?.[activeIndex]
  const totalForms = imageList?.length ?? 0
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < totalForms - 1

  const slideLinkClass =
    'flex min-h-touch min-w-touch items-center justify-center rounded-2xl text-lg text-primary-1 hover:bg-white-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-1'

  const colors = changeColor(pokemonBaseInfo?.types ?? [])
  const gradientStyle =
    colors.length === 1
      ? { background: `${colors[0]}66` }
      : {
          background: `linear-gradient(135deg, ${colors[0]}88 35%, ${colors[1]}88 65%)`,
        }

  return (
    <section aria-label="포켓몬 기본 식별 정보" className="relative w-full">
      <div className="absolute inset-0 bg-white" aria-hidden="true" />
      <div
        className="absolute inset-0"
        style={gradientStyle}
        aria-hidden="true"
      />
      <div className="relative desktop:mx-auto desktop:max-w-7xl">
        <DetailSpeciesNav prev={prevPokemon} next={nextPokemon} />
        <div className="flex flex-col items-center gap-4 px-4 pb-4 pt-2 desktop:flex-row desktop:gap-16 desktop:pb-6 desktop:pl-16">
          {currentItem && (
            <div className="h-48 w-48 shrink-0 [filter:drop-shadow(0px_5px_5px_#000000)] desktop:h-72 desktop:w-72">
              <Image
                src={getImageSrc({ imageCode: currentItem.imageCode, isShiny })}
                width="100%"
                height="100%"
                alt={getAltText({
                  activeType,
                  isShiny,
                  name: pokemonBaseInfo?.name ?? '',
                  item: currentItem,
                })}
                imageSize={{ width: 288, height: 288 }}
                densities={[1, 1.5]}
                sizes="(min-width: 769px) 18rem, 12rem"
                className="h-full w-full object-contain"
                fetchPriority="high"
              />
            </div>
          )}
          <div className="flex flex-col items-center gap-2 desktop:min-w-0 desktop:flex-1 desktop:items-start">
            <p className="text-xs font-semibold text-black-2 desktop:text-base">
              No.{pokemonNumberFormat(pokemonBaseInfo?.number ?? 0)}
            </p>
            <h1 className="break-keep text-center text-2xl font-bold text-black-2 desktop:text-left desktop:text-4xl">
              {name}
            </h1>
            <ul className="flex gap-2" aria-label="포켓몬 타입">
              {activeTypeInfo.types.map((type) => (
                <li key={type}>
                  <Tag type={type} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="mb-4 flex h-11 items-center justify-center gap-1"
          aria-label={totalForms > 1 ? '폼 이미지 순회' : undefined}
        >
          {totalForms > 1 && (
            <>
              {hasPrev ? (
                <Link
                  href={getFormUrl({
                    activeIndex: activeIndex - 1,
                    pokemonNumber: pokemonBaseInfo?.number ?? 0,
                    activeType,
                    isShiny,
                  })}
                  replace
                  className={slideLinkClass}
                  aria-label={`이전 폼: ${imageList?.[activeIndex - 1]?.name ?? ''}`}
                >
                  <span aria-hidden="true">◀</span>
                </Link>
              ) : (
                <span
                  className={`${slideLinkClass} opacity-30`}
                  aria-hidden="true"
                >
                  ◀
                </span>
              )}
              <span className="text-xs font-semibold text-primary-1 desktop:text-sm">
                {activeIndex + 1}/{totalForms}
              </span>
              {hasNext ? (
                <Link
                  href={getFormUrl({
                    activeIndex: activeIndex + 1,
                    pokemonNumber: pokemonBaseInfo?.number ?? 0,
                    activeType,
                    isShiny,
                  })}
                  replace
                  className={slideLinkClass}
                  aria-label={`다음 폼: ${imageList?.[activeIndex + 1]?.name ?? ''}`}
                >
                  <span aria-hidden="true">▶</span>
                </Link>
              ) : (
                <span
                  className={`${slideLinkClass} opacity-30`}
                  aria-hidden="true"
                >
                  ▶
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default DetailHero
