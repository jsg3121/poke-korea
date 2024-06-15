import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styled from 'styled-components'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { imageMode } from '~/common'
import { Image } from '~/components'
import { DetailContext } from '~/context/src/Detail.context'

const PokemonImageCompoment: FC = () => {
  const {
    pokemonBaseInfo,
    megaEvolutions,
    regionFormInfo,
    normalForm,
    activeType,
  } = React.useContext(DetailContext)
  const router = useRouter()

  const defaultIndex = parseInt(router.query.activeIndex as string, 10) ?? 0

  const imageList = (() => {
    switch (activeType) {
      case 'mega': {
        const megaImages = megaEvolutions?.map((mega, index) => {
          return {
            imageCode: parseInt(
              `1${mega.pokemonNumber.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
          }
        })
        return megaImages
      }
      case 'region': {
        const regionImages = regionFormInfo?.map((region, index) => {
          return {
            imageCode: parseInt(
              `2${region.pokemonNumber.toString().padStart(3, '0')}${index
                ?.toString()
                .padStart(2, '0')}`,
              10,
            ),
          }
        })
        return regionImages
      }
      default: {
        if (normalForm && normalForm.length > 0) {
          const nomalFormImages = normalForm?.map((form) => {
            return {
              imageCode: form.imagePath,
            }
          })
          return nomalFormImages
        } else {
          const pokemonData = {
            imageCode: pokemonBaseInfo?.number,
          }
          return [pokemonData]
        }
      }
    }
  })()

  const handleSlideChange = (data: SwiperClass) => {
    const activeIndex = data.activeIndex
    router.replace(
      {
        query: {
          ...router.query,
          activeIndex,
        },
      },
      undefined,
      {
        scroll: false,
      },
    )
  }

  return (
    <Div>
      {imageList && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          onSlideChange={handleSlideChange}
          draggable={false}
          speed={150}
          initialSlide={defaultIndex}
          cssMode
        >
          {imageList.map((item) => {
            const imageSrc =
              router.query.shinyMode === 'shiny'
                ? `${imageMode}/shiny/${item.imageCode}.webp`
                : `${imageMode}/${item.imageCode}.webp`

            return (
              <SwiperSlide key={`pokemon-image-id-${item.imageCode}`}>
                <Image
                  src={imageSrc}
                  width="25rem"
                  height="25rem"
                  alt={`포켓몬 ${pokemonBaseInfo?.name}의 모습`}
                  className="pokemon-main"
                  unoptimized
                />
              </SwiperSlide>
            )
          })}
        </Swiper>
      )}
    </Div>
  )
}

export default PokemonImageCompoment

const Div = styled.div`
  width: 30rem;
  height: 25rem;
  filter: drop-shadow(0px -3px 3px #000000);

  .swiper-slide > div {
    margin: 0 auto;
  }
`
