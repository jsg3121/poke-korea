import { PokemonType } from '~/graphql/typeGenerated'

import TypeMatchupSection, {
  TypeMatchupRow,
} from './TypeMatchupSection.component'

export interface TypeMatchupProps {
  quad: Array<PokemonType>
  double: Array<PokemonType>
  half: Array<PokemonType>
  quarter: Array<PokemonType>
  zero: Array<PokemonType>
}

const TypeMatchup = ({
  quad,
  double,
  half,
  quarter,
  zero,
}: TypeMatchupProps) => {
  const weaknessRows: Array<TypeMatchupRow> = [
    {
      label: '받는 데미지 4배',
      borderClass: 'border-grade-danger',
      types: quad,
    },
    {
      label: '받는 데미지 2배',
      borderClass: 'border-grade-warning',
      types: double,
    },
  ]
  const resistRows: Array<TypeMatchupRow> = [
    {
      label: '받는 데미지 0.5배',
      borderClass: 'border-grade-good',
      types: half,
    },
    {
      label: '받는 데미지 0.25배',
      borderClass: 'border-grade-better',
      types: quarter,
    },
    {
      label: '데미지를 받지 않음',
      borderClass: 'border-grade-best',
      types: zero,
    },
  ]

  const isEmpty = [...weaknessRows, ...resistRows].every(
    (row) => row.types.length === 0,
  )
  if (isEmpty) return null

  return (
    <div className="grid w-full grid-cols-1 gap-4 desktop:grid-cols-2 desktop:gap-8">
      <TypeMatchupSection
        title="약점"
        description="받는 데미지 증가"
        rows={weaknessRows}
      />
      <TypeMatchupSection
        title="강점"
        description="받는 데미지 감소"
        rows={resistRows}
      />
    </div>
  )
}

export default TypeMatchup
