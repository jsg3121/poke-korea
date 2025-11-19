import Link from 'next/link'
import BallComponent from '~/components/Ball.component'
import TagComponent from '~/components/Tag.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import {
  pokemonNumberFormat,
  getBackgroundColor,
} from '~/module/pokemonCard.module'
import ImageComponent from '~/components/Image.component'
import { imageMode } from '~/module/buildMode'
import { useLazyImage } from '~/hook/useLazyImage'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

const PokemonCardComponent = ({ pokemonData }: CardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)
  const backgroundColor = getBackgroundColor(pokemonData.types)

  // 커스텀 Lazy Loading Hook (200px 이내 영역에서 이미지 로드)
  const { imgRef, isVisible, isLoaded, handleImageLoad, handleImageError } =
    useLazyImage({
      rootMargin: '200px',
      threshold: 0.1,
    })

  const gradientStyle =
    backgroundColor.length === 1
      ? { backgroundColor: backgroundColor[0] }
      : {
          backgroundImage: `linear-gradient(135deg, ${backgroundColor[0]} 35%, ${backgroundColor[1]} 65%)`,
        }

  return (
    <Link href={`/detail/${pokemonData.number}`} className="w-56">
      <article
        className="w-56 h-80 text-[#333333] border border-solid border-[#333333] rounded-[10px] block p-[0.83333333rem_0.55555556rem] outline-[0.25rem] outline outline-white relative overflow-hidden shadow-[inset_10px_0_0_0_#334150] cursor-pointer transition-transform duration-300 ease-[cubic-bezier(0.03,0.57,0.37,1.02)] hover:scale-[1.2] hover:z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:block before:border-t-[1.5rem] before:border-l-[1.5rem] before:border-r-[1.5rem] before:border-b-[1.5rem] before:border-t-[#334150] before:border-l-[#334150] before:border-r-transparent before:border-b-transparent"
        style={gradientStyle}
        aria-label={`포켓몬 ${pokemonData.name} 카드`}
      >
        <header className="w-full h-8 flex items-start justify-between">
          <i className="w-8 h-8 flex-shrink-0 mr-2">
            <BallComponent />
          </i>
          <div className="w-full h-5 flex items-start justify-between border-b border-solid border-[#334150] pb-1">
            <p className="h-4 text-base leading-none font-medium text-[#333333]">
              No.{pokemonNumber}
            </p>
            <h3 className="w-full h-4 text-base leading-none font-semibold text-right text-black">
              {pokemonData.name}
            </h3>
          </div>
        </header>
        <div
          ref={imgRef}
          className="w-fit mx-auto mb-2 drop-shadow-[2px_3px_2px_#333333] relative"
          aria-description="포켓몬 이미지"
        >
          {isVisible ? (
            <ImageComponent
              height="10rem"
              width="10rem"
              alt={`pokemon_id_${pokemonData.number}`}
              src={`${imageMode}/${pokemonData.number}.webp?w=240&h=240`}
              sizes="10rem"
              fetchPriority="high"
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
            />
          ) : (
            // Placeholder: 이미지 로딩 전 스켈레톤
            <div className="w-40 h-40 bg-gray-300 opacity-30 animate-pulse rounded-lg flex items-center justify-center" />
          )}
        </div>
        <div
          className="flex items-center gap-[0.38888889rem] px-[0.55555556rem]"
          aria-description="포켓몬 타입 정보"
        >
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>
        <dl
          className="w-full grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-[0.55555556rem] px-[0.55555556rem]"
          aria-description="포켓몬 능력치 정보"
        >
          <dt className="h-5 text-sm leading-5 even:ml-4">체력</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.hp}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.attack}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialAttack}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.defense}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialDefense}
          </dd>
          <dt className="h-5 text-sm ml-4 leading-5 even:ml-4">스피드</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.speed}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default PokemonCardComponent
