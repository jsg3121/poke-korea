'use client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import ImageComponent from '~/components/Image.component'
import { DetailContext } from '~/context/Detail.context'
import { imageMode } from '~/module/buildMode'
import { PokemonTypes } from '~/types/pokemonTypes.types'

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
  const shinyQuery = isShiny ? '?shinyMode=shiny' : ''
  const baseUrl = `/detail/${pokemonBaseInfo?.number}`

  const getImageList = () => {
    switch (activeType) {
      case 'mega': {
        const megaImages = megaEvolutions?.map((mega, index) => {
          return {
            imageCode: parseInt(
              `1${mega.pokemonId.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
            types: mega.types,
            name: mega.name,
          }
        })
        return megaImages
      }
      case 'region': {
        const regionImages = regionFormInfo?.map((region, index) => {
          return {
            imageCode: parseInt(
              `2${region.pokemonId.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
            types: region.types,
            name: region.name,
          }
        })
        return regionImages
      }
      default: {
        if (normalFormImageList && normalFormImageList.length > 0) {
          const nomalFormImages = normalFormImageList?.map((imagePath) => {
            return {
              imageCode: imagePath,
              types: pokemonBaseInfo?.types,
              name: pokemonBaseInfo?.name,
            }
          })
          return nomalFormImages
        } else {
          const pokemonData = {
            imageCode: pokemonBaseInfo?.number,
            types: pokemonBaseInfo?.types,
            name: pokemonBaseInfo?.name,
          }
          return [pokemonData]
        }
      }
    }
  }

  // Path 기반 URL 생성
  const getFormUrl = (index: number) => {
    if (activeType === 'mega') {
      return index > 0
        ? `${baseUrl}/mega/${index}${shinyQuery}`
        : `${baseUrl}/mega${shinyQuery}`
    } else if (activeType === 'region') {
      return index > 0
        ? `${baseUrl}/region/${index}${shinyQuery}`
        : `${baseUrl}/region${shinyQuery}`
    } else {
      return index > 0
        ? `${baseUrl}/form/${index}${shinyQuery}`
        : `${baseUrl}${shinyQuery}`
    }
  }

  const imageList = getImageList()
  const totalCount = imageList?.length ?? 0
  const hasPrev = activeIndex > 0
  const hasNext = activeIndex < totalCount - 1
  const hasMultipleForms = totalCount > 1

  const currentItem = imageList?.[activeIndex]
  const prevItem = hasPrev ? imageList?.[activeIndex - 1] : null
  const nextItem = hasNext ? imageList?.[activeIndex + 1] : null

  const getAltText = (
    item: { types?: string[]; name?: string } | null | undefined,
  ) => {
    if (!item) return ''
    const typeText = item.types
      ?.map((type) => PokemonTypes[type as keyof typeof PokemonTypes])
      .join('/')
    return `${typeText} 타입 포켓몬 ${item.name || pokemonBaseInfo?.name}${activeType === 'region' ? ' 리전폼' : ''}${isShiny ? ' 이로치' : ''}의 이미지`
  }

  const getImageSrc = (imageCode: number | string | undefined) => {
    if (!imageCode) return ''
    return isShiny
      ? `${imageMode}/shiny/${imageCode}.webp`
      : `${imageMode}/${imageCode}.webp`
  }

  return (
    <div
      className="w-[27rem] h-72 [filter:drop-shadow(0px_5px_5px_#000000)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] flex items-center justify-center"
      aria-labelledby="pokemon-image-slide"
      role="region"
    >
      <p className="sr-only" id="pokemon-image-slide">
        포켓몬 이미지 정보
      </p>

      {/* 이전 폼 미리보기 */}
      {hasMultipleForms && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-16 z-10">
          {prevItem ? (
            <Link
              href={getFormUrl(activeIndex - 1)}
              className="block w-full h-full opacity-50 hover:opacity-80 transition-opacity"
              aria-label={`이전 폼: ${prevItem.name}`}
              prefetch={true}
            >
              <ImageComponent
                src={getImageSrc(prevItem.imageCode)}
                width="4rem"
                height="4rem"
                alt={getAltText(prevItem)}
                imageSize={{ width: 64, height: 64 }}
                loading="lazy"
              />
            </Link>
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      )}

      {/* 현재 폼 이미지 */}
      {currentItem && (
        <div className="flex-center">
          <ImageComponent
            src={getImageSrc(currentItem.imageCode)}
            width="18rem"
            height="18rem"
            alt={getAltText(currentItem)}
            imageSize={{ width: 216, height: 216 }}
            densities={[1, 1.5]}
            sizes="18rem"
            className="pokemon-main"
            fetchPriority="high"
          />
        </div>
      )}

      {/* 다음 폼 미리보기 */}
      {hasMultipleForms && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-16 h-16 z-10">
          {nextItem ? (
            <Link
              href={getFormUrl(activeIndex + 1)}
              className="block w-full h-full opacity-50 hover:opacity-80 transition-opacity"
              aria-label={`다음 폼: ${nextItem.name}`}
              prefetch={true}
            >
              <ImageComponent
                src={getImageSrc(nextItem.imageCode)}
                width="4rem"
                height="4rem"
                alt={getAltText(nextItem)}
                imageSize={{ width: 64, height: 64 }}
                loading="lazy"
              />
            </Link>
          ) : (
            <div className="w-full h-full" />
          )}
        </div>
      )}

      {/* 인디케이터 (dot) */}
      {hasMultipleForms && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
          {imageList?.map((_, index) => (
            <Link
              key={`indicator-${index}`}
              href={getFormUrl(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === activeIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`폼 ${index + 1}로 이동`}
              aria-current={index === activeIndex ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default PokemonImageCompoment
