import Link from 'next/link'

import { PokemonSkill } from '~/graphql/typeGenerated'
import {
  getDamageTypeChipColor,
  getDamageTypeKorean,
  hasDamageType,
} from '~/utils/skill.util'
import Chip from '~/components/chip/Chip.component'
import Tag from '~/components/tag/Tag.component'

const LONG_NAME_LENGTH = 9

interface MoveListCardProps {
  moveData: PokemonSkill
}

const MoveListCard = ({ moveData }: MoveListCardProps) => {
  const damageColor = hasDamageType(moveData.damageType)
    ? getDamageTypeChipColor(moveData.damageType)
    : undefined

  const nameSizeClass =
    moveData.nameKo.length >= LONG_NAME_LENGTH
      ? 'text-sm desktop:text-base'
      : 'text-base desktop:text-lg'

  return (
    <Link
      href={`/moves/${moveData.id}`}
      className="block w-full"
      aria-label={`${moveData.nameKo} 기술 상세보기`}
    >
      <article className="w-full min-h-32 bg-primary-4 border-2 border-solid border-primary-1 rounded-xl shadow-[0_0_0_3px_var(--color-primary-4)] p-2.5 pb-8 relative transition-transform duration-150 desktop:min-h-36 desktop:p-3 desktop:pb-9 desktop:hover:-translate-y-0.5">
        <header className="mb-2 pb-1.5 border-b border-solid border-primary-1 flex items-center justify-between gap-2 desktop:mb-3 desktop:pb-2">
          <h3
            className={`${nameSizeClass} font-bold text-gray-900 leading-tight`}
          >
            <span className="text-xs desktop:text-sm font-normal text-primary-2">
              {moveData.id}.
            </span>
            &nbsp;
            {moveData.nameKo}
          </h3>
          <div className="flex shrink-0 items-center gap-1.5">
            {moveData.zMoves && <Chip label="Z기술" />}
            {moveData.type && <Tag type={moveData.type} />}
            {damageColor && (
              <Chip
                label={getDamageTypeKorean(moveData.damageType)}
                color={damageColor}
              />
            )}
          </div>
        </header>
        <dl className="grid grid-cols-3 text-center">
          <div className="border-r border-solid border-primary-2/40">
            <dt className="mb-0.5 text-xs text-primary-2">위력</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.power ?? '-'}
            </dd>
          </div>
          <div className="border-r border-solid border-primary-2/40">
            <dt className="mb-0.5 text-xs text-primary-2">명중률</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.accuracy ?? '-'}
            </dd>
          </div>
          <div>
            <dt className="mb-0.5 text-xs text-primary-2">PP</dt>
            <dd className="text-lg desktop:text-xl font-bold text-primary-1">
              {moveData.pp ?? '-'}
            </dd>
          </div>
        </dl>
        <p className="absolute bottom-2.5 left-2.5 text-xs text-primary-2 font-semibold desktop:bottom-3 desktop:left-3">
          세대별 기술 정보 보러가기 &gt;
        </p>
      </article>
    </Link>
  )
}

export default MoveListCard
