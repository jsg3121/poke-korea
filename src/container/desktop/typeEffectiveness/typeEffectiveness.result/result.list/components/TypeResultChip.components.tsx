import Link from 'next/link'
import ImageComponent from '~/components/Image.component'
import { PokemonType } from '~/graphql/typeGenerated'
import { CardColor, PokemonTypes } from '~/types/pokemonTypes.types'

interface TypeResultChipComponentsProps {
  typeLabel: PokemonTypes
  typeValue: PokemonType
}

const TypeResultChipComponents = ({
  typeLabel,
  typeValue,
}: TypeResultChipComponentsProps) => {
  return (
    <Link
      href={`/list?type=${typeValue}`}
      aria-label={`${typeLabel} 타입 포켓몬 도감 보기`}
      style={{
        backgroundColor: CardColor[typeValue],
      }}
      className="min-w-16 h-12 rounded-2xl text-base text-aligned-sm text-center shadow-[1px_2px_6px_var(--color-primary-1)] flex gap-1 py-3 pr-4 pl-3 transition-opacity hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
    >
      <i className="w-6 h-6 block drop-shadow-[1px_1px_1px_var(--color-primary-2)]">
        <ImageComponent
          alt={`${typeLabel} 타입 필터 선택`}
          height="1.5rem"
          width="1.5rem"
          imageSize={{ width: 24, height: 24 }}
          src={`/assets/type/${typeValue.toLowerCase()}.svg`}
        />
      </i>
      {typeLabel}
    </Link>
  )
}

export default TypeResultChipComponents
