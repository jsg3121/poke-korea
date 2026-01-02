import Link from 'next/link'
import TagComponent from '~/components/Tag.component'
import { PokemonSkill } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveDetailCardProps {
  moveData: PokemonSkill
  moveLevel?: number | string
  generationId: number
}

const MoveDetailCard = ({
  moveData,
  moveLevel,
  generationId,
}: MoveDetailCardProps) => {
  const skillId = moveData.id
  const damageType = getDamageTypeKorean(moveData.damageType)

  return (
    <Link
      href={
        generationId === 9
          ? `/moves/${skillId}`
          : `/moves/${skillId}/generation/${generationId}`
      }
      className="block w-full"
      aria-label={`${moveData.nameKo} 기술 상세보기`}
    >
      <article className="w-full h-32 items-center flex gap-4 bg-primary-4 border-[2px] border-solid border-primary-1 rounded-xl shadow-[0_0_0px_3px_var(--color-primary-4)] p-4 relative hover:scale-105 transition-transform">
        {moveLevel && (
          <p className="w-16 h-24 shrink-0 text-center leading-[calc(6rem+2px)] bg-primary-1 text-white px-2 rounded-md text-[0.75rem] font-bold">
            Lv.{moveLevel}
          </p>
        )}
        <h3 className="w-fit h-6 shrink-0 text-[1.125rem] text-aligned-sm font-bold text-gray-900 flex gap-1">
          {moveData.nameKo}
          {moveData.type && (
            <span className="h-6 shrink-0">
              <TagComponent type={moveData.type} />
            </span>
          )}
        </h3>
        <p className="w-full">{moveData.description}</p>
        <dl className="w-80 h-24 shrink-0 grid grid-cols-4">
          <div className="w-full h-full flex flex-col justify-center text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="sr-only">위력</dt>
            <dd
              className={`w-16 h-7 block shrink-0 px-3 text-[0.875rem] text-center text-aligned-md font-semibold rounded-lg text-white ${
                damageType === '물리'
                  ? 'bg-[#fd8181]'
                  : damageType === '특수'
                    ? 'bg-[#9b9bfa]'
                    : 'bg-[#72d372]'
              }`}
            >
              {damageType}
            </dd>
          </div>
          <div className="w-full h-full flex flex-col justify-center text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-base text-gray-600 mb-1">위력</dt>
            <dd className="text-[1.375rem] font-bold text-primary-1">
              {moveData.power || '-'}
            </dd>
          </div>
          <div className="w-full h-full flex flex-col justify-center text-center relative after:absolute after:-right-0 after:bg-primary-3 after:top-0 after:h-full after:w-[2px]">
            <dt className="text-base text-gray-600 mb-1">명중률</dt>
            <dd className="text-[1.375rem] font-bold text-primary-1">
              {moveData.accuracy || '-'}
            </dd>
          </div>
          <div className="w-full h-full flex flex-col justify-center text-center">
            <dt className="text-base text-gray-600 mb-1">PP</dt>
            <dd className="text-[1.375rem] font-bold text-primary-1">
              {moveData.pp || '-'}
            </dd>
          </div>
        </dl>
      </article>
    </Link>
  )
}

export default MoveDetailCard
