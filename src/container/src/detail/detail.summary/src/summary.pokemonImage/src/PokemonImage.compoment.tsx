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

interface IFProps {}

const PokemonImageCompoment: FC<IFProps> = () => {
  const { pokemonBaseInfo, megaEvolutions, activeType } =
    React.useContext(DetailContext)
  const router = useRouter()

  const defaultIndex = parseInt(router.query.activeIndex as string, 10) ?? 0

  const imageList = React.useMemo(() => {
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
      default: {
        const pokemonData = {
          imageCode: pokemonBaseInfo?.number,
        }
        return [pokemonData]
      }
    }
  }, [activeType, megaEvolutions, pokemonBaseInfo])

  const handleSlideChange = (data: SwiperClass) => {
    const activeIndex = data.activeIndex
    router.replace({
      query: {
        ...router.query,
        activeIndex,
      },
    })
  }

  return (
    <Div>
      {imageList && (
        <Swiper
          navigation={true}
          modules={[Navigation]}
          onSlideChange={handleSlideChange}
          draggable={false}
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
`
