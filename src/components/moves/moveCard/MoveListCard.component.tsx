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
      <article className="w-full min-h-[160px] bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative hover:scale-105 transition-transform">
        <header className="w-full h-8 mb-3 flex items-center justify-between">
          <h3 className="w-full h-6 text-[1.125rem] leading-[calc(1.5rem+2px)] font-bold text-gray-900 flex gap-1">
            <span className="h-4 text-[1rem] text-primary-2">
              {moveData.id}.
            </span>
            {moveData.nameKo}
            {moveData.type && (
              <span
                className={`h-6 px-3 text-[0.875rem] leading-[calc(1.5rem+2px)] rounded-full chip-type-${moveData.type.toLowerCase()}`}
              >
                {PokemonTypes[moveData.type]}
              </span>
            )}
          </h3>
          <span
            className={`h-7 shrink-0 px-3 text-[0.875rem] leading-[calc(1.75rem+2px)] font-semibold rounded-lg text-white ${
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
        <dl className="grid grid-cols-3 mb-3">
          <div className="w-full h-full text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-[0.75rem] text-gray-600 mb-1">위력</dt>
            <dd className="text-[1rem] font-bold text-primary-1">
              {moveData.power || '-'}
            </dd>
          </div>
          <div className="w-full h-full text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-[0.75rem] text-gray-600 mb-1">명중률</dt>
            <dd className="text-[1rem] font-bold text-primary-1">
              {moveData.accuracy || '-'}
            </dd>
          </div>
          <div className="w-full h-full text-center">
            <dt className="text-[0.75rem] text-gray-600 mb-1">PP</dt>
            <dd className="text-[1rem] font-bold text-primary-1">
              {moveData.pp || '-'}
            </dd>
          </div>
        </dl>
        <p className="text-[0.875rem] text-primary-2 font-semibold absolute bottom-4 left-4">
          세대별 기술 정보 보러 가기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveCard
