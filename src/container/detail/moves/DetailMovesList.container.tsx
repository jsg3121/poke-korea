'use client'

import { useContext } from 'react'
import MoveTableComponent, {
  MoveTableItem,
} from '~/components/moveTable/MoveTable.component'
import { DetailMovesContext } from '~/context/DetailMoves.context'
import { DEFAULT_LEARN_METHOD } from '~/module/movesParams.module'
import { getDamageTypeChipColor } from '~/utils/skill.util'

/**
 * 습득 기술 목록 (UX-006) — 현재 학습법 한 종류만 노출한다.
 * 학습법 구분은 path 분리(/moves ↔ /moves/machine ↔ /moves/egg …)라 이 컨테이너는
 * 컨텍스트의 currentLearnMethod에 해당하는 그룹만 MoveTable로 그린다.
 *
 * 습득법별 분기를 하드코딩하지 않는다 — 백엔드가 skillsByMethod 배열로 내려주므로
 * 해당 그룹을 찾아 그대로 렌더하면 알 기술·기술 가르침 등이 자동으로 표시된다.
 * 조건 라벨(Lv.12 / 진화 / 최초 / 기술머신)도 백엔드 conditionLabel을 쓴다 —
 * 기존엔 level 0=진화, 1=최초라는 도메인 규칙이 프론트에 하드코딩돼 있었다.
 *
 * MoveTable 행에 href를 주어 행 전체가 기술 상세로 가는 stretched-link가 된다.
 * 기술 상세 링크는 현재 선택 버전이 있으면 /moves/{id}/version/{vgId}, 최신이면
 * /moves/{id} — 구버전의 /generation/{genId}는 존재하지 않는 라우트(dead link)라 쓰지 않는다.
 */

const DetailMovesListContainer = () => {
  const {
    skillsByMethod,
    versionGroup,
    currentVersionGroupId,
    currentLearnMethod,
  } = useContext(DetailMovesContext)

  const activeMethod = currentLearnMethod ?? DEFAULT_LEARN_METHOD
  const activeGroup = skillsByMethod?.find(
    (group) => group.method === activeMethod,
  )

  // 활성 버전: 명시된 것 우선, 없으면 최신(목록 첫 항목). 기술 상세 링크 세그먼트 결정용.
  const activeVersionId =
    currentVersionGroupId ?? versionGroup?.[0]?.versionGroupId

  const buildMoveHref = (skillId: number) =>
    currentVersionGroupId
      ? `/moves/${skillId}/version/${activeVersionId}`
      : `/moves/${skillId}`

  // displayName은 백엔드가 DLC를 정규화한 표시 전용 단일 필드 — 화면마다 다른
  // 필드(nameKo/baseVersionGroupName)를 쓰던 표기 불일치를 이걸로 통일한다.
  const activeVersion = versionGroup?.find(
    (v) => v.versionGroupId === activeVersionId,
  )
  const versionName =
    (activeVersion ?? versionGroup?.[0])?.displayName ??
    (activeVersion ?? versionGroup?.[0])?.baseVersionGroupName

  const moves: Array<MoveTableItem> = (activeGroup?.skills ?? []).map(
    ({ conditionLabel, machineNumber, skill }) => ({
      // 기술머신은 번호(TM24)가 조건 라벨보다 정보량이 크다
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

  // 라벨도 백엔드 methodLabel을 쓴다 — 습득법이 늘어도 문구 수정이 불필요하다
  const methodLabel = activeGroup?.methodLabel ?? ''
  const title = methodLabel ? `${methodLabel}으로 배우는 기술` : '습득 기술'
  const ariaLabel = methodLabel
    ? `${methodLabel} 습득 기술 목록`
    : '습득 기술 목록'
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
          해당 버전에서 {methodLabel ? `${methodLabel}으로 ` : ''}배우는 기술이
          없습니다.
        </p>
      )}
    </section>
  )
}

export default DetailMovesListContainer
