import { PokemonTypes } from '~/types/pokemonTypes.types'
import { TYPE_EFFECTIVENESS_CHART } from '~/constants/typeEffectivenessChart'
import { PokemonType } from '~/graphql/typeGenerated'

export interface AttackEffectiveness {
  double: Array<PokemonType>
  half: Array<PokemonType>
  zero: Array<PokemonType>
}

const toChartKey = (type: PokemonType): PokemonTypes => PokemonTypes[type]

const fromChartKey = (label: PokemonTypes): PokemonType =>
  Object.values(PokemonType).find(
    (type) => PokemonTypes[type] === label,
  ) as PokemonType

export const calculateAttackEffectiveness = (
  attackType: PokemonType,
): AttackEffectiveness => {
  const row = TYPE_EFFECTIVENESS_CHART[toChartKey(attackType)]

  const result: AttackEffectiveness = { double: [], half: [], zero: [] }

  ;(Object.keys(row) as Array<PokemonTypes>).forEach((defenseLabel) => {
    const value = row[defenseLabel]

    if (value === 2) {
      result.double.push(fromChartKey(defenseLabel))
    } else if (value === 0.5) {
      result.half.push(fromChartKey(defenseLabel))
    } else if (value === 0) {
      result.zero.push(fromChartKey(defenseLabel))
    }
  })

  return result
}
