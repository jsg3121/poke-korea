'use client'

import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/tag/Tag.component'
import Link from 'next/link'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import {
  getAltText,
  getFormUrl,
  getImageList,
  getImageSrc,
} from '~/module/image.module'
import { pokemonNumberFormat } from '~/module/pokemonCard.module'
import DetailSpeciesNavContainer, {
  AdjacentPokemon,
} from './DetailSpeciesNav.container'
import { getActiveFormInfo } from './modules/activeForm.module'

/**
 * 상세 히어로 (반응형 단일 — UX-005). 타입색 그라데이션 위에 일러스트와
 * **식별 정보(이름·도감번호·타입)를 첫 화면으로 승격**한다(RES-003 — 벤치마크
 * 5/5의 첫 화면 공식). 기존엔 번호·타입이 기본정보 카드까지 스크롤해야 보였다.
 *
 * 폼 전환·이미지 슬라이드는 DetailFormRow 책임 — 기존 absolute 슬라이드 버튼이
 * 스탯 카드를 침범하던 C1 결함을 배치 분리로 원천 차단한다.
 *
 * 종 내비(이전/다음)는 히어로 그라데이션 위 상단 오버레이 — 전역 헤더와 히어로
 * 배경 사이에 페이지색 공백 띠가 생기는 어색함을 없앤다(사용자 결정, QA 라운드 1).
 */

interface DetailHeroProps {
  prevPokemon: AdjacentPokemon | null
  nextPokemon: AdjacentPokemon | null
}

const DetailHeroContainer = ({ prevPokemon, nextPokemon }: DetailHeroProps) => {
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

  // 밝은 그라데이션 배경 위 슬라이드 버튼 (다크용 FormRow 스타일과 색만 다름)
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
        <DetailSpeciesNavContainer prev={prevPokemon} next={nextPokemon} />
        {/* 데스크톱: 이미지 컬럼 고정폭(shrink-0) + 정보 컬럼 flex-1 —
            이름 길이와 무관하게 이미지가 항상 같은 위치(QA 라운드 2) */}
        <div className="flex flex-col items-center gap-4 px-4 pb-4 pt-2 desktop:flex-row desktop:gap-16 desktop:pb-6 desktop:pl-16">
          {currentItem && (
            <div className="h-72 w-72 shrink-0 [filter:drop-shadow(0px_5px_5px_#000000)] desktop:h-96 desktop:w-96">
              <ImageComponent
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
                sizes="(min-width: 769px) 24rem, 18rem"
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
                  <TagComponent type={type} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 폼 이미지 순회 — 히어로 하단 중앙(이미지와 같은 맥락에 붙여 기능을
            드러낸다, QA 라운드 2에서 FormRow 우측 배치가 불명확하다는 피드백) */}
        {totalForms > 1 && (
          <div
            className="flex items-center justify-center gap-1 pb-4"
            aria-label="폼 이미지 순회"
          >
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
          </div>
        )}
      </div>
    </section>
  )
}

export default DetailHeroContainer
