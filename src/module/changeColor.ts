import { PokemonType } from '~/graphql/typeGenerated'
import { TypesColor } from '../types'

type ChangeColor = (types: Array<PokemonType>) => Array<TypesColor>

export const changeColor: ChangeColor = (types) => {
  const background: Array<TypesColor> = []
  types.map((item) => {
    return background.push(TypesColor[item])
  })
  return background
}
