import Link from 'next/link'
import { PokemonSkill } from '~/graphql/typeGenerated'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveCardProps {
  moveData: PokemonSkill
}

const MoveCard = ({ moveData }: MoveCardProps) => {
  const skillId = moveData.id
  const damageType = getDamageTypeKorean(moveData.damageType)

  return (
    <Link
      href={`/moves/${skillId}`}
      className="block w-full"
      aria-label={`${moveData.nameKo} 기술 상세보기`}
    >
      <article className="w-full min-h-[180px] bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative hover:shadow-lg transition-shadow">
        <header className="mb-3 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-[1.25rem] font-bold text-gray-900 mb-2">
              {moveData.nameKo}
            </h3>
            {moveData.type && (
              <span
                className={`inline-block px-3 py-1 text-[0.875rem] text-white rounded-full chip-type-${moveData.type.toLowerCase()}`}
              >
                {PokemonTypes[moveData.type]}
              </span>
            )}
          </div>
          <span
            className={`px-3 py-1 text-[0.875rem] font-semibold rounded-lg text-white ${
              damageType === '물리'
                ? 'bg-[#fd8181]'
                : damageType === '특수'
                  ? 'bg-[#9b9bfa]'
                  : 'bg-[#72d372]'
            }`}
          >
            {damageType}
          </span>
        </header>

        <div className="grid grid-cols-3 gap-3 mb-3">
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-600 mb-1">위력</p>
            <p className="text-[1rem] font-bold text-primary-1">
              {moveData.power || '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-600 mb-1">명중률</p>
            <p className="text-[1rem] font-bold text-primary-1">
              {moveData.accuracy || '-'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-[0.75rem] text-gray-600 mb-1">PP</p>
            <p className="text-[1rem] font-bold text-primary-1">
              {moveData.pp || '-'}
            </p>
          </div>
        </div>

        <p className="text-[0.875rem] text-primary-2 font-semibold absolute bottom-4 left-4">
          자세히 보기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveCard
