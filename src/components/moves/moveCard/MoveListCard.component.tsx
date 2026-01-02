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
      <article className="w-full min-h-40 bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative md:hover:scale-105 transition-transform">
        <header className="w-full h-8 mb-3 flex-between">
          <h3 className="w-full h-6 text-lg text-aligned-sm font-bold text-gray-900 flex gap-1">
            <span className="h-4 text-base text-primary-2">{moveData.id}.</span>
            {moveData.nameKo}
            {moveData.type && (
              <span
                className={`h-6 px-3 text-sm text-aligned-sm rounded-full chip-type-${moveData.type.toLowerCase()}`}
              >
                {PokemonTypes[moveData.type]}
              </span>
            )}
          </h3>
          <span
            className={
              damageType === '물리'
                ? 'badge-damage-physical'
                : damageType === '특수'
                  ? 'badge-damage-special'
                  : 'badge-damage-status'
            }
          >
            {damageType}
          </span>
        </header>
        <dl className="grid grid-cols-3 mb-3">
          <div className="w-full h-full text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-xs text-gray-600 mb-1">위력</dt>
            <dd className="text-base font-bold text-primary-1">
              {moveData.power || '-'}
            </dd>
          </div>
          <div className="w-full h-full text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-xs text-gray-600 mb-1">명중률</dt>
            <dd className="text-base font-bold text-primary-1">
              {moveData.accuracy || '-'}
            </dd>
          </div>
          <div className="w-full h-full text-center">
            <dt className="text-xs text-gray-600 mb-1">PP</dt>
            <dd className="text-base font-bold text-primary-1">
              {moveData.pp || '-'}
            </dd>
          </div>
        </dl>
        <p className="text-sm text-primary-2 font-semibold absolute bottom-4 left-4">
          세대별 기술 정보 보러 가기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveCard
