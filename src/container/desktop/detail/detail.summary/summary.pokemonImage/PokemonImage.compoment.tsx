'use client'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import IndicatorComponent from '../../../../../components/detail/Indicator.component'
import NextFormButtonComponent from '../../../../../components/detail/NextFormButton.component'
import PrevFormButtonComponent from '../../../../../components/detail/PrevFormButton.component'
import { getAltText, getImageList, getImageSrc } from '~/module/image.module'

const PokemonImageCompoment = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    gigantamaxInfo,
    activeType,
    activeIndex,
    normalFormImageList,
  } = useContext(DetailContext)
  const routerQuery = useSearchParams()

  const isShiny = routerQuery.get('shinyMode') === 'shiny'

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
  const totalCount = imageList?.length ?? 0
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < totalCount - 1
  const hasMultipleForms = totalCount > 1

  const currentItem = imageList?.[activeIndex]
  const prevItem = hasPrev ? imageList?.[activeIndex - 1] : null
  const nextItem = hasNext ? imageList?.[activeIndex + 1] : null

  return (
    <article
      className="w-[35rem] h-[25rem] [filter:drop-shadow(0px_-3px_3px_#000000)] flex items-center justify-center relative"
      aria-labelledby="pokemon-image-slide"
      role="region"
    >
      <p className="sr-only" id="pokemon-image-slide">
        포켓몬 이미지 정보
      </p>
      {hasMultipleForms && prevItem && (
        <PrevFormButtonComponent
          activeIndex={activeIndex}
          activeType={activeType}
          imageAlt={getAltText({
            activeType,
            isShiny,
            name: pokemonBaseInfo?.name ?? '',
            item: prevItem,
          })}
          imageSrc={getImageSrc({ imageCode: prevItem.imageCode, isShiny })}
          name={prevItem.name}
          pokemonNumber={pokemonBaseInfo?.number ?? 0}
          isShiny={isShiny}
        />
      )}
      {currentItem && (
        <div className="flex-center">
          <ImageComponent
            src={getImageSrc({ imageCode: currentItem.imageCode, isShiny })}
            width="25rem"
            height="25rem"
            alt={getAltText({
              activeType,
              isShiny,
              name: pokemonBaseInfo?.name ?? '',
              item: currentItem,
            })}
            className="pokemon-main"
            fetchPriority="high"
            imageSize={{
              width: 400,
              height: 400,
            }}
          />
        </div>
      )}
      {hasMultipleForms && nextItem && (
        <NextFormButtonComponent
          activeIndex={activeIndex}
          activeType={activeType}
          imageAlt={getAltText({
            activeType,
            isShiny,
            name: pokemonBaseInfo?.name ?? '',
            item: nextItem,
          })}
          imageSrc={getImageSrc({ imageCode: nextItem.imageCode, isShiny })}
          name={nextItem.name}
          pokemonNumber={pokemonBaseInfo?.number ?? 0}
          isShiny={isShiny}
        />
      )}
      {hasMultipleForms && (
        <IndicatorComponent
          activeIndex={activeIndex}
          activeType={activeType}
          isShiny={isShiny}
          pokemonNumber={pokemonBaseInfo?.number ?? 0}
          totalCount={totalCount}
        />
      )}
    </article>
  )
}

export default PokemonImageCompoment
