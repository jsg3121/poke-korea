'use client'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import NextFormButtonComponent from '~/components/detail/NextFormButton.component'
import PrevFormButtonComponent from '~/components/detail/PrevFormButton.component'
import { DetailContext } from '~/context/Detail.context'
import { getAltText, getImageList, getImageSrc } from '~/module/image.module'

const PokemonImageCompoment = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
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
    <div
      className="w-[28rem] h-72 [filter:drop-shadow(0px_5px_5px_#000000)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center"
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
            width="18rem"
            height="18rem"
            alt={getAltText({
              activeType,
              isShiny,
              name: pokemonBaseInfo?.name ?? '',
              item: currentItem,
            })}
            imageSize={{ width: 216, height: 216 }}
            densities={[1, 1.5]}
            sizes="18rem"
            className="pokemon-main"
            fetchPriority="high"
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
    </div>
  )
}

export default PokemonImageCompoment
