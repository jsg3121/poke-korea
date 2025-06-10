import Link from 'next/link'
import { useMemo } from 'react'
import BallComponent from '~/components/Ball.component'
import ImageComponent from '~/components/Image.component'
import TagComponent from '~/components/Tag.component'
import { PokemonCardFragment } from '~/graphql/typeGenerated'
import { imageMode } from '~/module/buildMode'
import { CardColor } from '~/types/pokemonTypes.types'
import { pokemonNumberFormat } from '../module/pokemonNumberFormat'

interface CardComponentProps {
  pokemonData: PokemonCardFragment
}

const CardComponent = ({ pokemonData }: CardComponentProps) => {
  const pokemonNumber = pokemonNumberFormat(pokemonData.number)

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

  return (
    <Link href={`/detail/${pokemonData.number}`}>
      <article
        className="w-full h-[21rem] text-[#333333] border border-solid border-[#333333] rounded-[10px] p-[0.83333333rem_0.55555556rem] relative overflow-hidden shadow-[inset_10px_0_0_0_#334150,0_0_0px_0.25rem_#ffffff] cursor-pointer before:content-[''] before:absolute before:top-0 before:left-0 before:block before:border-t-[1.5rem] before:border-l-[1.5rem] before:border-r-[1.5rem] before:border-b-[1.5rem] before:border-t-[#334150] before:border-l-[#334150] before:border-r-transparent before:border-b-transparent"
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
            <h3 className="w-full text-base leading-none font-semibold text-right text-black">
              {pokemonData.name}
            </h3>
          </div>
        </header>
        <div
          className="w-fit mx-auto mb-4 drop-shadow-[2px_3px_2px_#333333] relative"
          aria-description="포켓몬 이미지"
        >
          <ImageComponent
            height="10rem"
            width="10rem"
            alt={`pokemon_id_${pokemonData.number} ${pokemonData.name}`}
            src={`${imageMode}/${pokemonData.number}.webp`}
            sizes="10rem"
            unoptimized
          />
        </div>
        <div
          className="w-full max-w-[18rem] flex items-center gap-[0.4rem] px-2 mx-auto"
          aria-description="포켓몬 타입 정보"
        >
          {pokemonData.types.map((item, index) => {
            return <TagComponent key={`${item}-id-${index}`} type={item} />
          })}
        </div>
        <dl
          className="w-full max-w-[19rem] grid grid-rows-[repeat(3,_1fr)] grid-cols-[35%_15%_35%_15%] mt-4 mx-auto pl-2"
          aria-description="포켓몬 능력치 정보"
        >
          <dt className="h-5 text-sm leading-5 even:ml-4">체력</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.hp}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4 ml-4">공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.attack}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수공격</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialAttack}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4 ml-4">방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.defense}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4">특수방어</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.specialDefense}
          </dd>
          <dt className="h-5 text-sm leading-5 even:ml-4 ml-4">스피드</dt>
          <dd className="h-5 text-sm leading-5 text-right text-black">
            {pokemonData.pokemonStats.speed}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default CardComponent
