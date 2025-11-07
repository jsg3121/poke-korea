import Link from 'next/link'
import { useMemo } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { PokemonWithAbilityInfoFragment } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types/pokemonTypes.types'

interface PokemonByAbilityCardProps {
  pokemonData: PokemonWithAbilityInfoFragment
}

const PokemonByAbilityCardComponent = ({
  pokemonData,
}: PokemonByAbilityCardProps) => {
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
      href={`/detail/${pokemonData.number}`}
      className="block w-full md:w-56"
      aria-label={`포켓몬 ${pokemonData.name} 카드`}
    >
      <article
        className="w-full h-[20rem] md:h-80 text-[#333333] border border-solid border-[#333333] rounded-[10px] p-[0.75rem_0.5rem] md:p-[0.83333333rem_0.55555556rem] relative overflow-hidden shadow-[inset_10px_0_0_0_#334150,0_0_0px_0.25rem_#ffffff] cursor-pointer before:content-[''] before:absolute before:top-0 before:left-0 before:block before:border-t-[1.5rem] before:border-l-[1.5rem] before:border-r-[1.5rem] before:border-b-[1.5rem] before:border-t-[#334150] before:border-l-[#334150] before:border-r-transparent before:border-b-transparent transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] md:hover:scale-[1.2] md:hover:z-10"
        style={gradientStyle}
      >
        <header className="w-full h-8 flex items-start justify-between pr-2 relative z-10">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full h-5 flex items-start justify-between border-b border-solid border-[#334150] pb-1">
            <p className="h-4 text-base leading-none font-medium text-[#333333]">
              No.{pokemonNumber}
            </p>
            <h3 className="w-full text-base leading-none font-semibold text-right text-black">
              {pokemonData.name}
            </h3>
          </div>
        </header>

        <div
          ref={imgRef}
          className="w-fit mx-auto mb-4 md:mb-2 drop-shadow-[2px_3px_2px_#333333] relative pr-2"
        >
          {isVisible ? (
            <ImageComponent
              height="10rem"
              width="10rem"
              alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
              src={`${imageMode}/${pokemonData.imagePath ?? pokemonData.id}.webp?w=240&h=240`}
              fetchPriority="high"
              imageSize={{
                height: 140,
                width: 140,
              }}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          ) : (
            <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex items-center justify-center" />
          )}
        </div>

        <div className="w-full flex items-center justify-center gap-[0.4rem] px-2 mb-3">
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>
        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2">
          {formLabel && (
            <span className="h-6 leading-[calc(1.5rem+2px)] px-2 text-[0.75rem] bg-[#334150] text-white rounded-md font-medium">
              {formLabel}
            </span>
          )}
          {pokemonData.isHidden && (
            <span className="h-6 leading-[calc(1.5rem+2px)] px-2 text-[0.75rem] bg-[#F8D030] text-[#333333] rounded-md font-bold">
              숨겨진 특성
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

export default PokemonByAbilityCardComponent
