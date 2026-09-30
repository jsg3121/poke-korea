'use client'

import { useContext } from 'react'

import { getDamageTypeChipColor } from '~/utils/skill.util'
import { DEFAULT_LEARN_METHOD } from '~/modules/movesParams.module'
import { useLearnMethodLabels } from '~/hooks/useLearnMethodLabels'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import MoveTable, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'

const DetailMovesList = () => {
  const {
    skillsByMethod,
    versionGroup,
    currentVersionGroupId,
    currentLearnMethod,
  } = useContext(DetailMovesContext)

  const { getLabel } = useLearnMethodLabels()

  const activeMethod = currentLearnMethod ?? DEFAULT_LEARN_METHOD
  const activeGroup = skillsByMethod?.find(
    (group) => group.method === activeMethod,
  )

  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const buildMoveHref = (skillId: number) =>
    currentVersionGroupId
      ? `/moves/${skillId}/version/${activeVersionId}`
      : `/moves/${skillId}`

  const activeVersion = versionGroup?.find(
    (v) => v.versionGroupId === activeVersionId,
  )
  const versionName =
    (activeVersion ?? versionGroup?.[0])?.displayName ??
    (activeVersion ?? versionGroup?.[0])?.baseVersionGroupName

  const moves: Array<MoveTableItem> = (activeGroup?.skills ?? []).map(
    ({ conditionLabel, machineNumber, skill }) => ({
      condition: machineNumber ?? conditionLabel,
      name: skill.nameKo,
      type: skill.type,
      damageClass: getDamageTypeChipColor(skill.damageType),
      power: skill.power,
      accuracy: skill.accuracy,
      pp: skill.pp,
      href: buildMoveHref(skill.skillId),
    }),
  )

  const methodLabel = getLabel(activeMethod)
  const title = `${methodLabel}으로 배우는 기술`
  const ariaLabel = `${methodLabel} 습득 기술 목록`
  const titleId = 'detail-moves-list-title'

  return (
    <section aria-labelledby={titleId} className="card-detail">
      <h2
        id={titleId}
        className="mb-3 flex items-center gap-2 border-b-2 border-solid border-primary-1 pb-2 text-base font-bold text-primary-1 desktop:text-lg"
      >
        {title}
      </h2>
      {versionName && (
        <p className="mb-3 text-sm text-primary-2">
          버전 : <b className="font-bold">{versionName}</b>
        </p>
      )}
      {moves.length > 0 ? (
        <MoveTable moves={moves} ariaLabel={ariaLabel} />
      ) : (
        <p className="py-8 text-center text-sm text-primary-2">
          해당 버전에서 {methodLabel}으로 배우는 기술이 없습니다.
        </p>
      )}
    </section>
  )
}

export default DetailMovesList
