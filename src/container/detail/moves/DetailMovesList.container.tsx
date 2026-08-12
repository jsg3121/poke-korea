'use client'

import { useContext } from 'react'
import MoveTableComponent, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { getDamageTypeChipColor } from '~/utils/skill.util'

/**
 * 습득 기술 목록 (UX-006) — 현재 학습법(레벨업 또는 기술머신) 한 종류만 노출한다.
 * 학습법 구분은 path 분리(/moves ↔ /moves/machine)라 이 컨테이너는 컨텍스트의
 * currentMovesType에 해당하는 목록만 MoveTable로 그린다(토글·동시 노출 폐기).
 *
 * MoveTable 행에 href를 주어 행 전체가 기술 상세로 가는 stretched-link가 된다.
 * 기술 상세 링크는 현재 선택 버전이 있으면 /moves/{id}/version/{vgId}, 최신이면
 * /moves/{id} — 구버전의 /generation/{genId}는 존재하지 않는 라우트(dead link)라 쓰지 않는다.
 */

const DetailMovesListContainer = () => {
  const {
    pokemonLearnableData,
    versionGroup,
    currentVersionGroupId,
    currentMovesType,
  } = useContext(DetailMovesContext)

  const isMachine = currentMovesType === 'MACHINE'

  // 활성 버전: 명시된 것 우선, 없으면 최신(목록 첫 항목). 기술 상세 링크 세그먼트 결정용.
  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const buildMoveHref = (skillId: string) =>
    currentVersionGroupId
      ? `/moves/${skillId}/version/${activeVersionId}`
      : `/moves/${skillId}`

  const versionName =
    versionGroup?.find((v) => v.versionGroupId === activeVersionId)
      ?.baseVersionGroupName ?? versionGroup?.[0]?.baseVersionGroupName

  const levelUpMoves: Array<MoveTableItem> = (
    pokemonLearnableData?.levelUpSkills ?? []
  ).map(({ level, skill }) => ({
    condition: level === 0 ? '진화' : level === 1 ? '최초' : `Lv.${level}`,
    name: skill.nameKo,
    type: skill.type,
    damageClass: getDamageTypeChipColor(skill.damageType),
    power: skill.power,
    accuracy: skill.accuracy,
    pp: skill.pp,
    href: buildMoveHref(skill.id),
  }))

  const machineMoves: Array<MoveTableItem> = (
    pokemonLearnableData?.machineSkills ?? []
  ).map(({ skill }) => ({
    condition: '머신',
    name: skill.nameKo,
    type: skill.type,
    damageClass: getDamageTypeChipColor(skill.damageType),
    power: skill.power,
    accuracy: skill.accuracy,
    pp: skill.pp,
    href: buildMoveHref(skill.id),
  }))

  const moves = isMachine ? machineMoves : levelUpMoves
  const title = isMachine
    ? '기술머신으로 배우는 기술'
    : '레벨업으로 배우는 기술'
  const ariaLabel = isMachine ? '머신 습득 기술 목록' : '레벨업 습득 기술 목록'
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
        <MoveTableComponent moves={moves} ariaLabel={ariaLabel} />
      ) : (
        <p className="py-8 text-center text-sm text-primary-2">
          해당 버전에서 {isMachine ? '기술머신으로' : '레벨업으로'} 배우는
          기술이 없습니다.
        </p>
      )}
    </section>
  )
}

export default DetailMovesListContainer
