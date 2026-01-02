import Link from 'next/link'
import TagComponent from '~/components/Tag.component'
import { PokemonSkill } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'

interface MoveCardProps {
  moveData: PokemonSkill
  moveLevel?: number | string
  generationId: number
}

const MoveCard = ({ moveData, moveLevel, generationId }: MoveCardProps) => {
  const skillId = moveData.id

  return (
    <Link
      href={
        generationId === 9
          ? `/moves/${skillId}`
          : `/moves/${skillId}/generation/${generationId}`
      }
    >
      <article
        className={`w-[calc(100%-1rem)] min-h-14 border-b border-solid border-primary-4 bg-primary-4 rounded-[1rem] mx-auto mb-4 p-2 relative hover:bg-gray-100 cursor-pointer transition-colors`}
      >
        <header className="w-full h-8 flex items-center border-b border-solid border-primary-3 mb-2">
          {moveLevel && (
            <span className="w-[5rem] h-8 shrink-0 leading-[2rem+2px] absolute top-2.5 left-2">
              레벨 : <b className="font-bold">{moveLevel}</b>
            </span>
          )}
          <strong className="w-full h-8 text-center block text-[1.2rem] leading-[2rem] font-[600]">
            {moveData.nameKo}
          </strong>
          <span
            className={`absolute top-2 right-2 ${
              getDamageTypeKorean(moveData.damageType) === '물리'
                ? 'badge-damage-physical'
                : getDamageTypeKorean(moveData.damageType) === '특수'
                  ? 'badge-damage-special'
                  : 'badge-damage-status'
            }`}
          >
            {getDamageTypeKorean(moveData.damageType)}
          </span>
        </header>
        <dl className="w-full flex flex-wrap items-center [&>dt]:h-8 [&>dd]:font-[700] [&>dt]:leading-[2rem] [&>dd]:h-8 [&>dd]:leading-[2rem] ">
          <dt className="text-left w-[12%]">타입&nbsp;:</dt>
          <dd className="text-center w-[18%] flex items-center">
            {moveData.type && <TagComponent type={moveData.type} />}
          </dd>
          <dt className="text-center w-[13%]">위력&nbsp;:&nbsp;</dt>
          <dd className="text-left w-[9%]">{moveData.power || '-'}</dd>
          <dt className="text-center w-[17%]">명중률&nbsp;:&nbsp;</dt>
          <dd className="text-left w-[9%]">{moveData.accuracy || '-'}</dd>
          <dt className="text-center w-[13%]">PP&nbsp;:&nbsp;</dt>
          <dd className="text-left w-[9%]">{moveData.pp || '-'}</dd>
          <dt className="w-full text-center sr-only mt-1">설명</dt>
          <dd className="w-full !h-auto text-left !border-none mt-1 !font-normal">
            {moveData.description}
          </dd>
        </dl>
      </article>
    </Link>
  )
}

export default MoveCard
