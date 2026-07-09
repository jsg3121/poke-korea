'use client'

import { useContext } from 'react'
import TagComponent from '~/components/tag/Tag.component'
import { DetailContext } from '~/context/Detail.context'
import { PokemonZMove } from '~/graphql/typeGenerated'
import { getDamageTypeKorean } from '~/utils/skill.util'
import InfoCardTitleComponent from './components/InfoCardTitle.component'

/**
 * 전용 기술 카드 — Z기술·거다이맥스 기술 (기존 데/모 ZMoveInfo·GmaxMoveInfo 통합
 * 이관, 반응형 단일). 열 구성(기반 기술 등)이 습득 기술과 달라 MoveTable 대신
 * 기존 소형 표 구조를 유지한다(행 1~2개라 모바일 폭에서도 무리 없음).
 * 활성 폼에 해당 데이터가 없으면 렌더하지 않는다.
 */

const DetailExclusiveMovesContainer = () => {
  const {
    pokemonBaseInfo,
    normalForm,
    regionFormInfo,
    gigantamaxInfo,
    activeType,
    activeIndex,
  } = useContext(DetailContext)

  const isGigantamaxMode = activeType === 'gigantamax'
  const gmaxMove = isGigantamaxMode
    ? gigantamaxInfo?.[activeIndex]?.gmaxMove
    : undefined

  const getExclusiveZMoves = (): PokemonZMove[] => {
    if (isGigantamaxMode) return []
    switch (activeType) {
      case 'region': {
        return regionFormInfo?.[activeIndex]?.exclusiveZMoves ?? []
      }
      default: {
        return (
          normalForm?.[0]?.exclusiveZMoves ??
          pokemonBaseInfo?.exclusiveZMoves ??
          []
        )
      }
    }
  }
  const exclusiveZMoves = getExclusiveZMoves()

  if (!gmaxMove && exclusiveZMoves.length === 0) {
    return null
  }

  const headCellClass =
    'h-8 leading-8 text-primary-4 text-center text-xs desktop:text-sm'

  return (
    <>
      {gmaxMove && (
        <section
          aria-labelledby="pokemon-gmax-move"
          className="card-detail w-full"
        >
          <InfoCardTitleComponent
            title="거다이맥스 전용 기술"
            id="pokemon-gmax-move"
          />
          <table className="w-full table-fixed">
            <colgroup>
              <col width="35%" />
              <col width="20%" />
              <col width="15%" />
              <col width="30%" />
            </colgroup>
            <thead className="bg-primary-2">
              <tr>
                <th className={headCellClass}>기술명</th>
                <th className={headCellClass}>타입</th>
                <th className={headCellClass}>위력</th>
                <th className={headCellClass}>유형</th>
              </tr>
            </thead>
            <tbody>
              <tr className="h-10 text-xs desktop:text-base [&>td]:align-middle">
                <td className="text-center font-semibold">{gmaxMove.nameKo}</td>
                <td className="justify-items-center text-center">
                  {gmaxMove.type && <TagComponent type={gmaxMove.type} />}
                </td>
                <td className="text-center">{gmaxMove.power || '-'}</td>
                {/* 거다이맥스 기술은 기반 기술에 따라 물리/특수 모두 가능(GmaxMove에 damageType 없음 — 기존과 동일) */}
                <td className="text-center text-sm">
                  {getDamageTypeKorean('physical')} /{' '}
                  {getDamageTypeKorean('special')}
                </td>
              </tr>
            </tbody>
          </table>
          {gmaxMove.effect && (
            <p className="mt-4 text-sm leading-relaxed text-primary-2">
              {gmaxMove.effect}
            </p>
          )}
        </section>
      )}

      {exclusiveZMoves.length > 0 && (
        <section
          aria-labelledby="pokemon-z-move"
          className="card-detail w-full"
        >
          <InfoCardTitleComponent title="전용 Z기술" id="pokemon-z-move" />
          <table className="w-full table-fixed">
            <colgroup>
              <col width="30%" />
              <col width="15%" />
              <col width="10%" />
              <col width="15%" />
              <col width="30%" />
            </colgroup>
            <thead className="bg-primary-2">
              <tr>
                <th className={headCellClass}>Z기술명</th>
                <th className={headCellClass}>타입</th>
                <th className={headCellClass}>위력</th>
                <th className={headCellClass}>유형</th>
                <th className={headCellClass}>기반 기술</th>
              </tr>
            </thead>
            <tbody>
              {exclusiveZMoves.map((zMove) => (
                <tr
                  key={zMove.id}
                  className="h-10 border-b border-solid border-primary-3 text-xs last:border-b-0 desktop:text-base [&>td]:align-middle"
                >
                  <td className="break-keep text-center text-sm font-semibold">
                    {zMove.zSkill.nameKo}
                  </td>
                  <td className="justify-items-center text-center">
                    <TagComponent type={zMove.zSkill.type} />
                  </td>
                  <td className="text-center">{zMove.zSkill.power || '-'}</td>
                  <td className="text-center text-sm">
                    {getDamageTypeKorean(zMove.zSkill.damageType)}
                  </td>
                  <td className="break-keep text-center text-sm">
                    {zMove.baseSkill.nameKo}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
            <h3 className="mb-1 text-sm font-bold text-amber-800">
              전용 Z기술 정보
            </h3>
            <p className="text-sm leading-relaxed text-amber-700">
              전용 Z기술은 특정 포켓몬만 사용할 수 있는 Z기술입니다. 해당
              포켓몬이 전용 Z크리스탈을 지닌 상태에서 기반 기술을 사용하면 전용
              Z기술로 변환됩니다.
            </p>
          </div>
        </section>
      )}
    </>
  )
}

export default DetailExclusiveMovesContainer
