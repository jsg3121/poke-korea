import { PokemonSkill } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveTableRowProps {
  moveData: PokemonSkill
  moveLevel?: number | string
}

const MoveTableRow = ({ moveData, moveLevel }: MoveTableRowProps) => {
  return (
    <tr className={`min-h-14 border-b border-solid border-primary-3`}>
      {moveLevel ? <td className="text-center">{moveLevel}</td> : <></>}
      <td
        className={`text-center leading-[3.5rem] font-[600] ${moveData.nameKo.replace(/[\\(,\\)]/g, '').length > 9 && 'text-[0.8rem]'}`}
      >
        {moveData.nameKo}
      </td>
      <td className="align-middle">{moveData.description}</td>
      <td className="text-center">
        {moveData.type && (
          <span
            className={`max-w-[3.875rem] h-6 px-2 text-[0.875rem] text-white leading-[calc(1.5rem+3px)] chip-type-${moveData.type.toLowerCase()} mx-auto block rounded-[1rem]`}
          >
            {PokemonTypes[moveData.type]}
          </span>
        )}
      </td>
      <td className="text-center leading-[3.5rem]">{moveData.power || '-'}</td>
      <td className="text-center leading-[3.5rem]">
        {moveData.accuracy || '-'}
      </td>
      <td className="text-center leading-[3.5rem]">{moveData.pp || '-'}</td>
      <td
        className={`text-center leading-[3.5rem]
                ${
                  getDamageTypeKorean(moveData.damageType) === '물리'
                    ? 'bg-[#fd8181]'
                    : getDamageTypeKorean(moveData.damageType) === '특수'
                      ? 'bg-[#9b9bfa]'
                      : 'bg-[#72d372]'
                }`}
      >
        {getDamageTypeKorean(moveData.damageType)}
      </td>
    </tr>
  )
}

export default MoveTableRow
