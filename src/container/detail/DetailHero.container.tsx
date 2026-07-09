'use client'

import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/tag/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { changeColor } from '~/module/changeColor'
import { getAltText, getImageList, getImageSrc } from '~/module/image.module'
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
        <div className="flex flex-col items-center gap-4 px-4 pb-8 pt-2 desktop:flex-row desktop:justify-center desktop:gap-16 desktop:pb-12">
          {currentItem && (
            <div className="h-72 w-72 [filter:drop-shadow(0px_5px_5px_#000000)] desktop:h-96 desktop:w-96">
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
          <div className="flex flex-col items-center gap-2 desktop:items-start">
            <p className="text-sm font-semibold text-black-2 desktop:text-base">
              No.{pokemonNumberFormat(pokemonBaseInfo?.number ?? 0)}
            </p>
            <h1 className="break-keep text-center text-3xl font-bold text-black-2 desktop:text-left desktop:text-4xl">
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
      </div>
    </section>
  )
}

export default DetailHeroContainer
