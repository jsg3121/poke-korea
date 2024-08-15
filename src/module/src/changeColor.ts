import { TypesColor } from '../../types'
import { changeType } from './changeType'

type ChangeColor = (types: Array<string>) => Array<TypesColor>

export const changeColor: ChangeColor = (types) => {
  const background: Array<TypesColor> = []
  types.map((item) => {
    return background.push(changeType(item).color)
  })
  return background
}
