'use client'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useContext } from 'react'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
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
    normalFormImageList,
  } = useContext(DetailContext)
  const router = useRouter()
  const routerQuery = useSearchParams()
  const pathname = usePathname()

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

  const handleSlideChange = (data: SwiperClass) => {
    const params = new URLSearchParams(routerQuery)

    const activeIndex = data.activeIndex
    params.set('activeIndex', activeIndex.toString())

    router.replace(`${pathname}?${params.toString()}`)
  }

  const defaultIndex = parseInt(
    (routerQuery.get('activeIndex') as string) ?? '0',
    10,
  )
  const imageList = getImageList()

  return (
    <div
      className="w-[27rem] h-72 [filter:drop-shadow(0px_5px_5px_#000000)] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[100] [&_.swiper-slide>figure]:mx-auto"
      aria-labelledby="pokemon-image-slide"
      role="region"
      aria-roledescription="carousel"
    >
      <p className="sr-only" id="pokemon-image-slide">
        포켓몬 이미지 정보
      </p>
      {imageList && (
        <Swiper
          key={`pokemon-id-${pokemonBaseInfo?.number}`}
          navigation={true}
          modules={[Navigation]}
          onSlideChange={handleSlideChange}
          draggable={false}
          speed={150}
          initialSlide={defaultIndex}
          cssMode
        >
          {imageList.map((item, index) => {
            const imageSrc =
              routerQuery.get('shinyMode') === 'shiny'
                ? `${imageMode}/shiny/${item.imageCode}.webp`
                : `${imageMode}/${item.imageCode}.webp`

            const typeText = item.types
              ?.map((type) => PokemonTypes[type])
              .join('/')

            const altText = `${typeText} 타입 포켓몬 ${item.name || pokemonBaseInfo?.name}${activeType === 'region' ? ' 리전폼' : ''}${routerQuery.get('shinyMode') === 'shiny' ? ' 이로치' : ''}의 이미지`

            return (
              <SwiperSlide key={`pokemon-image-id-${item.imageCode}`}>
                <ImageComponent
                  src={imageSrc}
                  width="18rem"
                  height="18rem"
                  alt={altText}
                  imageSize={{ width: 216, height: 216 }}
                  densities={[1, 1.5]}
                  sizes="18rem"
                  className="pokemon-main"
                  {...(normalFormImageList.length === 0
                    ? {
                        fetchPriority: 'high',
                      }
                    : {
                        ...(index === defaultIndex
                          ? {
                              fetchPriority: 'high',
                            }
                          : {
                              loading: 'lazy',
                            }),
                      })}
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </div>
  )
}

export default PokemonImageCompoment
