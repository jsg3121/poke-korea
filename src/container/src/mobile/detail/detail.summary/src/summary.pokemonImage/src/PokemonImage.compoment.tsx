import { useRouter } from 'next/router'
import React, { FC } from 'react'
import styled from 'styled-components'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react'
import { imageMode } from '~/module'
import { Image } from '~/components'
import { DetailContext } from '~/context/src/Detail.context'

const Div = styled.div`
  width: 27rem;
  height: 18rem;
  filter: drop-shadow(0px 5px 5px #000000);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  .swiper-slide > div {
    margin: 0 auto;
  }
`

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
          key={`pokemon-id-${pokemonBaseInfo?.number}`}
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
                  width="18rem"
                  height="18rem"
                  alt={`도감번호 ${pokemonBaseInfo?.number}번 ${activeType === 'mega' ? '메가' : ''}${pokemonBaseInfo?.name} ${activeType === 'region' ? '리전폼' : ''}${router.query.shinyMode === 'shiny' ? '이로치' : ''}`}
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
