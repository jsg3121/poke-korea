'use client'

import Link from 'next/link'
import { useContext, useState } from 'react'
import {
  EffectivenessValue,
  TYPE_EFFECTIVENESS_CHART,
  TYPE_ORDER,
} from '~/constants/typeEffectivenessChart'
import { TypeEffectivenessContext } from '~/context/TypeEffectiveness.context'
import { PokemonType } from '~/graphql/typeGenerated'
import { buildTypeDetailPath } from '~/module/typeParams.module'
import { PokemonTypes } from '~/types/pokemonTypes.types'
import TableActivePointerComponent, {
  ActivePointerType,
} from './TableActivePointer.component'

/**
 * 18×18 타입 상성표 (반응형 단일 — UX-009). 구버전 데/모 2벌
 * typeEffectiveness.table을 대체한다.
 *
 * 구버전 모바일은 `w-full table-fixed`로 324셀을 뷰포트에 욱여넣어 셀이 ~15px로
 * 압축, 텍스트가 세로로 분해되던 결함(UX-009 C1, WCAG 1.4.10). 매트릭스형
 * 데이터는 카드 전환이 불가능하므로(두 축 모두 18개 카테고리) 가로 스크롤 +
 * sticky 첫 열(행 헤더) + 셀 최소 폭(min-w-11=44px)으로 전환한다. 데스크톱은
 * 폭 여유가 있어 자연히 전체 수용된다. 카드형 경계(rounded border)로 "별도
 * 스크롤 위젯"임을 형태로 신호하고, 스크롤 컨테이너에 tabindex+aria-label로
 * 키보드 접근을 보장한다(W3C scrollable region).
 *
 * 계산기 연동(UX-009 §3-3): 계산기에서 선택한 상대 타입 = 이 표의 "공격받는
 * 포켓몬" 축(열)이므로 해당 열을 하이라이트하고 모바일에선 스크롤 인한다.
 * 구버전은 Provider가 계산기만 감싸 연동이 불가능했다 — Provider를 뷰 최상위로
 * 승격해 해결. 배율 필터(activePointer) 강조는 셀 텍스트 채널이라 열 배경
 * 하이라이트와 동시 적용 가능.
 *
 * sticky 셀은 배경이 투명하면 스크롤 콘텐츠가 비쳐 보이므로 반드시 불투명
 * 배경을 준다. border-collapse는 sticky와 함께 쓰면 브라우저별로 테두리가
 * 스크롤을 따라가는 버그가 있어 border-separate + 셀별 보더를 쓴다.
 */

/**
 * 표의 한글 타입 라벨(PokemonTypes) → GraphQL enum(PokemonType).
 *
 * 이 표는 TYPE_ORDER(한글 값 enum)로 순회하는데 링크 경로는 영문 enum이
 * 필요하다. 상세 페이지 링크를 걸면서 생긴 경계 변환이다.
 */
const toPokemonType = (label: PokemonTypes): PokemonType =>
  Object.values(PokemonType).find(
    (type) => PokemonTypes[type] === label,
  ) as PokemonType

/** 상성 배율별 표시 라벨·색·활성 강조 규칙 (데/모 단일 — 구버전 데스크톱 표기 통일) */
const VALUE_STYLE: Record<
  Exclude<EffectivenessValue, 1>,
  { label: string; color: string; active: ActivePointerType }
> = {
  2: { label: '2배', color: 'text-green-600', active: 'double' },
  0.5: { label: '0.5배', color: 'text-yellow-600', active: 'half' },
  0: { label: '0배', color: 'text-gray-500', active: 'zero' },
}

const TypeEffectivenessTableContainer = () => {
  const { selectTypeList } = useContext(TypeEffectivenessContext)
  const [activeType, setActiveType] = useState<ActivePointerType>(undefined)

  // 계산기 선택 타입(상대 = 방어 축)의 한글 라벨 — 열 하이라이트 기준.
  // 선택 시 표로 자동 스크롤 인하는 동작은 제거(사용자 결정 2026-07-20) —
  // 계산기 조작 중 화면이 표 쪽으로 튀어 조작 흐름을 끊는다. 하이라이트만 유지.
  const selectedDefenseTypes = selectTypeList.map((type) => PokemonTypes[type])

  const handleClickActiveEffective = (effectiveType: ActivePointerType) => {
    setActiveType((prev) =>
      prev === effectiveType ? undefined : effectiveType,
    )
  }

  const renderCell = (attackType: PokemonTypes, defenseType: PokemonTypes) => {
    const value = TYPE_EFFECTIVENESS_CHART[attackType][defenseType]
    const key = `cell-${attackType}-${defenseType}`
    const selectedColumn = selectedDefenseTypes.includes(defenseType)
    const columnBg = selectedColumn ? 'bg-primary-3/25' : ''
    const base = `h-10 min-w-11 border-b border-r border-solid border-primary-3/50 text-center align-middle text-xs desktop:h-12 desktop:text-sm ${columnBg}`

    if (value === 1) {
      return <td key={key} className={base} />
    }

    const { label, color, active } = VALUE_STYLE[value]
    const emphasized =
      activeType === active ? 'font-bold text-sm desktop:text-base' : ''
    const dimmed = activeType && activeType !== active ? 'opacity-30' : ''

    // 흐림(opacity)은 td가 아니라 내부 span에만 건다 — td에 걸면 셀 보더까지
    // 같이 흐려져 필터 활성화 시 표의 라인이 사라져 보인다(로컬 피드백 2026-07-20)
    return (
      <td key={key} className={`${base} ${color}`}>
        <span className={`${emphasized} ${dimmed}`}>{label}</span>
      </td>
    )
  }

  return (
    <section
      className="w-full pt-8 desktop:pt-10"
      aria-labelledby="pokemon-type-effectiveness-table"
    >
      <header className="mb-3 flex flex-col gap-3 desktop:flex-row desktop:items-center desktop:justify-between">
        <h2
          id="pokemon-type-effectiveness-table"
          className="text-xl desktop:text-3xl font-semibold text-primary-4 leading-tight"
        >
          타입별 상성 표
        </h2>
        <TableActivePointerComponent
          activeType={activeType}
          onClickPointer={handleClickActiveEffective}
          onClickResetEffective={() => setActiveType(undefined)}
        />
      </header>
      {/* 계산기(2타입 조합, 4배/0.25배 파생)와 표(단일 대 단일, 0/0.5/1/2배)의
          배율 체계가 달라 혼동을 막는 안내(UX-009 M4) */}
      <p className="mb-3 text-sm text-primary-3">
        ※ 단일 타입 기준 배율이에요. 세로축이 공격하는 타입, 가로축이 공격받는
        타입입니다.
      </p>

      <div
        tabIndex={0}
        role="group"
        aria-label="타입별 상성 표, 가로로 스크롤할 수 있어요"
        className="w-full overflow-x-auto overflow-y-hidden rounded-2xl border border-solid border-primary-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-4"
      >
        <table className="w-full border-separate border-spacing-0 bg-primary-4">
          <thead>
            <tr>
              {/* 코너 셀 — 축 안내. sticky 행 헤더 열과 같은 열이라 함께 고정 */}
              <th
                scope="col"
                className="sticky left-0 z-10 min-w-14 border-b border-r border-solid border-primary-2 bg-primary-2 p-1 text-2xs leading-tight text-white desktop:min-w-16 desktop:text-xs"
              >
                <span className="block">방어 →</span>
                <span className="block">공격 ↓</span>
              </th>
              {TYPE_ORDER.map((defenseType) => {
                const selected = selectedDefenseTypes.includes(defenseType)
                return (
                  <th
                    key={`col-${defenseType}`}
                    scope="col"
                    className={`h-10 min-w-11 border-b border-r border-solid border-primary-2 bg-primary-3 text-center align-middle text-xs text-black desktop:h-12 desktop:text-sm ${
                      selected ? 'font-bold underline underline-offset-2' : ''
                    }`}
                  >
                    {defenseType}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {TYPE_ORDER.map((attackType) => (
              <tr key={`row-${attackType}`}>
                {/* 행 헤더(공격 축)만 타입 상세로 링크한다. 열 헤더는 걸지
                    않는다 — sticky로 상시 노출되는 데다 셀 폭이 44px이라
                    가로 스크롤 중 오탭 위험이 크다. 앵커 텍스트가 타입명
                    단독이라 aria-label로 목적지를 보강한다(§15). */}
                <th
                  scope="row"
                  // h-10/h-12: 링크를 넣으며 p-0으로 바꾸는 바람에 셀 높이를
                  // 결정하던 패딩이 사라졌다. 다른 셀(td·열 헤더)과 같은 높이를
                  // 명시해야 내부 링크의 h-full이 해석되고 터치 타겟이 확보된다.
                  className="sticky left-0 z-10 h-10 min-w-14 border-b border-r border-solid border-primary-3 bg-primary-2 p-0 text-center align-middle text-xs text-white desktop:h-12 desktop:min-w-16 desktop:text-sm"
                >
                  <Link
                    href={buildTypeDetailPath(toPokemonType(attackType))}
                    aria-label={`${attackType} 타입 약점과 상성 보기`}
                    className="flex h-full w-full items-center justify-center px-1 py-2 hover:underline focus-visible:underline"
                  >
                    {attackType}
                  </Link>
                </th>
                {TYPE_ORDER.map((defenseType) =>
                  renderCell(attackType, defenseType),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 표 하단에 타입 상세 링크 그리드를 두지 않는다.
          한때 "커버리지 안전망"으로 넣었으나, 그 논리는 상단 빠른 링크가
          6개였을 때만 유효했다. 빠른 링크가 18개 전체가 된 이상 같은 목적지를
          가리키는 목록이 한 페이지에 둘이 되어 중복이다. 표 안의 행 헤더 링크와
          상단 빠른 링크로 모든 타입이 이미 링크를 받는다. */}
    </section>
  )
}

export default TypeEffectivenessTableContainer
