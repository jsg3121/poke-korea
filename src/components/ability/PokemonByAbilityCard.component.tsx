'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { useDevice } from '~/context/Device.context'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types/pokemonTypes.types'

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
  isHighPriority?: boolean
}

const PokemonByAbilityCardComponent = ({
  pokemonData,
  isHighPriority = false,
}: PokemonByAbilityCardProps) => {
  const { isMobile } = useDevice()
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')

  // 커스텀 Lazy Loading Hook
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  // 타입별 배경색 계산
  const backgroundColor = useMemo(() => {
    const background: Array<CardColor> = []
    pokemonData.types.map((item) => {
      return background.push(CardColor[item])
    })
    return background
  }, [pokemonData])

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  // 폼 타입에 따른 표시 텍스트
  const getFormTypeLabel = () => {
    switch (pokemonData.formType) {
      case 'MEGA':
        return '메가진화'
      case 'REGION_FORM':
        return pokemonData.region ? `${pokemonData.region} 폼` : '지역 폼'
      case 'NORMAL_FORM':
        return pokemonData.formName || '폼'
      default:
        return null
    }
  }

  const formLabel = getFormTypeLabel()

  return (
    <Link
      href={{
        pathname: `/detail/${pokemonData.number}`,
        query: {
          ...(pokemonData.formType === 'REGION_FORM' && {
            activeType: 'region',
            activeIndex:
              pokemonData.imagePath?.[pokemonData.imagePath.length - 1] ?? 0,
          }),
          ...(pokemonData.formType === 'NORMAL_FORM' && {
            activeIndex: pokemonData.imagePath?.split('_')[1] ?? 0,
          }),
        },
      }}
      className="block w-full md:w-56"
      aria-label={`포켓몬 ${pokemonData.name} 카드 ${formLabel ? formLabel : ''}`}
    >
      <article
        className="w-full h-[20rem] md:h-80 text-black-2 border border-solid border-black-2 rounded-[10px] p-[0.75rem_0.5rem] md:p-[0.83333333rem_0.55555556rem] relative overflow-hidden shadow-[inset_10px_0_0_0_rgb(51_65_80),0_0_0px_0.25rem_#ffffff] cursor-pointer card-corner-fold transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] md:hover:scale-[1.2] md:hover:z-10"
        style={gradientStyle}
      >
        <header className="w-full min-h-8 flex items-start justify-between pr-2 relative z-10">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full min-h-5 flex items-start flex-wrap justify-between border-b border-solid border-card-accent pb-1 gap-2">
            <p className="h-4 text-base leading-none font-medium text-black-2">
              No.{pokemonNumber}
            </p>
            <h3 className="w-fit text-base leading-none font-semibold text-right text-black">
              {pokemonData.name}
            </h3>
          </div>
        </header>
        {isHighPriority ? (
          <div className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_rgb(51_51_51)] relative">
            <ImageComponent
              height={isMobile ? '8rem' : '10rem'}
              width={isMobile ? '8rem' : '10rem'}
              alt={`pokemon_id_${pokemonData.number} ${pokemonData.name} ${formLabel ? formLabel : ''}`}
              src={`${imageMode}/${pokemonData.imagePath ?? pokemonData.number}.webp?${isMobile ? 'w=144&h=144' : 'w=240&h=240'}`}
              sizes={isMobile ? '8rem' : '10rem'}
              fetchPriority="high"
            />
          </div>
        ) : (
          <div
            ref={imgRef}
            className="w-fit mx-auto mb-4 md:mb-2 drop-shadow-[2px_3px_2px_rgb(51_51_51)] relative pr-2"
          >
            {isVisible ? (
              <ImageComponent
                height={isMobile ? '8rem' : '10rem'}
                width={isMobile ? '8rem' : '10rem'}
                alt={`pokemon_id_${pokemonData.number} ${pokemonData.name} ${formLabel ? formLabel : ''}`}
                src={`${imageMode}/${pokemonData.imagePath ?? pokemonData.number}.webp?${isMobile ? 'w=144&h=144' : 'w=240&h=240'}`}
                sizes={isMobile ? '8rem' : '10rem'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  opacity: isLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease-in-out',
                }}
              />
            ) : (
              <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex-center" />
            )}
          </div>
        )}
        <div className="w-full flex-center gap-[0.4rem] px-2 mb-3">
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>
        <div className="w-full flex flex-wrap flex-center gap-2 px-2">
          {pokemonData.isHidden && (
            <strong className="h-6 text-aligned-sm px-2 text-xs bg-type-electric text-black-2 rounded-md font-bold">
              숨겨진 특성
            </strong>
          )}
        </div>
        {formLabel && (
          <p className="w-fit h-6 text-aligned-sm px-2 text-xs bg-card-accent text-white rounded-md font-medium mt-2 mx-auto">
            {formLabel}
          </p>
        )}
      </article>
    </Link>
  )
}

export default PokemonByAbilityCardComponent
