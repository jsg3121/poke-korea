import Link from 'next/link'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import { PokemonLearnInfo } from '~/graphql/typeGenerated'
import { useLazyImage } from '~/hook/useLazyImage'
import { imageMode } from '~/module/buildMode'

interface PokemonBySkillCardProps {
  pokemonData: PokemonLearnInfo
}

const PokemonBySkillCard = ({ pokemonData }: PokemonBySkillCardProps) => {
  const pokemonNumber = String(pokemonData.number).padStart(3, '0')

  // 커스텀 Lazy Loading Hook
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  // 폼 타입에 따른 표시 텍스트
  const getFormTypeLabel = () => {
    switch (pokemonData.formType) {
      case 'REGION':
        return pokemonData.formName || '지역 폼'
      case 'NORMAL':
        return pokemonData.formName || '폼'
      default:
        return null
    }
  }

  const formLabel = getFormTypeLabel()

  // 습득 방법 텍스트
  const getMethodLabel = () => {
    switch (pokemonData.method) {
      case 'LEVEL_UP':
        return pokemonData.level ? `Lv.${pokemonData.level}` : '레벨업'
      case 'MACHINE':
        return '기술머신'
      case 'EGG':
        return '알'
      default:
        return ''
    }
  }

  const methodLabel = getMethodLabel()

  return (
    <Link
      href={`/detail/${pokemonData.number}`}
      className="block w-full md:w-56"
      aria-label={`포켓몬 ${pokemonData.name} 카드`}
    >
      <article className="w-full h-[20rem] md:h-80 text-[#333333] bg-gradient-to-br from-blue-100 to-blue-200 border border-solid border-[#333333] rounded-[10px] p-[0.75rem_0.5rem] md:p-[0.83333333rem_0.55555556rem] relative overflow-hidden shadow-[inset_10px_0_0_0_#334150,0_0_0px_0.25rem_#ffffff] cursor-pointer before:content-[''] before:absolute before:top-0 before:left-0 before:block before:border-t-[1.5rem] before:border-l-[1.5rem] before:border-r-[1.5rem] before:border-b-[1.5rem] before:border-t-[#334150] before:border-l-[#334150] before:border-r-transparent before:border-b-transparent transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] md:hover:scale-105 md:hover:z-10">
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
              src={`${imageMode}/${pokemonData.number}.webp?w=240&h=240`}
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

        <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2">
          {/* 습득 방법 */}
          <span className="h-6 leading-[calc(1.5rem+2px)] px-3 text-[0.875rem] bg-[#334150] text-white rounded-md font-bold">
            {methodLabel}
          </span>

          {/* 폼 타입 */}
          {formLabel && (
            <span className="h-6 leading-[calc(1.5rem+2px)] px-2 text-[0.75rem] bg-gray-600 text-white rounded-md font-medium">
              {formLabel}
            </span>
          )}
        </div>
      </article>
    </Link>
  )
}

export default PokemonBySkillCard
